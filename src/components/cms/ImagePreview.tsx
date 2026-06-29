'use client';

interface ImagePreviewProps {
  url: string | null;
  alt: string;
}

export function ImagePreview({ url, alt }: ImagePreviewProps) {
  if (!url) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded flex items-center justify-center text-gray-500">
        <p className="text-sm">No image URL</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded overflow-hidden">
      <img
        src={url}
        alt={alt}
        className="w-full h-auto object-cover"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = '';
          img.style.display = 'none';
        }}
      />
    </div>
  );
}
