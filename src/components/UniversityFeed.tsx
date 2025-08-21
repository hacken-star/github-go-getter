import { Heart, MessageCircle, Eye, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface UniversityFeedProps {
  universityName: string;
  onBack: () => void;
  onCreatePost: () => void;
  onPostClick: (post: Post) => void;
}

const mockPosts: Post[] = [
  {
    id: "1",
    text: "Finals week is killing me! Anyone else pulling all-nighters? 😭",
    likes: 24,
    comments: 8,
    views: 156,
    timeAgo: "2h",
    color: "whispr-blue"
  },
  {
    id: "2",
    text: "The cafeteria food today was actually good for once! What happened? 😂",
    likes: 18,
    comments: 12,
    views: 89,
    timeAgo: "4h",
    color: "whispr-green"
  },
  {
    id: "3",
    text: "Prof Johnson's lecture was so confusing today. Did anyone understand the quantum mechanics part?",
    likes: 31,
    comments: 15,
    views: 203,
    timeAgo: "6h",
    color: "whispr-pink"
  },
  {
    id: "4",
    text: "Campus WiFi is down AGAIN. How are we supposed to submit assignments? 🤦‍♀️",
    likes: 45,
    comments: 23,
    views: 178,
    timeAgo: "8h",
    color: "whispr-purple"
  },
  {
    id: "5",
    text: "Found a lost wallet near the library. DM me if it's yours!",
    likes: 67,
    comments: 5,
    views: 234,
    timeAgo: "12h",
    color: "whispr-yellow"
  },
  {
    id: "6",
    text: "Study group for Organic Chemistry forming! We meet every Tuesday and Thursday at 7 PM in the library. All welcome! 📚✨",
    likes: 89,
    comments: 34,
    views: 445,
    timeAgo: "1d",
    color: "whispr-teal"
  }
];

const UniversityFeed = ({ universityName, onBack, onCreatePost, onPostClick }: UniversityFeedProps) => {
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
            <div>
              <h1 className="font-semibold text-foreground">{universityName}</h1>
              <p className="text-sm text-muted-foreground">Campus Feed</p>
            </div>
          </div>
          
          <Button
            onClick={onCreatePost}
            size="sm"
            className="bg-gradient-primary text-white shadow-bubble-glow hover:shadow-bubble transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-1" />
            Post
          </Button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="p-4 space-y-4">
        {mockPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => onPostClick(post)}
            className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-bubble cursor-pointer transition-all duration-300 hover:shadow-bubble-glow hover:bg-white/90 border-l-4 border-whispr-${post.color}`}
          >
            {/* Post Content */}
            <p className="text-foreground mb-4 leading-relaxed">{post.text}</p>

            {/* Post Stats */}
            <div className="flex items-center justify-between text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 hover:text-whispr-pink transition-colors cursor-pointer">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">{post.likes}</span>
                </div>
                
                <div className="flex items-center gap-1 hover:text-whispr-blue transition-colors cursor-pointer">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">{post.comments}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">{post.views}</span>
                </div>
              </div>
              
              <span className="text-sm">{post.timeAgo}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Loading state placeholder */}
      <div className="p-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-bubble animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
          <div className="flex gap-4">
            <div className="h-3 bg-muted rounded w-12"></div>
            <div className="h-3 bg-muted rounded w-12"></div>
            <div className="h-3 bg-muted rounded w-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityFeed;