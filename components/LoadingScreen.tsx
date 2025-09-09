
import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';

const loadingMessages = [
  "Warming up the VEO engine...",
  "Composing your visual story...",
  "Rendering pixels into motion...",
  "This can take a few minutes, please be patient.",
  "Analyzing your creative prompt...",
  "Gathering visual elements...",
  "The final result will be worth the wait!",
  "Stitching frames together...",
];

const LoadingScreen: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <Spinner />
      <h2 className="text-2xl font-bold mt-6 text-indigo-300">Generating Your Video</h2>
      <p className="mt-2 text-gray-300 transition-opacity duration-500 ease-in-out">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingScreen;
