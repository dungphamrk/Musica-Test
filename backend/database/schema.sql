-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (To store extended user data, links to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Carts Table (One cart per user)
CREATE TABLE IF NOT EXISTS public.carts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  status text default 'active', -- 'active', 'completed', 'abandoned'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  UNIQUE(user_id, status)
);

-- 3. Cart Items Table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid default uuid_generate_v4() primary key,
  cart_id uuid references public.carts(id) on delete cascade,
  track_id text references public.tracks(id) on delete cascade,
  price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  UNIQUE(cart_id, track_id)
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete set null,
  total_amount numeric not null,
  status text default 'pending', -- 'pending', 'paid', 'failed'
  payment_method text,
  customer_name text,
  customer_email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  track_id text references public.tracks(id) on delete set null,
  price numeric not null,
  license_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Trigger to automatically create a profile when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Setup Row Level Security (RLS) for tables to secure data
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Allow users to read and update their own profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Allow backend (Service Role) to bypass all RLS policies (handled automatically by using service_role key)
