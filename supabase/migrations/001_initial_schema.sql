-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  icon_url VARCHAR(255),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname VARCHAR(50),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(100),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  score INTEGER CHECK (score >= -1 AND score <= 5), -- -1: 안해봤어요, 0-5: 점수
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_activity UNIQUE(user_id, activity_id),
  CONSTRAINT unique_session_activity UNIQUE(session_id, activity_id)
);

-- Create analysis_results table
CREATE TABLE IF NOT EXISTS analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(100),
  summary_json JSONB NOT NULL,
  image_url VARCHAR(255),
  share_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_activities_category ON activities(category);
CREATE INDEX idx_activities_order ON activities(order_index);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_ratings_session_id ON ratings(session_id);
CREATE INDEX idx_ratings_activity_id ON ratings(activity_id);
CREATE INDEX idx_analysis_results_user_id ON analysis_results(user_id);
CREATE INDEX idx_analysis_results_session_id ON analysis_results(session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Activities: Anyone can read
CREATE POLICY "Activities are viewable by everyone" 
  ON activities FOR SELECT 
  USING (true);

-- Users: Users can read and update their own data
CREATE POLICY "Users can view own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Ratings: Anyone can create, users can read/update their own
CREATE POLICY "Anyone can create ratings" 
  ON ratings FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view own ratings" 
  ON ratings FOR SELECT 
  USING (
    (auth.uid() = user_id) OR 
    (session_id IS NOT NULL)
  );

CREATE POLICY "Users can update own ratings" 
  ON ratings FOR UPDATE 
  USING (
    (auth.uid() = user_id) OR 
    (session_id IS NOT NULL)
  );

-- Analysis Results: Anyone can create, users can read their own
CREATE POLICY "Anyone can create analysis results" 
  ON analysis_results FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view own analysis results" 
  ON analysis_results FOR SELECT 
  USING (
    (auth.uid() = user_id) OR 
    (session_id IS NOT NULL)
  );

CREATE POLICY "Anyone can update share count" 
  ON analysis_results FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- Functions for updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();