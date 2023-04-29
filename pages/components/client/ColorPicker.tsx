// src/components/ColorPicker.tsx
import { ChromePicker, ColorResult } from "react-color";

const ColorPicker = ({ pickerColor, handleColorChange, addPickerColor }) => {
  return (
    <>
      <ChromePicker color={pickerColor} onChange={handleColorChange} />
      <button onClick={addPickerColor}>Add color</button>
    </>
  );
};

export default ColorPicker;
