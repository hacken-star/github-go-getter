import { Heart, MessageCircle, UserPlus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "mention";
  message: string;
  timeAgo: string;
  isRead: boolean;
  color: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    message: "Someone liked your whispr about finals week",
    timeAgo: "5m",
    isRead: false,
    color: "whispr-pink"
  },
  {
    id: "2",
    type: "comment", 
    message: "New comment on your study group post",
    timeAgo: "15m",
    isRead: false,
    color: "whispr-blue"
  },
  {
    id: "3",
    type: "follow",
    message: "You have a new follower from your campus",
    timeAgo: "1h",
    isRead: true,
    color: "whispr-purple"
  },
  {
    id: "4",
    type: "like",
    message: "Your sunset photo got 10 new likes!",
    timeAgo: "2h",
    isRead: true,
    color: "whispr-orange"
  },
  {
    id: "5",
    type: "comment",
    message: "Someone replied to your chemistry question",
    timeAgo: "3h",
    isRead: true,
    color: "whispr-green"
  },
  {
    id: "6",
    type: "mention",
    message: "You were mentioned in a campus event post",
    timeAgo: "5h",
    isRead: true,
    color: "whispr-teal"
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "like":
      return Heart;
    case "comment":
      return MessageCircle;
    case "follow":
      return UserPlus;
    default:
      return Bell;
  }
};

const Notifications = () => {
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-map p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-muted-foreground mt-1">
              You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-whispr-purple hover:bg-whispr-purple/10"
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {mockNotifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          
          return (
            <div
              key={notification.id}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-bubble transition-all duration-300 hover:shadow-bubble-glow cursor-pointer border-l-4 border-whispr-${notification.color} ${
                !notification.isRead ? 'ring-2 ring-whispr-purple/20' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full bg-whispr-${notification.color}/10 flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-5 w-5 text-whispr-${notification.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={`text-foreground leading-relaxed ${
                    !notification.isRead ? 'font-medium' : ''
                  }`}>
                    {notification.message}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.timeAgo}
                  </p>
                </div>
                
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-whispr-purple rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State (hidden when notifications exist) */}
      {mockNotifications.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
            <Bell className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">All caught up!</h3>
          <p className="text-muted-foreground">
            You'll see notifications here when something happens with your whisprs
          </p>
        </div>
      )}

      {/* Settings */}
      <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-bubble">
        <h3 className="font-medium text-foreground mb-3">Notification Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Likes on your whisprs</span>
            <div className="w-10 h-6 bg-whispr-purple rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">New comments</span>
            <div className="w-10 h-6 bg-whispr-purple rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">New followers</span>
            <div className="w-10 h-6 bg-muted rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;