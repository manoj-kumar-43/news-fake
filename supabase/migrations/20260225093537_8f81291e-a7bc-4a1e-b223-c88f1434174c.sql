
-- Fix analysis_history policies: drop restrictive, recreate as permissive
DROP POLICY IF EXISTS "Admins can delete any analysis" ON public.analysis_history;
DROP POLICY IF EXISTS "Admins can view all analyses" ON public.analysis_history;
DROP POLICY IF EXISTS "Users can delete their own analyses" ON public.analysis_history;
DROP POLICY IF EXISTS "Users can insert their own analyses" ON public.analysis_history;
DROP POLICY IF EXISTS "Users can read their own analyses" ON public.analysis_history;

CREATE POLICY "Users can read their own analyses" ON public.analysis_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own analyses" ON public.analysis_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own analyses" ON public.analysis_history FOR DELETE USING (auth.uid() = user_id);

-- Fix analysis_ratings policies
DROP POLICY IF EXISTS "Users can delete their own ratings" ON public.analysis_ratings;
DROP POLICY IF EXISTS "Users can rate analyses" ON public.analysis_ratings;
DROP POLICY IF EXISTS "Users can update their own ratings" ON public.analysis_ratings;
DROP POLICY IF EXISTS "Users can view their own ratings" ON public.analysis_ratings;

CREATE POLICY "Users can view their own ratings" ON public.analysis_ratings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can rate analyses" ON public.analysis_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own ratings" ON public.analysis_ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own ratings" ON public.analysis_ratings FOR DELETE USING (auth.uid() = user_id);

-- Fix feedback policies
DROP POLICY IF EXISTS "Admins can delete feedback" ON public.feedback;
DROP POLICY IF EXISTS "Admins can update feedback" ON public.feedback;
DROP POLICY IF EXISTS "Users can insert feedback" ON public.feedback;
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.feedback;

CREATE POLICY "Users can view their own feedback" ON public.feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert feedback" ON public.feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fix profiles policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Fix user_roles policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
