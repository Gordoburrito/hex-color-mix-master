// src/components/ImageUpload.tsx
import React, { ChangeEvent } from 'react';

interface ImageUploadProps {
  onUpload: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload }) => {
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    onUpload(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUpload} />
    </div>
  );
};

export default ImageUpload;
