import { GoogleGenAI } from "@google/genai";
import type { AspectRatio, GeneratorConfig } from '../types';

// Helper to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove "data:mime/type;base64," prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
};

const POLLING_INTERVAL_MS = 10000; // 10 seconds

// Main service function for video generation
export const generateVideoFromApi = async (
  prompt: string,
  imageFile: File | null,
  config: GeneratorConfig,
  setLoadingMessage: (message: string) => void
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  setLoadingMessage("Preparing assets for generation...");

  const generateVideosParams: any = {
    model: 'VO-3.0-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      // Note: aspect ratio is not officially documented for VEO in the library,
      // but this is how it would likely be structured if supported.
      // The API may default to a standard aspect ratio.
    }
  };

  if (imageFile) {
    const [base64Image, mimeType] = await Promise.all([
        fileToBase64(imageFile),
        Promise.resolve(imageFile.type)
    ]);
    generateVideosParams.image = {
        imageBytes: base64Image,
        mimeType: mimeType
    };
    setLoadingMessage("Image reference processed successfully.");
  }
  
  setLoadingMessage("Initiating video generation with VEO...");
  let operation = await ai.models.generateVideos(generateVideosParams);

  setLoadingMessage("Generation in progress. This may take several minutes...");
  
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL_MS));
    setLoadingMessage("Checking generation status...");
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  if (!operation.response?.generatedVideos?.[0]?.video?.uri) {
    throw new Error("Video generation completed, but no video URI was found.");
  }
  
  setLoadingMessage("Video generated. Fetching final video file...");
  
  const downloadLink = operation.response.generatedVideos[0].video.uri;
  // Append API key for fetching the video
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch video file: ${response.statusText}`);
  }

  const videoBlob = await response.blob();
  const videoUrl = URL.createObjectURL(videoBlob);
  
  setLoadingMessage("Your video is ready!");

  return videoUrl;
};
