import { useState } from "react";
import { ArrowLeft, Heart, MessageCircle, Eye, Send, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface Post {
  id: string;
  text: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  views: number;
  timeAgo: string;
  color: string;
}

interface Comment {
  id: string;
  text: string;
  timeAgo: string;
  likes: number;
  color: string;
}

interface PostDetailProps {
  post: Post;
  onBack: () => void;
}

const mockComments: Comment[] = [
  {
    id: "1",
    text: "Same here! I've been living on coffee and determination 😅",
    timeAgo: "1h",
    likes: 5,
    color: "whispr-green"
  },
  {
    id: "2", 
    text: "The library is packed at 2 AM. Crazy times!",
    timeAgo: "45m",
    likes: 3,
    color: "whispr-purple"
  },
  {
    id: "3",
    text: "You got this! Just a few more days until winter break 💪",
    timeAgo: "30m",
    likes: 8,
    color: "whispr-pink"
  }
];

const PostDetail = ({ post, onBack }: PostDetailProps) => {
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const { toast } = useToast();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleComment = () => {
    if (!newComment.trim()) return;
    
    // In a real app, this would submit to Supabase
    toast({
      title: "Comment posted!",
      description: "Your comment has been added to the discussion",
    });
    setNewComment("");
  };

  return (
    <div className="min-h-screen bg-gradient-map">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 hover:bg-muted rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold text-foreground">Whispr</h1>
          </div>
          
          <Button variant="ghost" size="sm" className="p-2 hover:bg-muted rounded-full">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        {/* Original Post */}
        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-bubble border-l-4 border-whispr-${post.color} mb-6`}>
          <p className="text-foreground text-lg leading-relaxed mb-6">{post.text}</p>
          
          {/* Post Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex items-center gap-2 hover:bg-whispr-pink/10 rounded-full p-2 transition-all duration-300 ${
                  isLiked ? 'text-whispr-pink' : 'text-muted-foreground'
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likeCount}</span>
              </Button>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-5 w-5" />
                <span>{post.comments}</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="h-5 w-5" />
                <span>{post.views}</span>
              </div>
            </div>
            
            <span className="text-sm text-muted-foreground">{post.timeAgo}</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-bubble mb-6">
          <h3 className="font-semibold text-foreground mb-4">Comments</h3>
          
          {/* Comment Input */}
          <div className="mb-6">
            <Textarea
              placeholder="Add a thoughtful comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="border-border bg-white/50 rounded-xl resize-none"
              rows={3}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">
                {newComment.length}/280
              </span>
              <Button
                onClick={handleComment}
                disabled={!newComment.trim()}
                size="sm"
                className="bg-gradient-primary text-white shadow-bubble-glow hover:shadow-bubble transition-all duration-300"
              >
                <Send className="h-4 w-4 mr-1" />
                Post
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {mockComments.map((comment) => (
              <div
                key={comment.id}
                className={`bg-white/60 backdrop-blur-sm rounded-xl p-4 border-l-2 border-whispr-${comment.color}`}
              >
                <p className="text-foreground mb-3 leading-relaxed">{comment.text}</p>
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 hover:bg-whispr-pink/10 text-muted-foreground hover:text-whispr-pink rounded-full p-1 transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">{comment.likes}</span>
                  </Button>
                  <span className="text-sm text-muted-foreground">{comment.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading placeholder for more comments */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-bubble animate-pulse">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-muted rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;