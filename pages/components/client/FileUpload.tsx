import { ChangeEvent } from "react";

type OnUploadType = (file: File) => void;

interface FileUploadProps {
  onUpload: OnUploadType;
}

const FileUpload = ({ onUpload }: FileUploadProps) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <input type="file" onChange={handleFileChange} />
  );
};

export default FileUpload;
