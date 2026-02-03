import { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ProductThumbnailProps {
  src?: string;
  alt: string;
}

export default function ProductThumbnail({ src, alt }: ProductThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error state if the src prop changes (e.g. searching/filtering)
  useEffect(() => {
    setHasError(false);
  }, [src]);

  // Case 1: No Image Source or Error occurred
  if (!src || hasError) {
    return (
      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 shrink-0">
        <ImageIcon className="w-5 h-5 text-slate-300" />
      </div>
    );
  }

  // Case 2: Render Image
  return (
    <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-slate-200 shrink-0 p-1">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain mix-blend-multiply"
        onError={() => setHasError(true)} // <--- Sets state, doesn't change DOM directly
      />
    </div>
  );
}