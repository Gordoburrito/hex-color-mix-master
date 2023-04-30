// src/components/ImageUpload.tsx
import FileUpload from "./client/FileUpload";
import ColorPicker from "./client/ColorPicker";
import PaintColors from "./client/PaintColors";
import ColorMixButton from "./client/ColorMixButton";
import ColorMixResult from "./client/ColorMixResult";
import UploadedImage from "./client/UploadedImage";
import ColorBoxes from "./client/ColorBoxes";
// src/pages/index.tsx
import { ChangeEvent, useState } from "react";
import ImageUpload from "../components/ImageUpload";
import { extractColors } from "../../utils";
import { ChromePicker, ColorResult } from "react-color";
import EyeDrop, { EyeDropper } from "react-eyedrop"; // Add this import

const NewHome = () => {
  // TODO: make this an array and style the text as chips
  const starterPaintColors = `Titanium White
    Hansa Yellow Pale
    Cadmium Yellow Medium
    Yellow Ochre
    Cadmiu Red Hue
    Alizarin Crimson Hue
    Phthalo Blue (Green Shade)
    Phthalo Green (Blue Shade)
    Burnt Sienna
    Ivory Black
  `;
  const [colors, setColors] = useState<string[]>([]);
  const [eyeDropActive, setEyeDropActive] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [pickerColor, setPickerColor] = useState<string>("#000000");
  const [paintColors, setPaintColors] = useState<string>(starterPaintColors);
  const [paintColorHex, setPaintColorHex] = useState<string[]>([]);
  const [colorMixResult, setColorMixResult] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // TODO: add API call for paintColor hex codes.

  // TODO: add error handling
  // TODO: add loading state
  // TODO: add tests
  // TODO: add types
  // TODO: add comments
  // TODO: add documentation
  // TODO: add styling
  // TODO: add accessibility

  // server
  const processImage = async (imageFile: File) => {
    try {
      const palette = await extractColors(imageFile);
      console.log(palette);
      setColors(palette);
      console.log(colors);
    } catch (error) {
      console.error("Failed to extract colors:", error);
    }
  };

  // ? server
  const onUpload = (imageFile: File) => {
    setImageSrc(URL.createObjectURL(imageFile));
    processImage(imageFile);
  };

  // server
  const requestColorMix = async () => {
    // Takes (Yellow Ochre, Pthalo Blue, and  hexValues  [#7f7f7f, #7f7f7f, #7f7f7f])
    // Returns color mixes.
    setIsLoading(true);
  
    const controller = new AbortController(); // Create an AbortController instance
    const signal = controller.signal; // Get the signal from the AbortController
  
    // Set the custom timeout (in milliseconds)
    const timeout = 60000; // 60 seconds
    setTimeout(() => controller.abort(), timeout);
  
    try {
      const response = await fetch("/api/mixColorsDavinci", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paintColors: paintColors,
          hexValues: colors,
        }),
        signal, // Pass the signal to the fetch request
      });
  
      const data = await response.json();
      console.log("data", data);
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      console.log("colorMixResult", data);
      setColorMixResult(data);
      setIsLoading(false);
    } catch (error) {
      if (error.name === "AbortError") {
        // Handle fetch timeout error
        console.error("Fetch request timed out");
        alert("Request timed out. Please try again.");
      } else {
        // Consider implementing your own error handling logic here
        setIsLoading(false);
        console.error(error);
        alert(error.message);
      }
    }
  };
  
  // add api call?

  // client
  const handleColorChange = (color: ColorResult) => {
    setPickerColor(color.hex);
  };

  // client
  const addPickerColor = () => {
    console.log(colors);
    setColors((prevColors) => [...prevColors, pickerColor]);
  };

  // client
  const handlePaintColorsChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPaintColors(event.target.value);
  };

  const handleEyeDropSelect = (color: ColorResult) => {
    setColors((prevColors) => [...prevColors, color.hex]);
    setEyeDropActive(false);
  };

  
  const Button = ({ onClick }) => (
    <button
      className="w-8 h-8 rainbow-circle rounded flex border-2 border-white items-center justify-center"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="white"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 11.25l1.5 1.5.75-.75V8.758l2.276-.61a3 3 0 10-3.675-3.675l-.61 2.277H12l-.75.75 1.5 1.5M15 11.25l-8.47 8.47c-.34.34-.8.53-1.28.53s-.94.19-1.28.53l-.97.97-.75-.75.97-.97c.34-.34.53-.8.53-1.28s.19-.94.53-1.28L12.75 9M15 11.25L12.75 9"
        />
      </svg>
    </button>
  );

  const removeColor = (indexToRemove: number) => {
    setColors(colors.filter((_color, index) => index !== indexToRemove));
  };

  return (
    <div className="grid grid-cols-2">
      <div>
        {imageSrc == null ? (
          <h2 className="text-2xl">upload image to generate a pallette</h2>
        ) : (
          <UploadedImage imageSrc={imageSrc} />
        )}
        <FileUpload onUpload={onUpload} />
        <div className="flex gap-1">
          <ColorBoxes colors={colors} onRemoveColor={removeColor} />
          {/* <EyeDropper
              src={imageSrc as string}
              onChange={handleEyeDropSelect}
            /> */}
          <EyeDropper customComponent={Button} onChange={handleEyeDropSelect} />
        </div>
      </div>
      <div className="flex">
        <div>
          {isLoading && <div>🌀 Loading...<br></br>Takes awhile...<br></br>Trust...</div>}
          <ColorMixResult
            colorMixResult={colorMixResult}
          />
          <div>
            <PaintColors
              paintColors={paintColors}
              handlePaintColorsChange={handlePaintColorsChange}
            />
            <ColorMixButton requestColorMix={requestColorMix} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHome;
