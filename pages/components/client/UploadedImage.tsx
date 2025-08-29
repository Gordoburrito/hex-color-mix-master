import React, { ImgHTMLAttributes } from "react";

interface UploadedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  imageSrc: string | null;
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
  onMouseMove?: (event: React.MouseEvent<HTMLImageElement>) => void;
}

const UploadedImage: React.FC<UploadedImageProps> = ({ imageSrc, onClick, onMouseMove, ...props }) => {
  return (
    <div className="w-full h-full overflow-hidden">
      {imageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="w-full h-full object-contain cursor-crosshair"
          {...props}
          src={imageSrc}
          alt="Uploaded preview"
          onClick={onClick}
          onMouseMove={onMouseMove}
        />
      )}
    </div>
  );
};

export default UploadedImage;
