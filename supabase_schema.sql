-- ==========================================
-- URBNCONNECT: SUPABASE SCHEMA INITIALIZATION
-- ==========================================

-- 1. Create the custom users table linked to Supabase Auth
CREATE TABLE public.cv_users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'citizen', -- 'citizen' or 'authority'
    voter_id TEXT,
    constituency TEXT,
    ward TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security over users
ALTER TABLE public.cv_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile." ON public.cv_users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.cv_users FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create a cv_users profile when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.cv_users (id, name, email, phone, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Citizen ' || substring(new.id::text from 1 for 5)), 
    new.email,
    new.phone,
    'citizen'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Create the Issues table
CREATE TABLE public.cv_issues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'pending',
    area TEXT,
    ward TEXT,
    municipal_zone TEXT,
    constituency TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    reported_by UUID REFERENCES public.cv_users(id),
    is_anonymous BOOLEAN DEFAULT false,
    image_url TEXT,
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cv_issues ENABLE ROW LEVEL SECURITY;
-- Everyone can read issues
CREATE POLICY "Anyone can view issues fetching" ON public.cv_issues FOR SELECT USING (true);
-- Authenticated users can insert
CREATE POLICY "Authenticated users can create an issue" ON public.cv_issues FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Authorities can update issues
CREATE POLICY "Authorities can update issues" ON public.cv_issues FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.cv_users WHERE id = auth.uid() AND role = 'authority')
);


-- 3. Community Hub: Drives Table
CREATE TABLE public.cv_community_drives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    drive_type TEXT NOT NULL, -- cleanliness, plantation, etc
    drive_date TEXT NOT NULL, 
    location TEXT NOT NULL,
    authority_name TEXT NOT NULL,
    created_by UUID REFERENCES public.cv_users(id),
    participants_count INTEGER DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cv_community_drives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view drives" ON public.cv_community_drives FOR SELECT USING (true);
CREATE POLICY "Authorities can insert drives" ON public.cv_community_drives FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.cv_users WHERE id = auth.uid() AND role = 'authority')
);


-- 4. Community Hub: Adopted Trees (My Forest)
CREATE TABLE public.cv_adopted_trees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type_id TEXT NOT NULL, -- e.g., 'neem', 'banyan'
    nickname TEXT,
    location TEXT NOT NULL,
    occasion TEXT,
    adopted_by UUID REFERENCES public.cv_users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cv_adopted_trees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own adopted trees" ON public.cv_adopted_trees FOR SELECT USING (auth.uid() = adopted_by);
CREATE POLICY "Everyone can see all trees for leaderboard" ON public.cv_adopted_trees FOR SELECT USING (true);
CREATE POLICY "Users can adopt a tree" ON public.cv_adopted_trees FOR INSERT WITH CHECK (auth.uid() = adopted_by);


-- 5. Helper Functions & Triggers
-- Update updated_at automatically on cv_issues
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cv_issues_modtime
    BEFORE UPDATE ON public.cv_issues
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
