// src/components/ImageUpload.tsx
import FileUpload from "./client/FileUpload";
import ColorPicker from "./client/ColorPicker";
import PaintColorsList from "./client/PaintColorsList";
import ColorMixButton from "./client/ColorMixButton";
import ColorMixResult from "./client/ColorMixResult";
import UploadedImage from "./client/UploadedImage";
import ColorBoxes from "./client/ColorBoxes";
import { useState } from "react";
import { extractColors } from "../../utils";
import { ColorResult } from "react-color";
import { EyeDropper } from "react-eyedrop";

interface PaintColor {
  name: string;
  hex: string;
}

interface ColorWithPosition {
  hex: string;
  x: number;
  y: number;
}

const NewHome = () => {

  const starterPaintColors: PaintColor[] = [
    { name: "Titanium White", hex: "#ffffff" },
    { name: "Hansa Yellow Pale", hex: "#ffcc00" },
    { name: "Cadmium Yellow Medium", hex: "#ffcc00" },
    { name: "Yellow Ochre", hex: "#cc7722" },
    { name: "Cadmium Red Hue", hex: "#e32636" },
    { name: "Alizarin Crimson Hue", hex: "#e32636" },
    { name: "Phthalo Blue (Green Shade)", hex: "#123456" },
    { name: "Phthalo Green (Blue Shade)", hex: "#123456" },
    { name: "Burnt Sienna", hex: "#8a3324" },
    { name: "Ivory Black", hex: "#000000" },
  ];

  const [colors, setColors] = useState<ColorWithPosition[]>([]); // Start with empty colors array to allow unlimited colors
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [paintColors, setPaintColors] = useState<PaintColor[]>(starterPaintColors);
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
      console.log('Extracted palette:', palette);
      // Instead of auto-adding colors, just log them
      // Users can click on the image to manually select colors at specific coordinates
      console.log('Colors extracted from image. Click on the image to select colors at specific locations.');
    } catch (error) {
      console.error("Failed to extract colors:", error);
    }
  };

  // ? server
  const onUpload = (imageFile: File) => {
    setImageSrc(URL.createObjectURL(imageFile));
    setColors([]); // Clear existing colors when new image is uploaded
    processImage(imageFile);
  };

  // server
  const requestColorMix = async () => {
    // Validation
    if (colors.length === 0) {
      alert("Please add some colors first by uploading an image or using the color picker. You can add as many colors as needed.");
      return;
    }
    if (paintColors.length === 0) {
      alert("Please add some paint colors first.");
      return;
    }
    
    // Takes paint colors and hex values, returns color mixes.
    setIsLoading(true);
  
    const controller = new AbortController(); // Create an AbortController instance
    const signal = controller.signal; // Get the signal from the AbortController
  
    // Set the custom timeout (in milliseconds)
    const timeout = 30000; // 30 seconds
    setTimeout(() => controller.abort(), timeout);
  
    try {
      // Convert paint colors array to string format for API
      const paintColorsString = paintColors.map(color => color.name).join('\n');
      
      console.log('Sending to API:', {
        paintColorsString,
        colors,
        paintColorsLength: paintColors.length,
        colorsLength: colors.length
      });
      
      const response = await fetch("/api/mixColorsChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paintColors: paintColorsString,
          hexValues: colors.map(color => color.hex),
        }),
        signal, // Pass the signal to the fetch request
      });
  
      const data = await response.json();
      console.log("data", data);
      if (response.status !== 200) {
        if (response.status === 504) {
          throw new Error(
            "The fastest growing application in history is at capacity. Please try again."
          );
        } else {
          throw (
            data.error ||
            new Error(`Request failed with status ${response.status}`)
          );
        }
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
  const handlePaintColorsChange = (colors: PaintColor[]) => {
    setPaintColors(colors);
  };

  const handleEyeDropSelect = (color: ColorResult) => {
    // For EyeDropper, we'll add at a default position since we don't have coordinates
    setColors((prevColors) => [...prevColors, { 
      hex: color.hex, 
      x: 20 + (prevColors.length * 40), 
      y: 20 
    }]);
  };

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    const img = event.currentTarget as HTMLImageElement;
    const rect = img.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    console.log('Click coordinates:', { x, y, rect });
    
    // Create a canvas to get the pixel color
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    
    // Calculate the actual pixel coordinates based on image scaling
    const scaleX = img.naturalWidth / img.offsetWidth;
    const scaleY = img.naturalHeight / img.offsetHeight;
    const pixelX = Math.floor(x * scaleX);
    const pixelY = Math.floor(y * scaleY);
    
    const imageData = ctx.getImageData(pixelX, pixelY, 1, 1);
    const r = imageData.data[0];
    const g = imageData.data[1];
    const b = imageData.data[2];
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    
    console.log('Adding color:', { hex, x, y });
    setColors((prevColors) => [...prevColors, { hex, x, y }]);
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
          <h2 className="text-2xl">upload image to generate a palette or add colors manually</h2>
        ) : (
          <div className="relative inline-block">
            <UploadedImage imageSrc={imageSrc} onClick={handleImageClick} />
            <ColorBoxes colors={colors} onRemoveColor={removeColor} />
            <div className="absolute top-4 right-4">
              <EyeDropper customComponent={Button} onChange={handleEyeDropSelect} />
            </div>
          </div>
        )}
        <FileUpload onUpload={onUpload} />
      </div>
      <div className="flex">
        <div>
          {isLoading && <div>🌀 consulting a repository of human knowledge... <br></br>max 10 seconds will break if over 10 seconds<br></br>Try again if it doesnt work</div>}
          <ColorMixResult
            colorMixResult={colorMixResult}
          />
          <div>
            <PaintColorsList
              paintColors={paintColors}
              onPaintColorsChange={handlePaintColorsChange}
            />
            <ColorMixButton requestColorMix={requestColorMix} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHome;
