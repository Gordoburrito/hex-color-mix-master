// src/components/ColorBoxes.tsx
import React from "react";

interface ColorWithPosition {
  hex: string;
  x: number;
  y: number;
}

interface ColorBoxesProps {
  colors: ColorWithPosition[];
  onRemoveColor: (index: number) => void;
}

const ColorBoxes: React.FC<ColorBoxesProps> = ({ colors, onRemoveColor }) => {
  console.log('Rendering ColorBoxes with colors:', colors);
  
  return (
    <>
      {colors && colors.map((color, index) => {
        console.log(`Color ${index}:`, color);
        return (
          <div
            className="absolute w-8 h-8 rounded border-2 border-white shadow-lg flex justify-center items-center group pointer-events-auto z-10"
            key={index}
            style={{
              backgroundColor: color.hex,
              left: color.x - 16, // Center the box on the coordinate
              top: color.y - 16,
              transform: 'translate(0, 0)', // Ensure no transform interference
            }}
          >
            <button
              className="bg-red-600 text-white rounded w-4 h-4 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100"
              onClick={() => onRemoveColor(index)}
            >
              x
            </button>
          </div>
        );
      })}
    </>
  );
};

export default ColorBoxes;
