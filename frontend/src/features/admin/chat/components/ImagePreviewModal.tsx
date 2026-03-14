import React from "react";
import { X } from "lucide-react";

interface ImagePreviewModalProps {
  src: string | null;
  onClose: () => void;
}

export function ImagePreviewModal({ src, onClose }: ImagePreviewModalProps) {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <img
        src={src}
        alt="Preview"
        className="max-w-full max-h-full rounded-lg shadow-2xl"
      />
      <button
        className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}
