import { useState } from "react";
import { Heart, MessageCircle, Eye, ArrowLeft } from "lucide-react";
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
  university: string;
  isLiked: boolean;
}

interface HomePageProps {
  onPostClick: (post: Post) => void;
}

const mockHomePosts: Post[] = [
  {
    id: "h1",
    text: "Anyone else struggling with organic chemistry? The midterm is next week and I'm completely lost 😭",
    likes: 47,
    comments: 23,
    views: 234,
    timeAgo: "15m",
    color: "whispr-blue",
    university: "Harvard University",
    isLiked: false
  },
  {
    id: "h2", 
    text: "The sunset from the Stanford campus today was absolutely breathtaking! 🌅",
    likes: 128,
    comments: 34,
    views: 567,
    timeAgo: "1h",
    color: "whispr-orange",
    university: "Stanford University",
    isLiked: false
  },
  {
    id: "h3",
    text: "MIT's robotics lab is accepting new members! If you're interested in AI and robotics, this is your chance 🤖",
    likes: 89,
    comments: 56,
    views: 890,
    timeAgo: "2h",
    color: "whispr-purple",
    university: "MIT",
    isLiked: false
  },
  {
    id: "h4",
    text: "Berkeley's food trucks are on another level today. The Korean BBQ truck is a must-try! 🌮",
    likes: 73,
    comments: 19,
    views: 345,
    timeAgo: "3h",
    color: "whispr-green",
    university: "UC Berkeley",
    isLiked: false
  },
  {
    id: "h5",
    text: "Yale's library is absolutely stunning during autumn. Perfect study vibes with all the fall colors 📚🍂",
    likes: 156,
    comments: 42,
    views: 678,
    timeAgo: "4h",
    color: "whispr-pink",
    university: "Yale University",
    isLiked: false
  },
  {
    id: "h6",
    text: "Princeton's campus tours are starting soon! Great opportunity for prospective students to see what we're all about ✨",
    likes: 94,
    comments: 28,
    views: 456,
    timeAgo: "5h",
    color: "whispr-teal",
    university: "Princeton University",
    isLiked: false
  },
  {
    id: "h7",
    text: "Columbia's journalism program just announced some exciting new internship opportunities with major news outlets! 📰",
    likes: 67,
    comments: 15,
    views: 289,
    timeAgo: "6h",
    color: "whispr-yellow",
    university: "Columbia University",
    isLiked: false
  },
  {
    id: "h8",
    text: "UChicago's physics department is hosting a Nobel laureate next week. Free pizza and mind-blowing science! 🍕⚛️",
    likes: 112,
    comments: 38,
    views: 523,
    timeAgo: "7h",
    color: "whispr-indigo",
    university: "University of Chicago",
    isLiked: false
  }
];

const HomePage = ({ onPostClick }: HomePageProps) => {
  const [posts, setPosts] = useState<Post[]>(mockHomePosts);

  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked
            }
          : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-map">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-border p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Campus Feed
          </h1>
        </div>
        <p className="text-center text-muted-foreground mt-1">
          See what's happening across all campuses
        </p>
      </div>

      {/* Posts Feed */}
      <div className="p-4 space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => onPostClick(post)}
            className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-bubble cursor-pointer transition-all duration-300 hover:shadow-bubble-glow hover:bg-white/90 border-l-4 border-whispr-${post.color}`}
          >
            {/* University Badge */}
            <div className="flex items-center mb-3">
              <div className={`w-3 h-3 rounded-full bg-whispr-${post.color} mr-2`}></div>
              <span className="text-sm font-medium text-muted-foreground">{post.university}</span>
            </div>

            {/* Post Content */}
            <p className="text-foreground mb-4 leading-relaxed">{post.text}</p>

            {/* Post Stats */}
            <div className="flex items-center justify-between text-muted-foreground">
              <div className="flex items-center gap-4">
                <div 
                  className={`flex items-center gap-1 transition-colors cursor-pointer ${
                    post.isLiked ? 'text-whispr-pink' : 'hover:text-whispr-pink'
                  }`}
                  onClick={(e) => handleLike(post.id, e)}
                >
                  <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
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

export default HomePage;