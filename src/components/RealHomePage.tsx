import { useState, useEffect } from "react";
import { Heart, MessageCircle, Eye, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Post } from "@/types/Post";

interface RealHomePageProps {
  onPostClick: (post: Post) => void;
}

const RealHomePage = ({ onPostClick }: RealHomePageProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          image_url,
          likes_count,
          comments_count,
          views_count,
          created_at,
          color,
          universities!inner (name, short_name),
          profiles!inner (username, display_name)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      if (data) {
        // Fetch user reactions separately
        const postIds = data.map(p => p.id);
        const { data: reactions } = await supabase
          .from('reactions')
          .select('post_id, user_id')
          .in('post_id', postIds);

        const postsWithReactions = data.map(post => ({
          id: post.id,
          content: post.content,
          imageUrl: post.image_url,
          likes_count: post.likes_count,
          comments_count: post.comments_count,
          views_count: post.views_count,
          created_at: post.created_at,
          color: post.color,
          universities: Array.isArray(post.universities) ? post.universities[0] : post.universities,
          profiles: Array.isArray(post.profiles) ? post.profiles[0] : post.profiles,
          user_reactions: reactions?.filter(r => r.post_id === post.id) || []
        }));

        setPosts(postsWithReactions);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Subscribe to real-time updates
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        () => fetchPosts()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reactions'
        },
        () => fetchPosts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleLike = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like posts.",
        variant: "destructive"
      });
      return;
    }

    try {
      const post = posts.find(p => p.id === postId);
      const hasLiked = post?.user_reactions?.some(r => r.user_id === user.id);

      if (hasLiked) {
        // Unlike
        await supabase
          .from('reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('reactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: 'like'
          });
      }

      // Refresh posts to get updated counts
      fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "now";
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-map">
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-border p-4">
          <div className="flex items-center justify-center">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Whispr
            </h1>
          </div>
          <p className="text-center text-muted-foreground mt-1">
            See what's happening across all campuses
          </p>
        </div>

        <div className="p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-bubble animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
              <div className="flex gap-4">
                <div className="h-3 bg-muted rounded w-12"></div>
                <div className="h-3 bg-muted rounded w-12"></div>
                <div className="h-3 bg-muted rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-map">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-border p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Whispr
          </h1>
        </div>
        <p className="text-center text-muted-foreground mt-1">
          See what's happening across all campuses
        </p>
      </div>

      {/* Posts Feed */}
      <div className="p-4 space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => {
            const hasLiked = user && post.user_reactions?.some(r => r.user_id === user.id);
            
            return (
              <div
                key={post.id}
                onClick={() => onPostClick(post)}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-bubble cursor-pointer transition-all duration-300 hover:shadow-bubble-glow hover:bg-white/90 border-l-4`}
                style={{ borderLeftColor: `hsl(var(--whispr-${post.color}))` }}
              >
                {/* University and User Info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: `hsl(var(--whispr-${post.color}))` }}></div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {post.universities?.name || 'Unknown University'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-3 w-3 mr-1" />
                    <span>{post.profiles?.display_name || post.profiles?.username || 'Anonymous'}</span>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

                {/* Post Stats */}
                <div className="flex items-center justify-between text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div 
                      className={`flex items-center gap-1 transition-colors cursor-pointer ${
                        hasLiked ? 'text-red-500' : 'hover:text-red-500'
                      }`}
                      onClick={(e) => handleLike(post.id, e)}
                    >
                      <Heart className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.likes_count}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{post.comments_count}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">{post.views_count}</span>
                    </div>
                  </div>
                  
                  <span className="text-sm">{getTimeAgo(post.created_at)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RealHomePage;