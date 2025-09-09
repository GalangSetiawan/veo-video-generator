import React, { useState, useCallback } from 'react';
import type { GeneratorConfig, VideoResult, AspectRatio, Resolution } from './types';
import { generateVideoFromApi } from './services/geminiService';
import Loader from './components/Loader';
import VideoPlayer from './components/VideoPlayer';
import { UploadIcon, VideoIcon, XIcon } from './components/icons';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('A majestic lion roaring on a cliff at sunset, cinematic style');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [config, setConfig] = useState<GeneratorConfig>({
    aspectRatio: '16:9',
    soundEnabled: false,
    resolution: '1080p',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  
  const removeImage = () => {
      if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
      }
      setImageFile(null);
      setImagePreview(null);
  }

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Prompt cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setVideoResult(null);

    try {
      const resultUrl = await generateVideoFromApi(prompt, imageFile, config, setLoadingMessage);
      setVideoResult({ url: resultUrl });
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, imageFile, config]);

  const setConfigValue = <K extends keyof GeneratorConfig>(key: K, value: GeneratorConfig[K]) => {
      setConfig(prev => ({...prev, [key]: value}));
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            VEO Video Generator
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Bring your ideas to life with Google's state-of-the-art video generation model.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Form */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                1. Enter Your Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="e.g., A cinematic shot of a futuristic city at night..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                2. Add a Reference Image (Optional)
              </label>
              {imagePreview ? (
                <div className="relative group">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-md" />
                   <button onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors">
                        <XIcon className="w-5 h-5" />
                   </button>
                </div>
              ) : (
                <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:bg-gray-700/50 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadIcon className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-400">Click to upload or drag and drop</p>
                    </div>
                  <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">3. Configure Settings</h3>
              <div className="space-y-4">
                 <OptionGroup label="Aspect Ratio">
                    {(['16:9', '9:16'] as AspectRatio[]).map(ratio => (
                        <RadioPill key={ratio} name="aspectRatio" value={ratio} checked={config.aspectRatio === ratio} onChange={() => setConfigValue('aspectRatio', ratio)} label={ratio} />
                    ))}
                 </OptionGroup>
                 <OptionGroup label="Resolution">
                    {(['720p', '1080p'] as Resolution[]).map(res => (
                        <RadioPill key={res} name="resolution" value={res} checked={config.resolution === res} onChange={() => setConfigValue('resolution', res)} label={res} />
                    ))}
                    <p className="text-xs text-gray-500 italic mt-1">Note: VEO API currently outputs a standard resolution. This is for future compatibility.</p>
                 </OptionGroup>
                 <div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" checked={config.soundEnabled} onChange={(e) => setConfigValue('soundEnabled', e.target.checked)} className="form-checkbox h-5 w-5 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-600" />
                        <span className="text-gray-300">Enable Sound</span>
                    </label>
                    <p className="text-xs text-gray-500 italic mt-1">Note: VEO API currently does not support sound generation. This is a placeholder.</p>
                 </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200"
            >
              {isLoading ? 'Generating...' : 'Generate Video'}
            </button>
          </div>

          {/* Right Column: Output */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl flex flex-col justify-center items-center min-h-[400px] lg:min-h-0">
            {isLoading ? (
              <Loader message={loadingMessage} />
            ) : error ? (
              <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-md">
                <h3 className="font-bold">Error</h3>
                <p>{error}</p>
              </div>
            ) : videoResult ? (
              <VideoPlayer videoResult={videoResult} />
            ) : (
              <div className="text-center text-gray-500">
                <VideoIcon className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300">Your video will appear here</h3>
                <p className="mt-1">Fill out the form and click "Generate Video" to begin.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const OptionGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
        <div className="flex items-center space-x-2">{children}</div>
    </div>
);


interface RadioPillProps {
    name: string;
    value: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
}

const RadioPill: React.FC<RadioPillProps> = ({ name, value, checked, onChange, label }) => (
    <label className="cursor-pointer">
        <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
        <span className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${checked ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            {label}
        </span>
    </label>
);

export default App;
