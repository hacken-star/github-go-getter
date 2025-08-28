-- Add profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add user_id to posts table
ALTER TABLE public.posts ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to comments table  
ALTER TABLE public.comments ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to reactions table
ALTER TABLE public.reactions ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key relationships
ALTER TABLE public.posts ADD CONSTRAINT posts_university_id_fkey 
FOREIGN KEY (university_id) REFERENCES public.universities(id);

ALTER TABLE public.comments ADD CONSTRAINT comments_post_id_fkey 
FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

ALTER TABLE public.reactions ADD CONSTRAINT reactions_post_id_fkey 
FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;

-- Add parent_id for comment replies
ALTER TABLE public.comments ADD COLUMN parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE;

-- Create notifications table
CREATE TABLE public.notifications (
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

-- Update RLS policies for posts to require authentication
DROP POLICY "Anyone can create posts" ON public.posts;
DROP POLICY "Posts are viewable by everyone" ON public.posts;

CREATE POLICY "Authenticated users can create posts" 
ON public.posts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Posts are viewable by everyone" 
ON public.posts 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own posts" 
ON public.posts 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Update RLS policies for comments to require authentication
DROP POLICY "Anyone can create comments" ON public.comments;

CREATE POLICY "Authenticated users can create comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.comments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Update RLS policies for reactions to require authentication
DROP POLICY "Anyone can create reactions" ON public.reactions;

CREATE POLICY "Authenticated users can create reactions" 
ON public.reactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" 
ON public.reactions 
FOR DELETE 
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
    WHERE p.id = NEW.post_id AND p.user_id != NEW.user_id;
  ELSIF TG_TABLE_NAME = 'comments' THEN
    -- Notification for post owner
    INSERT INTO public.notifications (user_id, type, post_id, comment_id, triggered_by_user_id)
    SELECT p.user_id, 'comment', NEW.post_id, NEW.id, NEW.user_id
    FROM public.posts p
    WHERE p.id = NEW.post_id AND p.user_id != NEW.user_id;
    
    -- Notification for parent comment owner (if it's a reply)
    IF NEW.parent_id IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, type, comment_id, triggered_by_user_id)
      SELECT c.user_id, 'reply', NEW.id, NEW.user_id
      FROM public.comments c
      WHERE c.id = NEW.parent_id AND c.user_id != NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for notifications
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