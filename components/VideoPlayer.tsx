import React from 'react';
import { DownloadIcon } from './icons';
import type { VideoResult } from '../types';

interface VideoPlayerProps {
  videoResult: VideoResult;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoResult }) => {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-gray-800 rounded-lg p-4 space-y-4">
      <h3 className="text-xl font-semibold text-white">Generation Complete!</h3>
      <div className="w-full aspect-video bg-black rounded-md overflow-hidden">
        <video src={videoResult.url} controls autoPlay loop className="w-full h-full object-contain">
          Your browser does not support the video tag.
        </video>
      </div>
      <a
        href={videoResult.url}
        download={`veo-generated-video-${new Date().getTime()}.mp4`}
        className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-colors"
      >
        <DownloadIcon className="w-5 h-5 mr-2" />
        Download Video
      </a>
    </div>
  );
};

export default VideoPlayer;
