
import ColorThief from 'colorthief';

const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
};

export const extractColors = async (imageFile, colorCount = 5) => {
  const colorThief = new ColorThief();
  const img = new Image();

  img.src = URL.createObjectURL(imageFile);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      try {
        const palette = colorThief.getPalette(img, colorCount);
        const hexPalette = palette.map(color => rgbToHex(color[0], color[1], color[2]));

        resolve(hexPalette);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = (error) => reject(error);
  });
};
