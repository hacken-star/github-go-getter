import { useState } from "react";
import Layout from "@/components/Layout";
import UniversityMap from "@/components/UniversityMap";
import UniversityFeed from "@/components/UniversityFeed";
import CreatePost from "@/components/CreatePost";
import PostDetail from "@/components/PostDetail";
import Profile from "@/components/Profile";
import Notifications from "@/components/Notifications";

interface University {
  id: string;
  name: string;
  shortName: string;
  x: number;
  y: number;
  color: string;
  state: string;
}

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

const Index = () => {
  const [currentPage, setCurrentPage] = useState("map");
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

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

  const handlePostClick = (post: Post) => {
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
      return <PostDetail post={selectedPost} onBack={handleBackFromPost} />;
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
      case "map":
        return <UniversityMap onSelectUniversity={handleSelectUniversity} />;
      case "notifications":
        return <Notifications />;
      case "profile":
        return <Profile onNavigate={handleNavigate} />;
      default:
        return <UniversityMap onSelectUniversity={handleSelectUniversity} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderContent()}
    </Layout>
  );
};

export default Index;
