import React from 'react';

interface LoaderProps {
  message: string;
}

const loadingMessages = [
    "Warming up the VEO engine...",
    "Composing the visual narrative...",
    "Rendering initial frames...",
    "Applying cinematic magic...",
    "Almost there, adding final touches..."
];

const Loader: React.FC<LoaderProps> = ({ message }) => {
    const [displayMessage, setDisplayMessage] = React.useState(message);
    
    React.useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setDisplayMessage(loadingMessages[index]);
            index = (index + 1) % loadingMessages.length;
        }, 4000);

        return () => clearInterval(interval);
    }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-800/50 rounded-lg p-8">
      <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-6 text-lg font-medium text-white text-center">{message}</p>
      <p className="mt-2 text-sm text-gray-400 text-center">{displayMessage}</p>
    </div>
  );
};

export default Loader;
