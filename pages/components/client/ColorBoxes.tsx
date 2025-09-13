// src/components/ColorBoxes.tsx
import React, { useState } from "react";

interface ColorWithPosition {
  hex: string;
  x: number;
  y: number;
}

interface ColorMixResult {
  [sumHex: string]: {
    [colorName: string]: number;
  };
}

interface ColorBoxesProps {
  colors: ColorWithPosition[];
  onRemoveColor: (index: number) => void;
  colorMixResult?: ColorMixResult;
}

const ColorBoxes: React.FC<ColorBoxesProps> = ({ colors, onRemoveColor, colorMixResult }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const paintColorHexMap: { [key: string]: string } = {
    "Titanium White": "ffffff",
    "Hansa Yellow Pale": "ffcc00", 
    "Cadmium Yellow Medium": "ffcc00",
    "Yellow Ochre": "cc7722",
    "Cadmium Red Hue": "e32636",
    "Alizarin Crimson Hue": "e32636",
    "Phthalo Blue (Green Shade)": "123456",
    "Phthalo Green (Blue Shade)": "123456",
    "Burnt Sienna": "8a3324",
    "Ivory Black": "000000",
  };


  const getContainerPosition = (baseX: number, baseY: number, index: number, allColors: ColorWithPosition[]) => {
    // Just put it directly to the right of the square
    return {
      x: baseX + 32, // Right at the edge of the 32px square
      y: baseY
    };
  };

  const getExpandedPosition = (baseX: number, baseY: number) => {
    // Position the panel directly to the right of the square
    return { 
      x: baseX + 40, // 32px (square width) + 8px gap
      y: baseY 
    };
  };
  
  return (
    <>
      {colors && colors.map((color, index) => {
        const mixResult = colorMixResult && colorMixResult[color.hex];
        const hasMixResult = mixResult && Object.keys(mixResult).length > 0;
        const isExpanded = expandedIndex === index;
        
        return (
          <React.Fragment key={index}>
            {/* Main color square */}
            <div
              className="absolute w-8 h-8 rounded border-2 shadow-lg flex justify-center items-center group pointer-events-auto z-10 cursor-pointer"
              style={{
                backgroundColor: color.hex,
                borderColor: color.hex.toLowerCase() === '#ffffff' || color.hex.toLowerCase() === 'ffffff' ? '#000000' : '#ffffff',
                left: color.x - 16,
                top: color.y - 16,
                transform: 'translate(0, 0)',
              }}
              onClick={() => hasMixResult && setExpandedIndex(isExpanded ? null : index)}
            >
              {!hasMixResult && (
                <button
                  className="bg-red-600 text-white rounded w-4 h-4 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveColor(index);
                  }}
                >
                  ×
                </button>
              )}
            </div>


            {/* Dot-style visualization next to square */}
            {hasMixResult && (() => {
              const containerPos = getContainerPosition(color.x - 16, color.y - 16, index, colors);
              return (
                <>
                  {/* Connecting line indicator */}
                  <svg
                    className="absolute pointer-events-none z-15"
                    style={{
                      left: color.x + 16,
                      top: color.y - 16,
                      width: containerPos.x - (color.x + 16),
                      height: Math.abs(containerPos.y - (color.y - 16)) + 32,
                    }}
                  >
                    <line
                      x1="0"
                      y1="16"
                      x2={containerPos.x - (color.x + 16)}
                      y2={containerPos.y - (color.y - 16) + 16}
                      stroke="#666"
                      strokeWidth="2"
                      strokeDasharray="3,3"
                    />
                  </svg>
                  
                  {/* Container with color indicator */}
                  <div
                    className="absolute bg-white bg-opacity-95 rounded-lg shadow-lg border-2 pointer-events-auto z-20"
                    style={{
                      left: containerPos.x,
                      top: containerPos.y,
                      minWidth: '150px',
                      borderColor: color.hex,
                    }}
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  >
                    {/* Dots content */}
                    <div className="p-2">
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(mixResult).map(([colorName, quantity], idx) => {
                          const hex = paintColorHexMap[colorName] || "cccccc";
                          
                          return (
                            <div key={idx} className="flex flex-col items-center">
                              <div className="flex justify-center items-center gap-0.5 mb-1">
                                <div className="flex">
                                  {Array.from({ length: quantity }).map((_, partIndex) => (
                                    <div
                                      key={partIndex}
                                      className="w-3 h-3 rounded-full -mr-1 border border-white shadow-sm"
                                      style={{ backgroundColor: `#${hex}` }}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs font-semibold text-gray-800 ml-2">
                                  {quantity}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Expanded detail panel */}
            {isExpanded && hasMixResult && (
              <div
                className="absolute bg-white rounded-lg shadow-xl border-2 border-gray-200 p-3 pointer-events-auto z-50"
                style={{
                  ...getExpandedPosition(color.x - 16, color.y - 16),
                  width: '200px',
                  maxHeight: '120px',
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: color.hex }}
                  />
                  <button
                    className="text-gray-500 hover:text-gray-700 text-sm font-bold"
                    onClick={() => setExpandedIndex(null)}
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-1 overflow-y-auto max-h-20">
                  {Object.entries(mixResult).map(([colorName, quantity]) => {
                    const hex = paintColorHexMap[colorName] || "cccccc";
                    return (
                      <div key={colorName} className="flex items-center gap-2 text-xs">
                        <div
                          className="w-3 h-3 rounded border border-gray-300"
                          style={{ backgroundColor: `#${hex}` }}
                        />
                        <span className="flex-1 truncate">{colorName}</span>
                        <span className="font-semibold">{quantity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default ColorBoxes;
