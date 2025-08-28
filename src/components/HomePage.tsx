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
    university: "University of Jos",
    isLiked: false
  },
  {
    id: "h2", 
    text: "The sunset from Karl-Kumm campus today was absolutely breathtaking! 🌅",
    likes: 128,
    comments: 34,
    views: 567,
    timeAgo: "1h",
    color: "whispr-orange",
    university: "Karl-Kumm University",
    isLiked: false
  },
  {
    id: "h3",
    text: "Our mining and geosciences lab is accepting new members! If you're interested in geology and mining tech, this is your chance ⛏️",
    likes: 89,
    comments: 56,
    views: 890,
    timeAgo: "2h",
    color: "whispr-purple",
    university: "Nigerian Institute Of Mining & Geosciences",
    isLiked: false
  },
  {
    id: "h4",
    text: "Plateau State University's food court is on another level today. The local delicacies are a must-try! 🍲",
    likes: 73,
    comments: 19,
    views: 345,
    timeAgo: "3h",
    color: "whispr-green",
    university: "Plateau State University",
    isLiked: false
  },
  {
    id: "h5",
    text: "Federal University of Education's library is absolutely stunning during harmattan. Perfect study vibes 📚",
    likes: 156,
    comments: 42,
    views: 678,
    timeAgo: "4h",
    color: "whispr-pink",
    university: "Federal University of Education",
    isLiked: false
  },
  {
    id: "h6",
    text: "Anan University's campus tours are starting soon! Great opportunity for prospective students to see what we're all about ✨",
    likes: 94,
    comments: 28,
    views: 456,
    timeAgo: "5h",
    color: "whispr-teal",
    university: "Anan University",
    isLiked: false
  },
  {
    id: "h7",
    text: "Royal College Of Health just announced some exciting new clinical internship opportunities with major hospitals! 🏥",
    likes: 67,
    comments: 15,
    views: 289,
    timeAgo: "6h",
    color: "whispr-yellow",
    university: "Royal College Of Health",
    isLiked: false
  },
  {
    id: "h8",
    text: "Federal College of Forestry is hosting a renowned botanist next week. Free refreshments and amazing nature science! 🌳🔬",
    likes: 112,
    comments: 38,
    views: 523,
    timeAgo: "7h",
    color: "whispr-indigo",
    university: "Federal College of Forestry",
    isLiked: false
  },
  {
    id: "h9",
    text: "Medical lab practicals at FCVMLT Vom were intense today! Learning so much about veterinary diagnostics 🔬🐕",
    likes: 85,
    comments: 24,
    views: 412,
    timeAgo: "8h",
    color: "whispr-blue",
    university: "FCVMLT Vom",
    isLiked: false
  },
  {
    id: "h10",
    text: "College of Health Technology Zawan's nursing program is truly exceptional. Proud to be part of this institution! 👩‍⚕️",
    likes: 58,
    comments: 17,
    views: 267,
    timeAgo: "9h",
    color: "whispr-green",
    university: "College of Health Technology",
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
            Whispr
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
            className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-bubble cursor-pointer transition-all duration-300 hover:shadow-bubble-glow hover:bg-white/90 border-l-4`}
            style={{ borderLeftColor: `hsl(var(--whispr-${post.color}))` }}
          >
            {/* University Badge */}
            <div className="flex items-center mb-3">
              <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: `hsl(var(--whispr-${post.color}))` }}></div>
              <span className="text-sm font-medium text-muted-foreground">{post.university}</span>
            </div>

            {/* Post Content */}
            <p className="text-foreground mb-4 leading-relaxed">{post.text}</p>

            {/* Post Stats */}
            <div className="flex items-center justify-between text-muted-foreground">
              <div className="flex items-center gap-4">
                <div 
                  className={`flex items-center gap-1 transition-colors cursor-pointer ${
                    post.isLiked ? 'text-red-500' : 'hover:text-red-500'
                  }`}
                  onClick={(e) => handleLike(post.id, e)}
                >
                  <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{post.likes}</span>
                </div>
                
                <div className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer">
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