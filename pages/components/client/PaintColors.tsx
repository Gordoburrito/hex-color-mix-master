import { ChangeEvent } from "react";

interface PaintColorsProps {
  paintColors: string;
  handlePaintColorsChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

const PaintColors = ({ paintColors, handlePaintColorsChange }: PaintColorsProps) => {
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
