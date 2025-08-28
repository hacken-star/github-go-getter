import { useState } from "react";
import Layout from "@/components/Layout";
import UniversityMap from "@/components/UniversityMap";
import UniversityFeed from "@/components/UniversityFeed";
import CreatePost from "@/components/CreatePost";
import PostDetail from "@/components/PostDetail";
import Profile from "@/components/Profile";
import Notifications from "@/components/Notifications";
import RealHomePage from "@/components/RealHomePage";
import Auth from "@/components/Auth";
import { useAuth } from "@/hooks/useAuth";
import { Post } from "@/types/Post";

interface University {
  id: string;
  name: string;
  shortName: string;
  x: number;
  y: number;
  color: string;
  state: string;
}

const Index = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | any>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-map flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Whispr
          </h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) {
    return <Auth />;
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedUniversity(null);
    setSelectedPost(null);
    setShowCreatePost(false);
  };

  const handleSelectUniversity = (university: University) => {
    setSelectedUniversity(university);
    setCurrentPage("feed");
  };

  const handleBackToMap = () => {
    setSelectedUniversity(null);
    setCurrentPage("map");
  };

  const handleCreatePost = () => {
    setShowCreatePost(true);
  };

  const handlePostSubmit = (text: string, image?: File) => {
    console.log("Post submitted:", { text, image });
    setShowCreatePost(false);
  };

  const handlePostClick = (post: Post | any) => {
    setSelectedPost(post);
  };

  const handleBackFromPost = () => {
    setSelectedPost(null);
  };

  const handleBackFromCreate = () => {
    setShowCreatePost(false);
  };

  const renderContent = () => {
    if (showCreatePost) {
      return <CreatePost onBack={handleBackFromCreate} onSubmit={handlePostSubmit} />;
    }

    if (selectedPost) {
      // Check if it's a legacy post (has 'text' property)
      if ('text' in selectedPost) {
        const LegacyPostDetail = require('@/components/LegacyPostDetail').default;
        return <LegacyPostDetail post={selectedPost} onBack={handleBackFromPost} />;
      } else {
        return <PostDetail post={selectedPost} onBack={handleBackFromPost} />;
      }
    }

    if (currentPage === "feed" && selectedUniversity) {
      return (
        <UniversityFeed
          universityName={selectedUniversity.name}
          onBack={handleBackToMap}
          onCreatePost={handleCreatePost}
          onPostClick={handlePostClick}
        />
      );
    }

    switch (currentPage) {
      case "home":
        return <RealHomePage onPostClick={handlePostClick} />;
      case "map":
        return <UniversityMap onSelectUniversity={handleSelectUniversity} />;
      case "notifications":
        return <Notifications />;
      case "profile":
        return <Profile onNavigate={handleNavigate} />;
      default:
        return <RealHomePage onPostClick={handlePostClick} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderContent()}
    </Layout>
  );
};

export default Index;
