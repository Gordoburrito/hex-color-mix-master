type RequestColorMixType = () => void;

interface ColorMixButtonProps {
  requestColorMix: RequestColorMixType;
}

const ColorMixButton = ({ requestColorMix }: ColorMixButtonProps) => {
  return <button className="rounded-full bg-blue-700 text-white py-1 px-5 transition transition-color ease-in-out hover:bg-blue-950" onClick={requestColorMix}>Request Color Mix</button>;
};

export default ColorMixButton;