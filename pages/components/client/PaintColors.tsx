// src/components/PaintColors.tsx
import { ChangeEvent } from "react";

const PaintColors = ({ paintColors, handlePaintColorsChange }) => {
  return (
    <div>
      <label htmlFor="paint-colors">Paint Colors:</label>
      <textarea
        id="paint-colors"
        value={paintColors}
        onChange={handlePaintColorsChange}
        rows={10}
        style={{ width: "100%", resize: "none" }}
      />
    </div>
  );
};

export default PaintColors;
