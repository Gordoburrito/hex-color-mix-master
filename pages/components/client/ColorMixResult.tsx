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

interface ColorMixProps {
  colorMixResult: ColorMixResult;
  isLoading?: boolean;
}

const ColorMix: React.FC<ColorMixProps> = ({ colorMixResult, isLoading }) => {
  if (!colorMixResult) {
    return (
      <div className="flex flex-col gap-4">
        <div className="block">
          🌀 ...LOADING
          <br></br>...Takes a while
          <br></br>...trust{" "}
        </div>
      </div>
    );
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
