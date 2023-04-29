// src/components/ColorBoxes.tsx
import React from "react";

interface ColorBoxesProps {
  colors: string[];
  onRemoveColor: (index: number) => void;
}

const ColorBoxes: React.FC<ColorBoxesProps> = ({ colors, onRemoveColor }) => {
  return (
    <div className="flex gap-1">
      {colors.map((color, index) => (
        <div
          className="flex w-8 h-8 rounded border-2 border-white relative justify-center items-center group"
          key={index}
          style={{
            backgroundColor: color,
          }}
        >
          <button
            className="bg-red-600 text-white rounded w-4 h-4 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100"
            onClick={() => onRemoveColor(index)}
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
};

export default ColorBoxes;
