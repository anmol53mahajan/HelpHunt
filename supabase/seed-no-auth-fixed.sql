-- HelpHunt Seed Data (No Auth Version) - FIXED
-- Run this after schema-no-auth.sql in your Supabase SQL editor

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
