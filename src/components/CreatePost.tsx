import { useState } from "react";
import { ArrowLeft, Image, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface CreatePostProps {
  onBack: () => void;
  onSubmit: (text: string, image?: File) => void;
}

const CreatePost = ({ onBack, onSubmit }: CreatePostProps) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!text.trim()) {
      toast({
        title: "Empty post",
        description: "Please write something before posting",
        variant: "destructive",
      });
      return;
    }

    onSubmit(text, image || undefined);
    setText("");
    setImage(null);
    setImagePreview(null);
    
    toast({
      title: "Post created!",
      description: "Your whispr has been shared with the campus",
    });
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
            <h1 className="font-semibold text-foreground">New Whispr</h1>
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="bg-gradient-primary text-white shadow-bubble-glow hover:shadow-bubble transition-all duration-300 disabled:opacity-50"
          >
            <Send className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>

      {/* Create Post Form */}
      <div className="p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-bubble">
          {/* Text Input */}
          <Textarea
            placeholder="What's happening on campus? Share your thoughts..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-32 border-none bg-transparent resize-none text-foreground placeholder:text-muted-foreground focus-visible:ring-0 p-0 text-base"
            maxLength={280}
          />
          
          {/* Character Count */}
          <div className="flex justify-end mt-2">
            <span className={`text-sm ${text.length > 250 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {text.length}/280
            </span>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-xl"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 rounded-full p-2"
              >
                ×
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => document.getElementById('image-upload')?.click()}
                className="text-whispr-purple hover:bg-whispr-purple/10 rounded-full p-2"
              >
                <Image className="h-5 w-5" />
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Share anonymously with your campus community
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-bubble">
          <h3 className="font-medium text-foreground mb-2">Community Guidelines</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Be respectful and kind to fellow students</li>
            <li>• No personal attacks or harassment</li>
            <li>• Keep content relevant to campus life</li>
            <li>• Report inappropriate content</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;