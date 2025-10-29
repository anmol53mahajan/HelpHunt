-- HelpHunt Database Schema
-- Run this in your Supabase SQL editor

-- Create service category enum
CREATE TYPE service_category AS ENUM (
  'maid',
  'cook', 
  'barber',
  'electrician',
  'plumber',
  'carpenter',
  'other'
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  phone TEXT NOT NULL,
  service service_category NOT NULL,
  experience INTEGER NOT NULL DEFAULT 0,
  locality TEXT NOT NULL,
  availability JSONB NOT NULL DEFAULT '{"type": "daily", "from": "09:00", "to": "17:00"}',
  skills TEXT[] DEFAULT '{}',
  skill_level TEXT NOT NULL DEFAULT 'Basic' CHECK (skill_level IN ('Basic', 'Medium', 'Premium')),
  expected_salary_min INTEGER NOT NULL DEFAULT 0,
  expected_salary_max INTEGER NOT NULL DEFAULT 0,
  description TEXT DEFAULT '',
  photo_url TEXT,
  id_proof_url TEXT,
  selfie_url TEXT,
  audio_url TEXT,
  rating NUMERIC DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  is_pro BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create employer_requests table
CREATE TABLE employer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_user_id UUID REFERENCES auth.users(id),
  phone TEXT NOT NULL,
  otp_verified BOOLEAN DEFAULT false,
  gender_preference TEXT,
  service service_category NOT NULL,
  locality TEXT NOT NULL,
  time_pref JSONB NOT NULL DEFAULT '{"type": "daily", "from": "09:00", "to": "17:00"}',
  hire_type TEXT NOT NULL DEFAULT 'one-time' CHECK (hire_type IN ('one-time', 'monthly')),
  max_salary INTEGER NOT NULL DEFAULT 0,
  skill_level TEXT NOT NULL DEFAULT 'Basic' CHECK (skill_level IN ('Basic', 'Medium', 'Premium')),
  extra_filters JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create hire_intents table
CREATE TABLE hire_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_name TEXT NOT NULL,
  employer_phone TEXT NOT NULL,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_service ON profiles(service);
CREATE INDEX idx_profiles_locality ON profiles(locality);
CREATE INDEX idx_profiles_verification ON profiles(verification_status);
CREATE INDEX idx_profiles_skill_level ON profiles(skill_level);
CREATE INDEX idx_profiles_rating ON profiles(rating DESC);
CREATE INDEX idx_profiles_is_pro ON profiles(is_pro);

CREATE INDEX idx_employer_requests_service ON employer_requests(service);
CREATE INDEX idx_employer_requests_locality ON employer_requests(locality);
CREATE INDEX idx_employer_requests_otp_verified ON employer_requests(otp_verified);

CREATE INDEX idx_hire_intents_profile_id ON hire_intents(profile_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE hire_intents ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for employer_requests table
CREATE POLICY "Employer requests are viewable by everyone" ON employer_requests
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own employer requests" ON employer_requests
  FOR INSERT WITH CHECK (auth.uid() = requester_user_id);

-- Create policies for hire_intents table
CREATE POLICY "Hire intents are viewable by everyone" ON hire_intents
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert hire intents" ON hire_intents
  FOR INSERT WITH CHECK (true);

-- Create storage bucket for profiles
INSERT INTO storage.buckets (id, name, public) VALUES ('profiles', 'profiles', true);

-- Create storage policies
CREATE POLICY "Profile images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'profiles');

CREATE POLICY "Users can upload their own profile images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile images" ON storage.objects
  FOR DELETE USING (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);
