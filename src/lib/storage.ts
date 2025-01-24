import { supabase } from "./supabase";

export const initializeStorageBucket = async () => {
  const { data: bucketExists } = await supabase.storage.getBucket('social-media');
  
  if (!bucketExists) {
    await supabase.storage.createBucket('social-media', {
      public: true,
      allowedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'video/mp4',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ],
      fileSizeLimit: 10485760 // 10MB
    });
  }
};

export const uploadFile = async (file: File, onProgress?: (progress: number) => void) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('social-media')
    .upload(filePath, file, {
      onUploadProgress: ({ progress }) => {
        onProgress?.(progress);
      }
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('social-media')
    .getPublicUrl(filePath);

  return { publicUrl, isMedia: file.type.startsWith('image/') || file.type.startsWith('video/') };
};