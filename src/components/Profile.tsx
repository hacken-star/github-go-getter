import { Settings, Heart, MessageCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileProps {
  onNavigate: (page: string) => void;
}

const Profile = ({ onNavigate }: ProfileProps) => {
  const userStats = {
    posts: 23,
    likes: 156,
    comments: 89,
    followers: 45
  };

  const recentPosts = [
    {
      id: "1",
      text: "Just finished my midterm! Time for some well-deserved sleep 😴",
      likes: 12,
      comments: 3,
      timeAgo: "2h",
      color: "whispr-blue"
    },
    {
      id: "2", 
      text: "The sunset from the library roof is absolutely stunning today 🌅",
      likes: 28,
      comments: 7,
      timeAgo: "1d",
      color: "whispr-orange"
    },
    {
      id: "3",
      text: "Study group for tomorrow's chemistry exam? Meet at the student center!",
      likes: 15,
      comments: 12,
      timeAgo: "3d",
      color: "whispr-green"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-map p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Profile
        </h1>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-muted rounded-full"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Profile Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-bubble mb-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16 ring-4 ring-whispr-purple/20">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback className="bg-gradient-primary text-white text-xl font-semibold">
              WU
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground mb-1">Whispr User</h2>
            <p className="text-muted-foreground">Campus Explorer</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-whispr-green rounded-full"></div>
              <span className="text-sm text-muted-foreground">Active on campus</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">{userStats.posts}</div>
            <div className="text-sm text-muted-foreground">Whisprs</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">{userStats.likes}</div>
            <div className="text-sm text-muted-foreground">Likes</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">{userStats.comments}</div>
            <div className="text-sm text-muted-foreground">Comments</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-foreground">{userStats.followers}</div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-bubble mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-whispr-purple" />
          <h3 className="font-semibold text-foreground">Recent Whisprs</h3>
        </div>
        
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <div
              key={post.id}
              className={`bg-white/60 backdrop-blur-sm rounded-xl p-4 border-l-4 border-whispr-${post.color} transition-all duration-300 hover:shadow-bubble-glow cursor-pointer`}
            >
              <p className="text-foreground mb-3 leading-relaxed">{post.text}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </div>
                </div>
                <span className="text-muted-foreground">{post.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="ghost"
          onClick={() => onNavigate("map")}
          className="bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-xl p-6 h-auto shadow-bubble transition-all duration-300 hover:shadow-bubble-glow"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-xl">🗺️</span>
            </div>
            <div className="font-medium text-foreground">Explore Campus</div>
          </div>
        </Button>
        
        <Button
          variant="ghost"
          onClick={() => onNavigate("notifications")}
          className="bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-xl p-6 h-auto shadow-bubble transition-all duration-300 hover:shadow-bubble-glow"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-bubble rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-xl">🔔</span>
            </div>
            <div className="font-medium text-foreground">Notifications</div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Profile;