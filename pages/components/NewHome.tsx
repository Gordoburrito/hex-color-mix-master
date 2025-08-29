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
  const [previewColor, setPreviewColor] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState<{x: number, y: number} | null>(null);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(true);

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

  const getPixelColor = (img: HTMLImageElement, x: number, y: number) => {
    // Calculate actual displayed image dimensions with object-contain
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = img.offsetWidth / img.offsetHeight;
    
    let displayedWidth: number, displayedHeight: number, offsetX: number, offsetY: number;
    
    if (imgAspect > containerAspect) {
      // Image is wider - limited by width
      displayedWidth = img.offsetWidth;
      displayedHeight = img.offsetWidth / imgAspect;
      offsetX = 0;
      offsetY = (img.offsetHeight - displayedHeight) / 2;
    } else {
      // Image is taller - limited by height  
      displayedWidth = img.offsetHeight * imgAspect;
      displayedHeight = img.offsetHeight;
      offsetX = (img.offsetWidth - displayedWidth) / 2;
      offsetY = 0;
    }
    
    // Adjust mouse coordinates to actual image area
    const adjustedX = x - offsetX;
    const adjustedY = y - offsetY;
    
    // Check if click is within actual image bounds
    if (adjustedX < 0 || adjustedY < 0 || adjustedX > displayedWidth || adjustedY > displayedHeight) {
      return null;
    }
    
    // Scale to natural image coordinates
    const scaleX = img.naturalWidth / displayedWidth;
    const scaleY = img.naturalHeight / displayedHeight;
    const pixelX = Math.floor(adjustedX * scaleX);
    const pixelY = Math.floor(adjustedY * scaleY);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    
    const imageData = ctx.getImageData(pixelX, pixelY, 1, 1);
    const r = imageData.data[0];
    const g = imageData.data[1];
    const b = imageData.data[2];
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const handleImageMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    const img = event.currentTarget as HTMLImageElement;
    const rect = img.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setMousePosition({ x, y });
    
    const color = getPixelColor(img, x, y);
    if (color) {
      setPreviewColor(color);
    }
  };

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    const img = event.currentTarget as HTMLImageElement;
    const rect = img.getBoundingClientRect();
    const relativeX = event.clientX - rect.left;
    const relativeY = event.clientY - rect.top;
    
    // Store absolute viewport coordinates for positioning the color boxes
    const absoluteX = event.clientX;
    const absoluteY = event.clientY;
    
    console.log('Click coordinates:', { relativeX, relativeY, absoluteX, absoluteY, rect });
    
    const hex = getPixelColor(img, relativeX, relativeY);
    if (!hex) return;
    
    console.log('Adding color:', { hex, x: absoluteX, y: absoluteY });
    setColors((prevColors) => [...prevColors, { hex, x: absoluteX, y: absoluteY }]);
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
    <div className="relative min-h-screen">
      {imageSrc == null ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <h2 className="text-2xl mb-8 text-center">upload image to generate a palette or add colors manually</h2>
          <FileUpload onUpload={onUpload} />
        </div>
      ) : (
        <>
          {/* Full-screen image */}
          <div className="relative">
            <UploadedImage 
              imageSrc={imageSrc} 
              onClick={handleImageClick} 
              onMouseMove={handleImageMouseMove}
            />
            <ColorBoxes colors={colors} onRemoveColor={removeColor} />
            
            {/* Color preview circle */}
            {previewColor && mousePosition && (
              <div
                className="fixed pointer-events-none z-50 w-16 h-16 rounded-full border-4 border-white shadow-lg"
                style={{
                  backgroundColor: previewColor,
                  left: mousePosition.x + 20,
                  top: mousePosition.y - 40,
                }}
              />
            )}
          </div>

          {/* Overlay controls */}
          <div className="fixed top-4 left-4 right-4 z-40 flex justify-between items-start">
            <div className="bg-white bg-opacity-90 rounded-lg p-4 max-w-xs">
              <FileUpload onUpload={onUpload} />
            </div>
            
            <div className="bg-white bg-opacity-90 rounded-lg p-4">
              <EyeDropper customComponent={Button} onChange={handleEyeDropSelect} />
            </div>
          </div>

          {/* Toggle button for side panel */}
          <button
            onClick={() => setIsPanelVisible(!isPanelVisible)}
            className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-l-lg p-2 shadow-lg transition-all duration-200"
            style={{ right: isPanelVisible ? '324px' : '4px' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-6 h-6 transition-transform duration-200 ${isPanelVisible ? 'rotate-0' : 'rotate-180'}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          {/* Side panel for results and controls */}
          <div className={`fixed right-4 top-20 bottom-4 w-80 bg-white bg-opacity-95 rounded-lg p-4 overflow-y-auto z-40 transition-transform duration-300 ${isPanelVisible ? 'translate-x-0' : 'translate-x-full'}`}>
            {isLoading && (
              <div className="mb-4 text-center">
                🌀 consulting a repository of human knowledge...<br/>
                max 10 seconds will break if over 10 seconds<br/>
                Try again if it doesnt work
              </div>
            )}
            
            <ColorMixResult colorMixResult={colorMixResult} />
            
            <div className="mt-4">
              <PaintColorsList
                paintColors={paintColors}
                onPaintColorsChange={handlePaintColorsChange}
              />
              <ColorMixButton requestColorMix={requestColorMix} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NewHome;
