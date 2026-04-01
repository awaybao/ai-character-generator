import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export const STYLES: Record<string, string> = {
  cartoon: "cartoon style, vibrant colors, clean lines, friendly",
  anime: "anime style, Japanese animation, expressive eyes",
  realistic: "realistic style, detailed, professional illustration",
  pixel: "pixel art style, retro game character, 8-bit",
  "3d": "3D render style, Pixar-like, smooth shading",
  flat: "flat design style, minimal, modern vector illustration",
};

export async function generateCharacter(
  prompt: string,
  style: string
): Promise<string> {
  const stylePrompt = STYLES[style] || STYLES.cartoon;

  const output = (await replicate.run(
    "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    {
      input: {
        prompt: `${prompt}, ${stylePrompt}, mascot character, white background, centered, high quality`,
        negative_prompt:
          "ugly, blurry, low quality, distorted, multiple characters, text, watermark",
        width: 1024,
        height: 1024,
        num_inference_steps: 30,
        guidance_scale: 7.5,
      },
    }
  )) as string[];

  if (!output || output.length === 0) {
    throw new Error("No image generated");
  }

  return output[0];
}
