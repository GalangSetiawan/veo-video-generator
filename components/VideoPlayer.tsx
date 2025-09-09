
import React from 'react';
import Button from './Button';

interface VideoPlayerProps {
  videoUrl: string;
  onClear: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onClear }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-4 flex flex-col items-center space-y-4">
      <video src={videoUrl} controls autoPlay loop className="w-full rounded-md shadow-2xl shadow-black/50" />
      <div className="flex items-center space-x-4">
        <a href={videoUrl} download="generated-video.mp4">
          <Button variant="primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            Download Video
          </Button>
        </a>
        <Button variant="secondary" onClick={onClear}>
          Create Another
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayer;
