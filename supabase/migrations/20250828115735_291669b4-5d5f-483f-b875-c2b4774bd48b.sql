-- Check if profiles table exists and add missing columns if needed
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'username') THEN
    ALTER TABLE public.profiles ADD COLUMN username TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'display_name') THEN
    ALTER TABLE public.profiles ADD COLUMN display_name TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- Add user_id to posts table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'user_id') THEN
    ALTER TABLE public.posts ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add user_id to comments table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'user_id') THEN
    ALTER TABLE public.comments ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add user_id to reactions table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reactions' AND column_name = 'user_id') THEN
    ALTER TABLE public.reactions ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add parent_id to comments table for replies if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'parent_id') THEN
    ALTER TABLE public.comments ADD COLUMN parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'reply')),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  triggered_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days')
);

-- Add RLS policies for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to create notifications
CREATE OR REPLACE FUNCTION public.create_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notification for post owner when someone likes or comments
  IF TG_TABLE_NAME = 'reactions' THEN
    INSERT INTO public.notifications (user_id, type, post_id, triggered_by_user_id)
    SELECT p.user_id, 'like', NEW.post_id, NEW.user_id
    FROM public.posts p
    WHERE p.id = NEW.post_id AND p.user_id != NEW.user_id AND p.user_id IS NOT NULL;
  ELSIF TG_TABLE_NAME = 'comments' THEN
    -- Notification for post owner
    INSERT INTO public.notifications (user_id, type, post_id, comment_id, triggered_by_user_id)
    SELECT p.user_id, 'comment', NEW.post_id, NEW.id, NEW.user_id
    FROM public.posts p
    WHERE p.id = NEW.post_id AND p.user_id != NEW.user_id AND p.user_id IS NOT NULL;
    
    -- Notification for parent comment owner (if it's a reply)
    IF NEW.parent_id IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, type, comment_id, triggered_by_user_id)
      SELECT c.user_id, 'reply', NEW.id, NEW.user_id
      FROM public.comments c
      WHERE c.id = NEW.parent_id AND c.user_id != NEW.user_id AND c.user_id IS NOT NULL;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for notifications
DROP TRIGGER IF EXISTS create_notification_on_reaction ON public.reactions;
DROP TRIGGER IF EXISTS create_notification_on_comment ON public.comments;

CREATE TRIGGER create_notification_on_reaction
  AFTER INSERT ON public.reactions
  FOR EACH ROW EXECUTE FUNCTION public.create_notification();

CREATE TRIGGER create_notification_on_comment
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.create_notification();

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Enable realtime for posts, comments, and reactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reactions;
ALTER TABLE public.posts REPLICA IDENTITY FULL;
ALTER TABLE public.comments REPLICA IDENTITY FULL;
ALTER TABLE public.reactions REPLICA IDENTITY FULL;