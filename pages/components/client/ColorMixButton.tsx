import { useState } from 'react';

type RequestColorMixType = () => void;

interface ColorMixButtonProps {
  requestColorMix: RequestColorMixType;
  isLoading?: boolean;
}

const ColorMixButton = ({ requestColorMix, isLoading = false }: ColorMixButtonProps) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    requestColorMix();
    // Reset click animation after a short delay
    setTimeout(() => setIsClicked(false), 200);
  };

  return (
    <div className="flex justify-center mb-6">
      <button 
        className={`
          relative overflow-hidden
          px-8 py-4 rounded-2xl text-white font-bold text-lg
          transform transition-all duration-300 ease-out
          hover:scale-110 hover:rotate-1 hover:shadow-2xl
          active:scale-95 active:rotate-0
          ${isClicked ? 'animate-pulse scale-95' : ''}
          ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={handleClick}
        disabled={isLoading}
        style={{
          background: isLoading 
            ? 'linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff)' 
            : 'linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff, #5f27cd)',
          backgroundSize: isLoading ? '400% 400%' : '300% 300%',
          animation: isLoading 
            ? 'rainbow-loading 1.5s ease-in-out infinite, gradient-shift 3s ease infinite' 
            : 'gradient-shift 3s ease infinite'
        }}
      >
        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 hover:animate-shimmer"></div>
        
        {/* Button content */}
        <div className="relative z-10 flex items-center justify-center space-x-2">
          {isLoading ? (
            <>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="animate-pulse">Mixing Colors...</span>
              <div className="ml-2 animate-spin">🌈</div>
            </>
          ) : (
            <>
              <span className="animate-pulse">🎨</span>
              <span>MIX COLORS</span>
              <span className="animate-bounce">✨</span>
            </>
          )}
        </div>
        
        {/* Particle effects on hover */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-6 right-6 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-3 left-8 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-6 right-4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </button>
    </div>
  );
};

export default ColorMixButton;