interface ColorPickerProps {
  pickerColor: string;
  // handleColorChange: (color: ColorResult) => void;
  addPickerColor: () => void;
}

const ColorPicker = ({ pickerColor, addPickerColor }: ColorPickerProps) => {
  return (
    <>
      {/* <ChromePicker color={pickerColor} onChange={handleColorChange} /> */}
      <button onClick={addPickerColor}>Add color</button>
    </>
  );
};

export default ColorPicker;
