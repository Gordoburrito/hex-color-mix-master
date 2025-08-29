import React, { ImgHTMLAttributes } from "react";

interface UploadedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  imageSrc: string | null;
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
}

const UploadedImage: React.FC<UploadedImageProps> = ({ imageSrc, onClick, ...props }) => {
  return (
    <div className="flex justify-center items-center overflow-hidden">
      {imageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="max-w-full max-h-[80vh] object-contain cursor-crosshair"
          {...props}
          src={imageSrc}
          alt="Uploaded preview"
          onClick={onClick}
        />
      )}
    </div>
  );
};

export default UploadedImage;
