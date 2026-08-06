export const MODEL_IDS = ["en", "multi"] as const;
export type ModelId = (typeof MODEL_IDS)[number];

export const MODEL_LIMITS: Record<
  ModelId,
  { max: number; unit: "words" | "chars" }
> = {
  en: { max: 100, unit: "words" },
  multi: { max: 500, unit: "chars" },
};

export const MODEL_CONFIGS: Record<
  ModelId,
  { backend: string; model: string; codecModel?: string }
> = {
  en: {
    backend: "chatterbox-turbo",
    model: "chatterbox-turbo-t3-q8_0.gguf",
    codecModel: "chatterbox-turbo-s3gen-q8_0.gguf",
  },
  multi: {
    backend: "qwen3-tts-1.7b-base",
    model: "qwen3-tts-12hz-1.7b-base-q8_0.gguf",
  },
};
