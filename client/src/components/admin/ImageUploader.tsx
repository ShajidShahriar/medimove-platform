import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploaderProps {
  existingImages: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUploader({ existingImages, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  // 1. COMPRESSION CONFIG
  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 0.5, // Max 500KB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Compression failed', error);
      return file; // Fallback to original
    }
  };

  // 2. UPLOAD LOGIC
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.secure_url;
  };

  // 3. DROP HANDLER
  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle Validation Errors
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ errors }) => {
        errors.forEach((err: any) => {
          if (err.code === 'file-too-large') toast.error('File too large (Max 5MB)');
          if (err.code === 'file-invalid-type') toast.error('Only JPG, PNG, WEBP allowed');
        });
      });
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];

    try {
      for (const file of acceptedFiles) {
        // A. Compress
        const compressedFile = await compressImage(file);
        // B. Upload
        const url = await uploadToCloudinary(compressedFile);
        newUrls.push(url);
      }
      
      // Update Parent Form
      onChange([...existingImages, ...newUrls]);
      toast.success(`${newUrls.length} image(s) uploaded`);

    } catch (error) {
      toast.error('Upload failed. Check internet or Cloudinary config.');
    } finally {
      setUploading(false);
    }
  }, [existingImages, onChange]);

  // 4. REMOVE IMAGE
  const removeImage = (indexToRemove: number) => {
    const updated = existingImages.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  // 5. DROPZONE CONFIG
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 5 * 1024 * 1024, // 5MB limit
    multiple: true // Allow multiple files
  });

  return (
    <div className="space-y-4">
      {/* GALLERY GRID */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {existingImages.map((url, idx) => (
            <div key={url + idx} className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
              <img src={url} alt="Product" className="w-full h-full object-cover" />
              
              {/* Delete Button (Overlay) */}
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              
              {idx === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-1">
                  Main Image
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* DROP AREA */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-primary hover:bg-slate-50'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        ) : (
          <div className="bg-slate-100 p-3 rounded-full">
            <UploadCloud className="w-6 h-6 text-slate-400" />
          </div>
        )}

        <div className="text-sm text-slate-600 font-medium">
          {uploading ? 'Optimizing & Uploading...' : isDragActive ? 'Drop images here!' : 'Click or Drag & Drop'}
        </div>
        
        {!uploading && (
          <p className="text-xs text-slate-400">
            JPG, PNG, WEBP (Max 5MB)
          </p>
        )}
      </div>
    </div>
  );
}