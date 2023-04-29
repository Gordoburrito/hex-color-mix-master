// src/components/FileUpload.tsx
import { ChangeEvent } from "react";

const FileUpload = ({ onUpload }) => {
  return (
    <input type="file" onChange={(e) => onUpload(e.target.files[0])} />
  );
};

export default FileUpload;
