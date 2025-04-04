import React, { useState, useEffect, useRef } from 'react';

const CaesarCipherWheel = () => {
  const [shift, setShift] = useState(3);
  const [inputText, setInputText] = useState('HELLO WORLD');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedChar, setSelectedChar] = useState(null);
  const [copyInputStatus, setCopyInputStatus] = useState('');
  const [copyOutputStatus, setCopyOutputStatus] = useState('');
  const prevShiftRef = useRef(shift);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  // Animation effect when shift changes
  useEffect(() => {
    if (prevShiftRef.current !== shift) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500); // Match this with the CSS transition duration
      
      prevShiftRef.current = shift;
      return () => clearTimeout(timer);
    }
  }, [shift]);

  // Calculate the output based on input, shift and mode
  useEffect(() => {
    const processText = (text) => {
      return text.split('').map(char => {
        // If character is not a letter, keep it as is
        if (!alphabet.includes(char.toUpperCase())) {
          return char;
        }
        
        const isUpperCase = char === char.toUpperCase();
        const index = alphabet.indexOf(char.toUpperCase());
        
        // Calculate new position based on encrypt/decrypt mode
        let newIndex;
        if (mode === 'encrypt') {
          newIndex = (index + shift) % 26;
        } else {
          newIndex = (index - shift + 26) % 26;
        }
        
        // Return character in the correct case
        return isUpperCase ? alphabet[newIndex] : alphabet[newIndex].toLowerCase();
      }).join('');
    };
    
    setOutputText(processText(inputText));
  }, [inputText, shift, mode, alphabet]);

  // Copy text to clipboard function
  const copyToClipboard = (text, setCopyStatus) => {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';  // Prevent scrolling to bottom
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    try {
      // Execute the copy command
      const successful = document.execCommand('copy');
      setCopyStatus(successful ? 'Copied!' : 'Failed!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      setCopyStatus('Failed!');
      setTimeout(() => setCopyStatus(''), 2000);
      console.error('Copy failed:', err);
    }
    
    // Clean up
    document.body.removeChild(textarea);
  };
  
  // Generate a color based on character index
  const getCharColor = (char) => {
    if (!alphabet.includes(char.toUpperCase())) return '#777777';
    const index = alphabet.indexOf(char.toUpperCase());
    // Use HSL color space to generate distinct colors
    const hue = (index * 360 / 26) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  // Find corresponding character
  const getCorrespondingChar = (char) => {
    if (!alphabet.includes(char.toUpperCase())) return char;
    
    const index = alphabet.indexOf(char.toUpperCase());
    let newIndex;
    
    if (mode === 'encrypt') {
      newIndex = (index + shift) % 26;
    } else {
      newIndex = (index - shift + 26) % 26;
    }
    
    return alphabet[newIndex];
  };

  // Draw the cipher wheel with animation
  const renderWheel = () => {
    const outerRadius = 120;
    const innerRadius = 90;
    const center = 150;
    
    // Calculate rotation angle based on shift
    const rotationAngle = -(shift * 360 / 26);
    
    // Create outer wheel (stationary)
    const outerWheel = alphabet.split('').map((char, i) => {
      const angle = (i * 360 / 26) * (Math.PI / 180);
      const x = center + outerRadius * Math.sin(angle);
      const y = center - outerRadius * Math.cos(angle);
      const isSelected = selectedChar && selectedChar.toUpperCase() === char;
      const charColor = getCharColor(char);
      
      return (
        <g key={`outer-${i}`}>
          {isSelected && (
            <circle 
              cx={x} 
              cy={y} 
              r={16} 
              fill={charColor}
              opacity={0.2} 
            />
          )}
          <text 
            x={x} 
            y={y} 
            textAnchor="middle" 
            dominantBaseline="middle"
            className={`text-lg font-bold ${isSelected ? 'text-black' : ''}`}
            fill={isSelected ? charColor : '#000'}
            style={{filter: isSelected ? 'drop-shadow(0px 0px 2px rgba(0,0,0,0.3))' : 'none'}}
          >
            {char}
          </text>
        </g>
      );
    });
    
    // Create inner wheel (with animation)
    const innerWheel = alphabet.split('').map((char, i) => {
      const angle = (i * 360 / 26) * (Math.PI / 180);
      const x = center + innerRadius * Math.sin(angle);
      const y = center - innerRadius * Math.cos(angle);
      
      // Find if this is the corresponding char to the selected one
      const isCorresponding = selectedChar && 
        getCorrespondingChar(selectedChar) === char;
      
      const charColor = getCharColor(char);
      
      return (
        <g key={`inner-${i}`}>
          {isCorresponding && (
            <circle 
              cx={x} 
              cy={y} 
              r={16} 
              fill={selectedChar ? getCharColor(selectedChar) : charColor}
              opacity={0.2} 
            />
          )}
          <text 
            x={x} 
            y={y} 
            textAnchor="middle" 
            dominantBaseline="middle"
            className="text-lg font-bold"
            fill={isCorresponding ? (selectedChar ? getCharColor(selectedChar) : charColor) : '#1a365d'}
            style={{filter: isCorresponding ? 'drop-shadow(0px 0px 2px rgba(0,0,0,0.3))' : 'none'}}
          >
            {char}
          </text>
        </g>
      );
    });
    
    // Connection line between selected character and its cipher
    let connectionLine = null;
    if (selectedChar && alphabet.includes(selectedChar.toUpperCase())) {
      const index = alphabet.indexOf(selectedChar.toUpperCase());
      const targetIndex = mode === 'encrypt' 
        ? (index + shift) % 26 
        : (index - shift + 26) % 26;
      
      const startAngle = (index * 360 / 26) * (Math.PI / 180);
      const endAngle = (targetIndex * 360 / 26) * (Math.PI / 180);
      
      const startX = center + outerRadius * Math.sin(startAngle);
      const startY = center - outerRadius * Math.cos(startAngle);
      
      const endX = center + innerRadius * Math.sin(endAngle);
      const endY = center - innerRadius * Math.cos(endAngle);
      
      connectionLine = (
        <g>
          <line 
            x1={startX} 
            y1={startY} 
            x2={endX} 
            y2={endY} 
            stroke={getCharColor(selectedChar)} 
            strokeWidth={2} 
            strokeDasharray="4 2"
            opacity={0.7} 
          />
          <circle cx={startX} cy={startY} r={3} fill={getCharColor(selectedChar)} />
          <circle cx={endX} cy={endY} r={3} fill={getCharColor(selectedChar)} />
        </g>
      );
    }
    
    // Draw circles
    return (
      <svg width="300" height="300" className="mx-auto">
        {/* Outer ring */}
        <circle 
          cx={center} 
          cy={center} 
          r={outerRadius + 20} 
          className="fill-gray-50 stroke-gray-200" 
          strokeWidth={1}
        />
        
        {/* Inner ring decoration */}
        <circle 
          cx={center} 
          cy={center} 
          r={innerRadius + 5} 
          className="fill-none stroke-blue-200" 
          strokeWidth={5}
          strokeDasharray="1 3"
        />
        
        {/* Connecting line */}
        {connectionLine}
        
        {/* Background circles */}
        <circle 
          cx={center} 
          cy={center} 
          r={outerRadius + 5} 
          className="fill-white stroke-gray-200" 
          strokeWidth={1}
        />
        
        {/* Inner circle (animated) */}
        <circle 
          cx={center} 
          cy={center} 
          r={innerRadius - 10} 
          className="fill-blue-50 stroke-blue-100"
          style={{transition: "all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)"}}
          transform={`rotate(${rotationAngle}, ${center}, ${center})`}
        />
        
        {/* Letter positions */}
        {outerWheel}
        
        {/* Inner wheel group with animation */}
        <g 
          style={{transition: "all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)"}} 
          transform={`rotate(${rotationAngle}, ${center}, ${center})`}
        >
          {innerWheel}
        </g>
      </svg>
    );
  };
  
  // Render characters with distinct colors
  const renderColoredText = (text, isInput = true) => {
    return (
      <div className="flex flex-wrap font-mono tracking-wide">
        {text.split('').map((char, i) => {
          const color = alphabet.includes(char.toUpperCase()) 
            ? getCharColor(char) 
            : '#777777';
          
          const isSelected = selectedChar === char;
          
          return (
            <span 
              key={i} 
              className={`text-center py-1 ${isInput ? 'cursor-pointer' : ''} ${isSelected ? 'rounded-full px-1' : 'px-1'}`}
              style={{
                color: color,
                fontWeight: isSelected ? 'bold' : 'normal',
                backgroundColor: isSelected ? `${color}20` : 'transparent',
                textShadow: isSelected ? '0 0 1px rgba(0,0,0,0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
              onClick={() => isInput && setSelectedChar(isSelected ? null : char)}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Caesar Cipher</h2>
      
      <div className="mb-8 relative">
        {renderWheel()}
        <div className="absolute left-1/2 transform -translate-x-1/2 -mt-5 bg-white py-1 px-3 rounded-full shadow-sm border border-gray-200">
          <span className="text-sm font-semibold text-gray-600">
            Shift: {shift}
          </span>
        </div>
      </div>
      
      <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-inner">
        <div className="flex justify-between items-center mb-3">
          <label className="text-gray-700 font-medium">Shift Value</label>
          <div className="flex space-x-2 gap-1 text-white">
            <button 
              onClick={() => setShift(prev => (prev - 1 + 26) % 26)}
              className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              -
            </button>
            <button 
              onClick={() => setShift(prev => (prev + 1) % 26)}
              className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              +
            </button>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="25"
          value={shift}
          onChange={(e) => setShift(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{accentColor: '#3B82F6'}}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
          <span>0</span>
          <span>5</span>
          <span>10</span>
          <span>15</span>
          <span>20</span>
          <span>25</span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between gap-4 mb-4 text-white">
          <button
            onClick={() => {
              setIsAnimating(true);
              setMode('encrypt');
              setTimeout(() => setIsAnimating(false), 500);
            }}
            className="flex-1 py-2 px-4 bg-blue-500 text-white font-medium rounded-md shadow-sm transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Encrypt
          </button>
          <button
            onClick={() => {
              setIsAnimating(true);
              setMode('decrypt');
              setTimeout(() => setIsAnimating(false), 500);
            }}
            className="flex-1 py-2 px-4 bg-gray-600 text-white font-medium rounded-md shadow-sm transition duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Decrypt
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Current mode: <span className="font-medium">{mode === 'encrypt' ? 'Encryption' : 'Decryption'}</span>
        </p>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-gray-700 font-medium">Input Text:</label>
          <button 
            onClick={() => {
              copyToClipboard(inputText, setCopyInputStatus);
            }}
            className="text-sm px-3 py-1 flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {copyInputStatus || 'Copy'}
          </button>
        </div>
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setSelectedChar(null);
            }}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:outline-none font-mono"
            rows="2"
            placeholder="Enter text to encrypt/decrypt..."
          />
          <div className="absolute top-0 left-0 p-3 pointer-events-none opacity-0">
            {renderColoredText(inputText)}
          </div>
        </div>
        {/* <div className="p-3 mt-1 rounded-lg bg-white border border-gray-100">
          {renderColoredText(inputText)}
        </div> */}
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-gray-700 font-medium">Output Text:</label>
          <button 
            onClick={() => {
              copyToClipboard(outputText, setCopyOutputStatus);
            }}
            className="text-sm px-3 py-1 flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {copyOutputStatus || 'Copy'}
          </button>
        </div>
        <div className="p-3 border rounded-lg shadow-sm bg-gray-50 min-h-16 overflow-hidden">
          <div className={isAnimating ? "animate-fade-in" : ""}>
            {renderColoredText(outputText, false)}
          </div>
        </div>
      </div>

      
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CaesarCipherWheel;