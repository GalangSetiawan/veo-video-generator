
export interface VideoGenerationOptions {
  prompt: string;
  imageBase64: string | null;
  imageMimeType: string | null;
}

export type AspectRatio = '16:9' | '9:16';
export type Resolution = '720p' | '1080p';

// This is a simplified representation of the operation object from the Gemini API
export interface VeoOperation {
  name: string;
  done: boolean;
  response?: {
    generatedVideos?: {
      video?: {
        uri: string;
      };
    }[];
  };
  error?: {
    code: number;
    message: string;
  };
}
