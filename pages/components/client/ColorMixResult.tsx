import React from "react";
// import './ColorMix.css';

interface ColorMixResult {
  [sumHex: string]: {
    [colorName: string]: number;
  };
}

interface ColorMixProps {
  colorMixResult: ColorMixResult;
}

// Paint color hex mapping
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

const ColorMix: React.FC<ColorMixProps> = ({ colorMixResult }) => {
  if (!colorMixResult) {
    return <div>No color mix data available</div>;
  }

  return (
      <div className="flex flex-col gap-4">
        {Object.keys(colorMixResult).map((sumHex, index) => (
          <div key={index} className="w-full">
            <div className="flex gap-3">
              <div
                className="w-8 h-8 rounded-sm border-2 border-white"
                style={{ backgroundColor: sumHex }}
              ></div>
              <div className="flex gap-2 w-full">
                {Object.entries(colorMixResult[sumHex]).map(
                  ([colorName, quantity], idx) => {
                    const hex = paintColorHexMap[colorName] || "cccccc";
                    return (
                      <div key={idx} className="color-mix__addend w-40">
                        <div className="flex flex-col items-center">
                          <div className="flex justify-center items-center gap-2">
                            <div className="flex">
                              {Array.from({ length: quantity }).map(
                                (_, partIndex) => (
                                  <div
                                    key={partIndex}
                                    className="w-8 h-8 rounded-full -mr-2 border-2 border-white "
                                    style={{ backgroundColor: "#"+hex }}
                                  ></div>
                                )
                              )}
                            </div>
                            <span className="text-sm font-medium text-gray-700 ml-1">
                              {quantity}
                            </span>
                          </div>
                          <p className="text-center">{colorName}</p>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };


export default ColorMix;
