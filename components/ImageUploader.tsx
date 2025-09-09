
import React, { useState, useRef, useCallback } from 'react';
import Button from './Button';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageChange(file);
    }
  };

  const handleRemoveImage = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onImageChange(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }, [previewUrl, onImageChange]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {previewUrl ? (
        <div className="relative group">
          <img src={previewUrl} alt="Image preview" className="mx-auto max-h-48 rounded-md" />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={handleRemoveImage} className="text-red-500 hover:text-red-400 text-sm font-semibold">Remove</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2 text-gray-400">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <p>Upload a reference image (optional)</p>
          <Button type="button" variant="secondary" onClick={triggerFileInput}>
            Browse File
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
