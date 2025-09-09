
import { GoogleGenAI } from "@google/genai";
import { VideoGenerationOptions, VeoOperation, AspectRatio, Resolution } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. Please set your API key for the app to function.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

const pollOperation = async (operation: VeoOperation): Promise<VeoOperation> => {
    let currentOperation = operation;
    while (!currentOperation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
        try {
            currentOperation = await ai.operations.getVideosOperation({ operation: currentOperation });
        } catch (error) {
            console.error("Error polling operation status:", error);
            throw new Error("Failed to get video generation status.");
        }
    }
    return currentOperation;
};

const buildPrompt = (
    userPrompt: string,
    aspectRatio: AspectRatio,
    enableSound: boolean,
    resolution: Resolution
): string => {
    const instructions = [
        `- Render the video in ${aspectRatio} aspect ratio.`,
        `- The video should be rendered in high quality, specifically ${resolution}.`,
        `- The video should ${enableSound ? 'include appropriate sound effects and ambient audio' : 'be silent'}.`
    ];
    
    return `${userPrompt}\n\n--- Technical Directives ---\n${instructions.join('\n')}`;
};

export const generateVideo = async (
    options: VideoGenerationOptions,
    aspectRatio: AspectRatio,
    enableSound: boolean,
    resolution: Resolution,
): Promise<string> => {
    try {
        const fullPrompt = buildPrompt(options.prompt, aspectRatio, enableSound, resolution);
        
        const requestPayload: any = {
            model: 'veo-3.0-generate-preview',
            prompt: fullPrompt,
            config: {
                numberOfVideos: 1,
            }
        };

        if (options.imageBase64 && options.imageMimeType) {
            requestPayload.image = {
                imageBytes: options.imageBase64,
                mimeType: options.imageMimeType,
            };
        }

        let initialOperation: VeoOperation = await ai.models.generateVideos(requestPayload);
        const completedOperation = await pollOperation(initialOperation);

        if (completedOperation.error) {
            throw new Error(`Video generation failed: ${completedOperation.error.message}`);
        }

        const downloadLink = completedOperation.response?.generatedVideos?.[0]?.video?.uri;

        if (!downloadLink) {
            throw new Error('Video generation finished but returned no downloadable URI.');
        }

        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!videoResponse.ok) {
            throw new Error(`Failed to download video file: ${videoResponse.statusText}`);
        }

        const videoBlob = await videoResponse.blob();
        return URL.createObjectURL(videoBlob);
    } catch (error) {
        console.error("Error in generateVideo service:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("An unknown error occurred during video generation.");
    }
};
