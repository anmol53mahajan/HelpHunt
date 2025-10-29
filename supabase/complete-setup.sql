-- HelpHunt Complete Database Setup (Clean Version)
-- Run this entire script in your Supabase SQL Editor

-- Drop existing policies first
DROP POLICY IF EXISTS "Profile images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload profile images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update profile images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete profile images" ON storage.objects;

-- Drop existing tables and types
DROP TABLE IF EXISTS hire_intents CASCADE;
DROP TABLE IF EXISTS employer_requests CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TYPE IF EXISTS service_category CASCADE;

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

-- Create profiles table (no auth required)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Create employer_requests table (no auth required)
CREATE TABLE employer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
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

CREATE INDEX idx_hire_intents_profile_id ON hire_intents(profile_id);

-- Disable Row Level Security (RLS) for simplicity
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE employer_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE hire_intents DISABLE ROW LEVEL SECURITY;

-- Create storage bucket for profiles (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies (simplified - no auth required)
CREATE POLICY "Profile images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'profiles');

CREATE POLICY "Anyone can upload profile images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profiles');

CREATE POLICY "Anyone can update profile images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'profiles');

CREATE POLICY "Anyone can delete profile images" ON storage.objects
  FOR DELETE USING (bucket_id = 'profiles');

-- Insert sample profiles
INSERT INTO profiles (
  full_name, gender, phone, service, experience, locality, 
  availability, skills, skill_level, expected_salary_min, expected_salary_max, 
  description, verification_status, is_pro, rating
) VALUES 
-- Maids
(
  'Priya Sharma', 'Female', '+919876543210', 'maid', 3,
  'Koramangala, Bangalore',
  '{"type": "daily", "from": "08:00", "to": "16:00"}',
  ARRAY['House Cleaning', 'Cooking', 'Laundry', 'Child Care'],
  'Medium', 8000, 12000,
  'Experienced housekeeper with excellent cooking skills. Available for daily household work.',
  'verified', true, 4.5
),
(
  'Sunita Devi', 'Female', '+919876543211', 'maid', 5,
  'Indiranagar, Bangalore',
  '{"type": "daily", "from": "09:00", "to": "17:00"}',
  ARRAY['Deep Cleaning', 'Ironing', 'Grocery Shopping'],
  'Premium', 10000, 15000,
  'Professional housekeeper with 5+ years experience. Specializes in deep cleaning.',
  'verified', true, 4.8
),
(
  'Meera Singh', 'Female', '+919876543212', 'maid', 2,
  'Whitefield, Bangalore',
  '{"type": "one-time", "date": "2024-01-15", "slot": "morning"}',
  ARRAY['Basic Cleaning', 'Dusting'],
  'Basic', 5000, 7000,
  'Reliable maid available for one-time cleaning services.',
  'pending', false, 4.2
),

-- Cooks
(
  'Rajesh Kumar', 'Male', '+919876543213', 'cook', 4,
  'JP Nagar, Bangalore',
  '{"type": "daily", "from": "10:00", "to": "14:00"}',
  ARRAY['North Indian Cuisine', 'South Indian Cuisine', 'Tiffin Preparation'],
  'Medium', 12000, 18000,
  'Professional cook specializing in both North and South Indian cuisine.',
  'verified', true, 4.7
),
(
  'Anita Reddy', 'Female', '+919876543214', 'cook', 6,
  'Electronic City, Bangalore',
  '{"type": "daily", "from": "08:00", "to": "12:00"}',
  ARRAY['South Indian Cuisine', 'Breakfast Specialties', 'Healthy Cooking'],
  'Premium', 15000, 20000,
  'Expert cook with specialization in South Indian breakfast and healthy cooking.',
  'verified', true, 4.9
),

-- Barbers
(
  'Vikram Singh', 'Male', '+919876543215', 'barber', 8,
  'MG Road, Bangalore',
  '{"type": "daily", "from": "09:00", "to": "18:00"}',
  ARRAY['Hair Cutting', 'Beard Trimming', 'Hair Styling', 'Head Massage'],
  'Premium', 20000, 30000,
  'Professional barber with 8+ years experience. Specializes in modern haircuts and styling.',
  'verified', true, 4.6
),
(
  'Ravi Kumar', 'Male', '+919876543216', 'barber', 3,
  'Malleshwaram, Bangalore',
  '{"type": "one-time", "date": "2024-01-20", "slot": "evening"}',
  ARRAY['Basic Haircut', 'Beard Trimming'],
  'Basic', 8000, 12000,
  'Skilled barber available for home visits.',
  'pending', false, 4.1
),

-- Electricians
(
  'Suresh Patel', 'Male', '+919876543217', 'electrician', 10,
  'HSR Layout, Bangalore',
  '{"type": "daily", "from": "08:00", "to": "19:00"}',
  ARRAY['Wiring', 'Switch Installation', 'Fan Repair', 'Light Fixtures', 'MCB Installation'],
  'Premium', 25000, 35000,
  'Licensed electrician with 10+ years experience. Available for all electrical work.',
  'verified', true, 4.8
),
(
  'Kiran Reddy', 'Male', '+919876543218', 'electrician', 4,
  'Bannerghatta Road, Bangalore',
  '{"type": "one-time", "date": "2024-01-18", "slot": "morning"}',
  ARRAY['Basic Wiring', 'Switch Repair', 'Fan Installation'],
  'Medium', 15000, 20000,
  'Experienced electrician for home electrical repairs and installations.',
  'verified', false, 4.3
),

-- Plumbers
(
  'Manoj Gupta', 'Male', '+919876543219', 'plumber', 7,
  'BTM Layout, Bangalore',
  '{"type": "daily", "from": "09:00", "to": "18:00"}',
  ARRAY['Pipe Repair', 'Tap Installation', 'Bathroom Fitting', 'Water Tank Installation', 'Leak Repair'],
  'Premium', 20000, 28000,
  'Professional plumber with expertise in all plumbing services.',
  'verified', true, 4.7
),
(
  'Ramesh Yadav', 'Male', '+919876543220', 'plumber', 2,
  'Marathahalli, Bangalore',
  '{"type": "one-time", "date": "2024-01-22", "slot": "afternoon"}',
  ARRAY['Basic Pipe Repair', 'Tap Replacement'],
  'Basic', 8000, 12000,
  'Reliable plumber for basic plumbing repairs and maintenance.',
  'pending', false, 4.0
),

-- Carpenters
(
  'Deepak Sharma', 'Male', '+919876543221', 'carpenter', 6,
  'Rajajinagar, Bangalore',
  '{"type": "daily", "from": "08:00", "to": "17:00"}',
  ARRAY['Furniture Making', 'Repair Work', 'Custom Carpentry', 'Door Installation', 'Cabinet Making'],
  'Medium', 18000, 25000,
  'Skilled carpenter specializing in custom furniture and repair work.',
  'verified', true, 4.5
),
(
  'Suresh Kumar', 'Male', '+919876543222', 'carpenter', 3,
  'Vijayanagar, Bangalore',
  '{"type": "one-time", "date": "2024-01-25", "slot": "morning"}',
  ARRAY['Basic Repair', 'Furniture Assembly'],
  'Basic', 10000, 15000,
  'Carpenter available for basic repair and assembly work.',
  'pending', false, 4.2
);

-- Insert sample employer requests (no auth required)
INSERT INTO employer_requests (
  phone, gender_preference, service, locality, 
  time_pref, hire_type, max_salary, skill_level, extra_filters
) VALUES 
(
  '+919876543300', 'Female', 'maid', 'Koramangala',
  '{"type": "daily", "from": "09:00", "to": "15:00"}',
  'monthly', 12000, 'Medium', '{"cooking_required": true, "child_care": false}'
),
(
  '+919876543301', 'Any', 'cook', 'Indiranagar',
  '{"type": "daily", "from": "10:00", "to": "14:00"}',
  'monthly', 18000, 'Medium', '{"cuisine_preference": "North Indian"}'
),
(
  '+919876543302', 'Male', 'barber', 'MG Road',
  '{"type": "one-time", "date": "2024-01-20", "slot": "evening"}',
  'one-time', 15000, 'Premium', '{"home_visit": true}'
),
(
  '+919876543303', 'Any', 'electrician', 'HSR Layout',
  '{"type": "one-time", "date": "2024-01-18", "slot": "morning"}',
  'one-time', 25000, 'Premium', '{"emergency": false}'
),
(
  '+919876543304', 'Any', 'plumber', 'BTM Layout',
  '{"type": "daily", "from": "09:00", "to": "17:00"}',
  'monthly', 22000, 'Medium', '{"maintenance": true}'
);

-- Insert sample hire intents (FIXED - using LIMIT 1 to avoid subquery errors)
INSERT INTO hire_intents (
  employer_name, employer_phone, profile_id, message
) VALUES 
(
  'Rajesh Kumar', '+919876543300', 
  (SELECT id FROM profiles WHERE full_name = 'Priya Sharma' LIMIT 1),
  'Hi Priya, I need a reliable maid for daily household work. Please contact me.'
),
(
  'Sunita Patel', '+919876543301',
  (SELECT id FROM profiles WHERE full_name = 'Rajesh Kumar' LIMIT 1),
  'Hello Rajesh, I am looking for a cook for North Indian cuisine. Available?'
),
(
  'Vikram Singh', '+919876543302',
  (SELECT id FROM profiles WHERE full_name = 'Vikram Singh' LIMIT 1),
  'Hi Vikram, I need a haircut at home. When are you available?'
);
