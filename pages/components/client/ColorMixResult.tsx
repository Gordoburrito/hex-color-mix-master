import React from "react";
// import './ColorMix.css';

interface ColorMixResult {
  [sumHex: string]: {
    [colorName: string]: {
      hex: string;
      Quantity: number;
    };
  };
}

// const colorMixResult: ColorMixResult = {
//   "#29401e": {
//     "Phthalo Green (Blue Shade)": {
//       hex: "#006b3c",
//       Quantity: 2,
//     },
//     "Burnt Sienna": {
//       hex: "#8a3324",
//       Quantity: 1,
//     },
//     "Ivory Black": {
//       hex: "#000000",
//       Quantity: 1,
//     },
//   },
//   "#c66a69": {
//     "Cadmium Red Hue": {
//       hex: "#e60026",
//       Quantity: 3,
//     },
//     "Titanium White": {
//       hex: "#ffffff",
//       Quantity: 1,
//     },
//   },
//   "#8898a6": {
//     "Phthalo Blue (Green Shade)": {
//       hex: "#00758f",
//       Quantity: 2,
//     },
//     "Titanium White": {
//       hex: "#ffffff",
//       Quantity: 1,
//     },
//     "Ivory Black": {
//       hex: "#000000",
//       Quantity: 1,
//     },
//   },
//   "#88634d": {
//     "Yellow Ochre": {
//       hex: "#cc7722",
//       Quantity: 4,
//     },
//     "Burnt Sienna": {
//       hex: "#8a3324",
//       Quantity: 1,
//     },
//     "Ivory Black": {
//       hex: "#000000",
//       Quantity: 1,
//     },
//   },
//   "#84a953": {
//     "Hansa Yellow Pale": {
//       hex: "#ffde75",
//       Quantity: 2,
//     },
//     "Phthalo Green (Blue Shade)": {
//       hex: "#006b3c",
//       Quantity: 1,
//     },
//     "Titanium White": {
//       hex: "#ffffff",
//       Quantity: 1,
//     },
//   },
// };

interface ColorMixProps {
  colorMixResult: ColorMixResult;
  isLoading?: boolean;
}

const ColorMix: React.FC<ColorMixProps> = ({colorMixResult, isLoading}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className={`${isLoading ? 'block' : 'hidden'}`}>🌀 ...LOADING <br></br>...Takes a while<br></br>...trust </div>
      {Object.keys(colorMixResult).map((sumHex, index) => (
        <div key={index} className="w-full">
          <div className="flex gap-3">
            <div
              className="w-8 h-8 rounded-sm border-2 border-white"
              style={{ backgroundColor: sumHex }}
            ></div>
            <div className="flex gap-2 w-full">
              {(() => {
                const quantities = Object.values(colorMixResult[sumHex]).map(
                  (color) => color.Quantity
                );
                const parts = quantities;
                return Object && Object.keys(colorMixResult[sumHex]).map(
                  (colorName, idx) => {
                    const { hex, Quantity } = colorMixResult[sumHex][colorName];
                    return (
                      <div key={idx} className="color-mix__addend w-40">
                        <div className="flex flex-col items-center">
                          <div className="flex justify-center">
                            {Array.from({ length: parts[idx] }).map(
                              (_, partIndex) => (
                                <div
                                  key={partIndex}
                                  className="w-8 h-8 rounded-full -mr-2 border-2 border-white "
                                  style={{ backgroundColor: hex }}
                                ></div>
                              )
                            )}
                          </div>
                          <p className="text-center">{colorName}</p>
                          {/* <p>Hex: {hex}</p> */}
                          {/* <p>Quantity: {Quantity}</p> */}
                        </div>
                      </div>
                    );
                  }
                );
              })()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ColorMix;
