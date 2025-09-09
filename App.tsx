
import React, { useState, useCallback } from 'react';
import { generateVideo } from './services/geminiService';
import { AspectRatio, Resolution } from './types';

import Button from './components/Button';
import ImageUploader from './components/ImageUploader';
import LoadingScreen from './components/LoadingScreen';
import SelectInput from './components/SelectInput';
import TextAreaInput from './components/TextAreaInput';
import ToggleSwitch from './components/ToggleSwitch';
import VideoPlayer from './components/VideoPlayer';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        // remove data:mime/type;base64, part
        const base64 = result.split(',')[1];
        resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [enableSound, setEnableSound] = useState<boolean>(true);
  const [resolution, setResolution] = useState<Resolution>('1080p');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleImageChange = useCallback((file: File | null) => {
    setImageFile(file);
  }, []);

  const clearForm = useCallback(() => {
    setPrompt('');
    setImageFile(null);
    setAspectRatio('16:9');
    setEnableSound(true);
    setResolution('1080p');
    setError(null);
    setVideoUrl(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    if (!process.env.API_KEY || process.env.API_KEY === "YOUR_API_KEY_HERE") {
      setError("API Key is not configured. Please set the API_KEY environment variable.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      let imageBase64: string | null = null;
      let imageMimeType: string | null = null;

      if (imageFile) {
        imageBase64 = await fileToBase64(imageFile);
        imageMimeType = imageFile.type;
      }

      const generatedUrl = await generateVideo(
        { prompt, imageBase64, imageMimeType },
        aspectRatio,
        enableSound,
        resolution
      );

      setVideoUrl(generatedUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(`Generation Failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {isLoading && <LoadingScreen />}
      <header className="p-4 border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
          VEO Video Generator
        </h1>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <div className="bg-gray-800/50 rounded-lg p-6 space-y-6 border border-gray-700">
            <h2 className="text-xl font-semibold border-b border-gray-600 pb-2">Generation Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <TextAreaInput 
                label="Prompt"
                value={prompt}
                onChange={setPrompt}
                placeholder="e.g., A neon hologram of a cat driving at top speed."
              />
              <ImageUploader onImageChange={handleImageChange} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectInput<AspectRatio> 
                  label="Aspect Ratio"
                  value={aspectRatio}
                  onChange={setAspectRatio}
                  options={[
                    { value: '16:9', label: '16:9 (Widescreen)' },
                    { value: '9:16', label: '9:16 (Vertical)' },
                  ]}
                />
                <SelectInput<Resolution> 
                  label="Resolution"
                  value={resolution}
                  onChange={setResolution}
                  options={[
                    { value: '1080p', label: '1080p (Full HD)' },
                    { value: '720p', label: '720p (HD)' },
                  ]}
                />
              </div>
              <ToggleSwitch label="Enable Sound" enabled={enableSound} onChange={setEnableSound} />
              
              <Button type="submit" disabled={isLoading || !prompt} className="w-full text-lg">
                {isLoading ? 'Generating...' : 'Generate Video'}
              </Button>
            </form>
          </div>

          {/* Output Panel */}
          <div className="bg-gray-800/50 rounded-lg p-6 flex items-center justify-center min-h-[400px] border border-gray-700">
            {error && (
              <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
            {!error && !videoUrl && !isLoading && (
              <div className="text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                <p className="mt-4">Your generated video will appear here.</p>
              </div>
            )}
            {videoUrl && <VideoPlayer videoUrl={videoUrl} onClear={clearForm} />}
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-xs text-gray-500">
        <p>Powered by Google Gemini. UI designed for creativity.</p>
      </footer>
    </div>
  );
};

export default App;
