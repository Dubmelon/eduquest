import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/storage";
import { PostForm } from "./post/PostForm";
import { FileUploader } from "./post/FileUploader";
import { HashtagManager } from "./post/HashtagManager";

export const CreatePost = () => {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: async ({ content, mediaUrls, fileUrls, hashtags }: { 
      content: string; 
      mediaUrls: string[]; 
      fileUrls: string[];
      hashtags: string[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("social_posts")
        .insert({
          content,
          user_id: user.id,
          media_urls: mediaUrls,
          file_urls: fileUrls,
          hashtags,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setContent("");
      setFiles([]);
      setHashtags([]);
      setUploadProgress({});
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const validateFile = (file: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "File type not supported",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(validateFile);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleHashtagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && hashtagInput.trim()) {
      e.preventDefault();
      const newHashtag = hashtagInput.startsWith('#') ? hashtagInput : `#${hashtagInput}`;
      if (!hashtags.includes(newHashtag)) {
        setHashtags([...hashtags, newHashtag]);
      }
      setHashtagInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && files.length === 0) return;
    
    setIsUploading(true);
    try {
      const mediaUrls: string[] = [];
      const fileUrls: string[] = [];

      for (const file of files) {
        const result = await uploadFile(file, (progress) => {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: progress
          }));
        });

        if (result.publicUrl) {
          if (result.isMedia) {
            mediaUrls.push(result.publicUrl);
          } else {
            fileUrls.push(result.publicUrl);
          }
        }
      }

      await createPostMutation.mutateAsync({ content, mediaUrls, fileUrls, hashtags });
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Error",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <PostForm
        content={content}
        isUploading={isUploading}
        onContentChange={setContent}
        onSubmit={handleSubmit}
      />
      
      <HashtagManager
        hashtags={hashtags}
        hashtagInput={hashtagInput}
        isUploading={isUploading}
        onHashtagInputChange={setHashtagInput}
        onHashtagAdd={handleHashtagAdd}
        onHashtagRemove={(index) => setHashtags(hashtags.filter((_, i) => i !== index))}
      />

      <FileUploader
        files={files}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        onFileSelect={handleFileSelect}
        onFileRemove={(fileToRemove) => setFiles(files.filter(f => f !== fileToRemove))}
      />
    </div>
  );
};