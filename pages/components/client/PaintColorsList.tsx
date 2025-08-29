import { useState, useEffect } from "react";

interface PaintColor {
  name: string;
  hex: string;
}

interface PaintColorsListProps {
  paintColors: PaintColor[];
  onPaintColorsChange: (colors: PaintColor[]) => void;
}

const PaintColorsList = ({ paintColors, onPaintColorsChange }: PaintColorsListProps) => {
  const [newColorName, setNewColorName] = useState("");
  
  const addPaintColor = async () => {
    if (!newColorName.trim()) return;
    
    try {
      // Get hex value for the new paint color
      const response = await fetch("/api/getPaintColorHex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paintColors: newColorName,
        }),
      });
      
      const data = await response.json();
      const hexValue = data[newColorName] || "#000000";
      
      const newColor: PaintColor = {
        name: newColorName,
        hex: hexValue,
      };
      
      onPaintColorsChange([...(paintColors || []), newColor]);
      setNewColorName("");
    } catch (error) {
      console.error("Error getting paint color hex:", error);
      // Fallback to black if API fails
      const newColor: PaintColor = {
        name: newColorName,
        hex: "#000000",
      };
      onPaintColorsChange([...(paintColors || []), newColor]);
      setNewColorName("");
    }
  };

  const removePaintColor = (indexToRemove: number) => {
    const updatedColors = (paintColors || []).filter((_, index) => index !== indexToRemove);
    onPaintColorsChange(updatedColors);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Paint Colors:</label>
      
      {/* Add new color input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newColorName}
          onChange={(e) => setNewColorName(e.target.value)}
          placeholder="Enter paint color name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-transparent"
          onKeyDown={(e) => e.key === "Enter" && addPaintColor()}
        />
        <button
          onClick={addPaintColor}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* List of paint colors */}
      <div className="space-y-2">
        {paintColors && paintColors.map((color, index) => (
          <div key={index} className="flex items-center gap-3 p-2 border border-gray-200 rounded-md">
            {/* Color box */}
            <div
              className="w-8 h-8 rounded border border-gray-300"
              style={{ backgroundColor: color.hex }}
              title={color.hex}
            />
            
            {/* Color name */}
            <span className="flex-1 text-sm">{color.name}</span>
            
            {/* Remove button */}
            <button
              onClick={() => removePaintColor(index)}
              className="w-6 h-6 flex items-center justify-center text-red-500 hover:text-red-700"
              title="Remove color"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaintColorsList;