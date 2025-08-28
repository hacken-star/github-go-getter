import { useState } from "react";
import { ArrowLeft, Heart, MessageCircle, Eye, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface LegacyPost {
  id: string;
  text: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  views: number;
  timeAgo: string;
  color: string;
  university?: string;
  isLiked?: boolean;
}

interface Comment {
  id: string;
  text: string;
  timeAgo: string;
  likes: number;
  color: string;
}

interface LegacyPostDetailProps {
  post: LegacyPost;
  onBack: () => void;
}

const mockComments: Comment[] = [
  {
    id: "c1",
    text: "This is so relatable! I'm in the same boat 😅",
    timeAgo: "5m",
    likes: 12,
    color: "whispr-green"
  },
  {
    id: "c2",
    text: "Have you tried the Khan Academy videos? They really helped me understand the basics",
    timeAgo: "8m",
    likes: 8,
    color: "whispr-blue"
  },
  {
    id: "c3",
    text: "Form a study group! It's always easier when you're struggling together 📚",
    timeAgo: "12m",
    likes: 15,
    color: "whispr-purple"
  }
];

const LegacyPostDetail = ({ post, onBack }: LegacyPostDetailProps) => {
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleComment = () => {
    if (newComment.trim()) {
      console.log("New comment:", newComment);
      setNewComment("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-map">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Post</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Main Post */}
        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-bubble border-l-4 border-whispr-${post.color}`}>
          {/* University Badge */}
          {post.university && (
            <div className="flex items-center mb-4">
              <div className={`w-3 h-3 rounded-full bg-whispr-${post.color} mr-2`}></div>
              <span className="text-sm font-medium text-muted-foreground">{post.university}</span>
            </div>
          )}

          {/* Post Content */}
          <p className="text-foreground text-lg leading-relaxed mb-6">{post.text}</p>

          {/* Post Actions */}
          <div className="flex items-center justify-between text-muted-foreground border-t border-border pt-4">
            <div className="flex items-center gap-6">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isLiked 
                    ? 'text-whispr-pink bg-whispr-pink/10' 
                    : 'hover:text-whispr-pink hover:bg-whispr-pink/5'
                }`}
              >
                <Heart 
                  className={`h-5 w-5 transition-all duration-200 ${
                    isLiked ? 'fill-current text-whispr-pink' : ''
                  }`} 
                />
                <span className="font-medium">{likeCount}</span>
              </button>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">{post.comments}</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="h-5 w-5" />
                <span className="font-medium">{post.views}</span>
              </div>
            </div>
            
            <span className="text-sm text-muted-foreground">{post.timeAgo}</span>
          </div>
        </div>

        {/* Comment Input */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-bubble">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none border-none bg-transparent p-0 focus-visible:ring-0"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted-foreground">
                  {newComment.length}/280
                </span>
                <Button 
                  onClick={handleComment}
                  disabled={!newComment.trim()}
                  size="sm"
                  className="bg-gradient-primary text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Comments</h3>
          
          {mockComments.map((comment) => (
            <div 
              key={comment.id} 
              className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-bubble transition-all duration-300 hover:bg-white/80"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full bg-whispr-${comment.color} flex items-center justify-center`}>
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-foreground leading-relaxed mb-2">{comment.text}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{comment.likes}</span>
                    </div>
                    <span>{comment.timeAgo}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Load More Comments */}
          <div className="text-center">
            <Button variant="ghost" className="text-muted-foreground">
              Load more comments
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegacyPostDetail;