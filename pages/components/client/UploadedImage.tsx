import React, { ImgHTMLAttributes } from "react";

interface UploadedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  imageSrc: string | null;
}

const UploadedImage: React.FC<UploadedImageProps> = ({ imageSrc, ...props }) => {
  return (
    <div className="flex justify-center items-center overflow-hidden">
      {imageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="max-w-full max-h-[80vh] object-contain"
          {...props}
          src={imageSrc}
          alt="Uploaded preview"
        />
      )}
    </div>
  );
};

export default UploadedImage;
