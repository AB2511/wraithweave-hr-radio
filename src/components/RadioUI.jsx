import { useState, useEffect } from 'react';

const VacuumTube = ({ isActive, volume = 0, isProcessing = false }) => {
  const glowIntensity = isActive ? Math.max(0.3, volume) : 0.1;
  const tubeColor = isProcessing ? 'rgba(34, 197, 94, 0.8)' : 'rgba(217, 119, 6, 0.8)';
  
  return (
    <div className="relative w-8 h-16 mx-2">
      {/* Tube base */}
      <div className="absolute bottom-0 w-full h-4 bg-gradient-to-t from-wraith-copper to-wraith-amber rounded-b-lg"></div>
      
      {/* Tube glass */}
      <div className="absolute bottom-3 w-full h-12 bg-gradient-to-t from-gray-800 to-gray-600 rounded-t-full border border-gray-500">
        {/* Inner glow */}
        <div 
          className={`absolute inset-1 rounded-t-full tube-glow ${isProcessing ? 'animate-pulse' : 'animate-flicker'}`}
          style={{ 
            opacity: glowIntensity,
            background: isProcessing ? 'radial-gradient(circle, #22c55e 0%, #16a34a 50%, transparent 70%)' : undefined,
            boxShadow: `0 0 ${10 + volume * 20}px ${tubeColor}`
          }}
        ></div>
      </div>
      
      {/* Tube pins */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-gray-400"></div>
    </div>
  );
};

const TypewriterText = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!text) return;
    
    setDisplayedText('');
    setCurrentIndex(0);
    
    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev < text.length) {
          setDisplayedText(text.slice(0, prev + 1));
          return prev + 1;
        } else {
          clearInterval(timer);
          onComplete?.();
          return prev;
        }
      });
    }, 50);

    return () => clearInterval(timer);
  }, [text, onComplete]);

  return (
    <div className="gaslight-text text-center p-4 bg-black bg-opacity-50 rounded-lg border border-wraith-amber">
      {displayedText.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block animate-typeReveal"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
      <span className="animate-pulse">|</span>
    </div>
  );
};

const FrequencyDial = ({ isActive, volume = 0 }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setRotation(prev => (prev + 1 + volume * 5) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isActive, volume]);

  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-4 border-wraith-copper bg-gradient-to-br from-gray-800 to-gray-900">
        {/* Frequency markings */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-4 bg-wraith-amber"
            style={{
              top: '4px',
              left: '50%',
              transformOrigin: '50% 60px',
              transform: `translateX(-50%) rotate(${i * 30}deg)`
            }}
          ></div>
        ))}
      </div>
      
      {/* Inner dial */}
      <div 
        className="absolute inset-4 rounded-full frequency-dial border-2 border-wraith-amber transition-transform duration-100"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Needle */}
        <div className="absolute top-1 left-1/2 w-0.5 h-8 bg-white transform -translate-x-1/2 origin-bottom"></div>
      </div>
      
      {/* Center knob */}
      <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-wraith-copper rounded-full transform -translate-x-1/2 -translate-y-1/2 border border-wraith-amber"></div>
    </div>
  );
};

const RadioUI = ({ isRecording, isProcessing, volume, onToggleRecording, audioURL, processed }) => {
  const [titleShiver, setTitleShiver] = useState(false);

  useEffect(() => {
    if (processed) {
      setTitleShiver(true);
      const timer = setTimeout(() => setTitleShiver(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [processed]);

  return (
    <div className="vintage-radio-bg min-h-screen flex flex-col items-center justify-center p-8 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ 
          backgroundImage: `url('/mnt/data/f04c9085-3bc4-4f37-9cc2-ab44c1fb4084.png')`,
          filter: 'sepia(100%) hue-rotate(25deg) saturate(0.8)'
        }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Title */}
        <h1 className={`text-6xl font-bold text-wraith-amber mb-8 animate-glow text-center transition-all duration-200 ${titleShiver ? 'animate-bounce' : ''}`}>
          WraithWeave
        </h1>
        
        {/* Gaslight Text Display */}
        {processed && (
          <div className="mb-8">
            <TypewriterText text={processed.gaslightText} />
          </div>
        )}
        
        {/* Radio Console */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-lg border-4 border-wraith-copper shadow-2xl backdrop-blur-sm bg-opacity-90">
          
          {/* Vacuum Tubes */}
          <div className="flex justify-center mb-8">
            <VacuumTube isActive={isRecording} volume={volume} isProcessing={isProcessing} />
            <VacuumTube isActive={isRecording} volume={volume * 0.8} isProcessing={isProcessing} />
            <VacuumTube isActive={isRecording} volume={volume * 0.6} isProcessing={isProcessing} />
            <VacuumTube isActive={isRecording} volume={volume * 0.9} isProcessing={isProcessing} />
          </div>
          
          {/* Frequency Dial */}
          <div className="mb-8">
            <FrequencyDial isActive={isRecording || isProcessing} volume={volume} />
          </div>
          
          {/* Main Control Button */}
          <div className="text-center mb-6">
            <button
              onClick={onToggleRecording}
              disabled={isProcessing}
              className={`
                px-8 py-4 rounded-full text-xl font-bold border-2 transition-all duration-300 disabled:opacity-50
                ${isRecording 
                  ? 'bg-red-600 border-red-400 text-white animate-pulse' 
                  : isProcessing
                  ? 'bg-green-600 border-green-400 text-white animate-pulse'
                  : 'bg-wraith-amber border-wraith-copper text-wraith-dark hover:animate-glow'
                }
              `}
            >
              {isProcessing ? 'Channeling Spirits...' : isRecording ? 'Stop Transmission' : 'Tune the Wraith'}
            </button>
          </div>
          
          {/* Status Display */}
          <div className="text-center">
            <div className={`text-sm ${isRecording ? 'text-red-400 animate-pulse' : isProcessing ? 'text-green-400 animate-pulse' : 'text-wraith-amber'}`}>
              {isProcessing ? 'PROCESSING TRANSMISSION...' : isRecording ? 'RECEIVING TRANSMISSION...' : 'READY TO COMMUNE'}
            </div>
            
            {/* Volume Indicator */}
            {isRecording && (
              <div className="mt-2 flex justify-center">
                <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-wraith-amber to-red-500 transition-all duration-100"
                    style={{ width: `${volume * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Playback Controls */}
          {processed?.url && (
            <div className="mt-6 text-center">
              <div className="text-wraith-amber text-sm mb-2">HAUNTED TRANSMISSION</div>
              <audio controls className="w-full bg-gray-800 rounded">
                <source src={processed.url} type="audio/wav" />
              </audio>
            </div>
          )}
        </div>
      </div>
      
      {/* Atmospheric Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-wraith-amber rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default RadioUI;