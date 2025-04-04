import React, { useState, useEffect } from 'react';
import * as math from 'mathjs';

const MonoalphabeticCipherCalculator = () => {
  const [attemptsPerSecond, setAttemptsPerSecond] = useState(100000);
  const [alphabet, setAlphabet] = useState('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  const [results, setResults] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    calculateEstimation();
  }, [attemptsPerSecond, alphabet]);

  const calculateEstimation = () => {
    const alphabetLength = alphabet.length;
    
    // Calculate factorial and handle large numbers
    let totalPermutations, permutationsDisplay;
    
    try {
      if (alphabetLength <= 18) {
        // Standard JavaScript can handle factorials up to 18! accurately
        totalPermutations = factorial(alphabetLength);
        permutationsDisplay = totalPermutations.toLocaleString('en-US');
      } else if (alphabetLength <= 170) {
        // Use mathjs for larger factorials that are still within reasonable bounds
        totalPermutations = math.number(math.factorial(alphabetLength));
        // Format as scientific notation for readability
        permutationsDisplay = formatScientificNotation(totalPermutations);
      } else {
        // For extremely large factorials, use Stirling's approximation
        // ln(n!) ≈ n*ln(n) - n
        const lnFactorial = alphabetLength * Math.log(alphabetLength) - alphabetLength;
        const exponent = Math.floor(lnFactorial / Math.LN10);
        const mantissa = Math.exp(lnFactorial - (exponent * Math.LN10));
        
        totalPermutations = Infinity; // For calculation purposes
        permutationsDisplay = `${mantissa.toFixed(2)}×10^${exponent}`;
      }
    } catch (e) {
      totalPermutations = Infinity;
      permutationsDisplay = '∞ (exceeds calculation limits)';
    }
    
    // Calculate time estimates
    const timeInSeconds = totalPermutations / attemptsPerSecond;
    const timeInMinutes = timeInSeconds / 60;
    const timeInHours = timeInMinutes / 60;
    const timeInDays = timeInHours / 24;
    const timeInYears = timeInDays / 365.25;

    setResults({
      alphabetLength,
      totalPermutations: permutationsDisplay,
      timeInSeconds: formatNumber(timeInSeconds),
      timeInMinutes: formatNumber(timeInMinutes),
      timeInHours: formatNumber(timeInHours),
      timeInDays: formatNumber(timeInDays),
      timeInYears: formatNumber(timeInYears),
      readable: formatReadableTime(timeInSeconds),
      isExceedingPrecision: alphabetLength > 18
    });
  };

  const formatScientificNotation = (num) => {
    if (num === Infinity || num === -Infinity) {
      return '∞ (exceeds JavaScript number precision)';
    }
    
    // Convert to scientific notation
    const str = num.toExponential(2);
    // Replace e+ notation with ×10^ for better readability
    return str.replace(/e\+(\d+)/, '×10^$1');
  };

  const factorial = (n) => {
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const formatNumber = (num) => {
    if (num === Infinity || num > 1e21) {
      return '∞ (exceeds JavaScript number precision)';
    }
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  const formatReadableTime = (seconds) => {
    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInYear = 31557600; // 365.25 days
    const secondsInCentury = secondsInYear * 100;
    const secondsInMillennium = secondsInYear * 1000;
    const secondsInMillionYears = secondsInYear * 1000000;
    const secondsInBillionYears = secondsInYear * 1000000000;
    const secondsInTrillionYears = secondsInYear * 1000000000000;
    
    // Helper to format large numbers with commas
    const formatLargeNumber = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    // For extremely large time scales
    if (seconds > secondsInTrillionYears) {
      const trillionYears = Math.floor(seconds / secondsInTrillionYears);
      return `more than ${formatLargeNumber(trillionYears)} trillion years`;
    }
    
    if (seconds > secondsInBillionYears) {
      const billionYears = Math.floor(seconds / secondsInBillionYears);
      return `more than ${formatLargeNumber(billionYears)} billion years`;
    }
    
    if (seconds > secondsInMillionYears) {
      const millionYears = Math.floor(seconds / secondsInMillionYears);
      return `more than ${formatLargeNumber(millionYears)} million years`;
    }
    
    if (seconds > secondsInMillennium * 10) {
      const thousandsOfYears = Math.floor(seconds / secondsInYear / 1000);
      return `more than ${formatLargeNumber(thousandsOfYears)},000 years`;
    }
    
    if (seconds > secondsInMillennium) {
      const millennia = Math.floor(seconds / secondsInMillennium);
      const remainingYears = Math.floor((seconds % secondsInMillennium) / secondsInYear);
      return `approximately ${millennia} millennium/millennia and ${remainingYears} years`;
    }
    
    if (seconds > secondsInCentury) {
      const centuries = Math.floor(seconds / secondsInCentury);
      const remainingYears = Math.floor((seconds % secondsInCentury) / secondsInYear);
      return `approximately ${centuries} ${centuries === 1 ? 'century' : 'centuries'} and ${remainingYears} years`;
    }
    
    if (seconds > secondsInYear) {
      const years = Math.floor(seconds / secondsInYear);
      const days = Math.floor((seconds % secondsInYear) / secondsInDay);
      return `approximately ${formatLargeNumber(years)} year${years !== 1 ? 's' : ''} and ${days} day${days !== 1 ? 's' : ''}`;
    }
    
    if (seconds > secondsInDay) {
      const days = Math.floor(seconds / secondsInDay);
      const hours = Math.floor((seconds % secondsInDay) / secondsInHour);
      return `approximately ${days} day${days !== 1 ? 's' : ''} and ${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    
    if (seconds > secondsInHour) {
      const hours = Math.floor(seconds / secondsInHour);
      const minutes = Math.floor((seconds % secondsInHour) / secondsInMinute);
      return `approximately ${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    
    if (seconds > secondsInMinute) {
      const minutes = Math.floor(seconds / secondsInMinute);
      const secs = Math.floor(seconds % secondsInMinute);
      return `approximately ${minutes} minute${minutes !== 1 ? 's' : ''} and ${secs} second${secs !== 1 ? 's' : ''}`;
    }
    
    return `approximately ${seconds.toFixed(2)} seconds`;
  };

  const handleAttemptsChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setAttemptsPerSecond(value);
    }
  };

  const handleAlphabetChange = (e) => {
    // Remove duplicates and non-alphabet characters
    const uniqueChars = [...new Set(e.target.value.toUpperCase())].filter(char => 
      (char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z') || (char >= '0' && char <= '9')
    ).join('');
    setAlphabet(uniqueChars);
  };

  const presetAlphabets = [
    { name: 'English (26)', value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
    { name: 'Digits (10)', value: '0123456789' },
    { name: 'Alphanumeric (36)', value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' },
    { name: 'Custom (10)', value: 'ABCDEFGHIJ' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6  bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          Monoalphabetic Cipher Brute Force Calculator
        </h1>
   
      </div>
      

      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <label className="block text-gray-700 font-medium mb-2">Brute Force Speed</label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="10000000"
                step="10000"
                value={attemptsPerSecond}
                onChange={handleAttemptsChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <input
                type="number"
                value={attemptsPerSecond}
                onChange={handleAttemptsChange}
                className=" w-20 px-1 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                min="1"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 flex items-center">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              {attemptsPerSecond.toLocaleString()} keys per second
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <label className="block text-gray-700 font-medium mb-2">Alphabet Characters</label>
            <textarea
              value={alphabet}
              onChange={handleAlphabetChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 font-mono"
              placeholder="Enter characters for your alphabet"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500 flex items-center">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                {alphabet.length} unique characters
              </p>
              <p className="text-sm text-gray-500">
                {/* Key space: {alphabet.length}! permutations */}
              </p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <label className="block text-gray-700 font-medium mb-2">Preset Alphabets</label>
            <div className="grid grid-cols-2 gap-2">
              {presetAlphabets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => setAlphabet(preset.value)}
                  className="px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 text-blue-600 rounded-lg hover:from-blue-100 hover:to-purple-100 transition shadow-sm"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          {results && (
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Brute Force Time Estimation</h3>
                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                  {alphabet.length} characters
                </div>
              </div>
              
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white text-center shadow-lg">
                <h4 className="text-lg font-medium mb-2 opacity-90">Estimated Time Required</h4>
                <p className="text-3xl font-bold">{results.readable}</p>
                <div className="flex justify-center items-center mt-3">
                  <div className="w-16 h-1 bg-white opacity-30 rounded-full"></div>
                </div>
                {/* <p className="mt-3 text-sm opacity-80">To try all {results.totalPermutations} possible combinations</p> */}
                {/* {results.timeInYears.includes('∞') || parseFloat(results.timeInYears.replace(/,/g, '')) > 100 ? (
                  <div className="mt-3 px-3 py-1 bg-white bg-opacity-20 rounded-full inline-block text-blue-500">
                    <span className="text-xs font-semibold">Computationally Infeasible</span>
                  </div>
                ) : (
                  <div className="mt-3 px-3 py-1 bg-white bg-opacity-20 rounded-full inline-block">
                    <span className="text-xs font-semibold">Potentially Feasible</span>
                  </div>
                )} */}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Permutations (Key Space)</div>
                    <div className="text-lg font-semibold text-gray-800 font-mono">{results.totalPermutations}</div>
                    {results.isExceedingPrecision && (
                      <div className="text-xs text-blue-600 mt-1">Using scientific notation for large numbers</div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">In Seconds</div>
                    <div className="text-lg font-semibold text-gray-800">{results.timeInSeconds}</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">In Minutes</div>
                    <div className="text-lg font-semibold text-gray-800">{results.timeInMinutes}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">In Hours</div>
                    <div className="text-lg font-semibold text-gray-800">{results.timeInHours}</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">In Days</div>
                    <div className="text-lg font-semibold text-gray-800">{results.timeInDays}</div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">In Years</div>
                    <div className="text-lg font-semibold text-gray-800">{results.timeInYears}</div>
                  </div>
                </div>
              </div>
              

              
  
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonoalphabeticCipherCalculator;