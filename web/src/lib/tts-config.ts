export const MODEL_IDS = ["core", "pro", "multi"] as const;
export type ModelId = (typeof MODEL_IDS)[number];

export const MODEL_CONFIGS: Record<
  ModelId,
  { backend: string; model: string; codecModel?: string }
> = {
  core: {
    backend: "chatterbox-turbo",
    model: "chatterbox-turbo-t3-q8_0.gguf",
    codecModel: "chatterbox-turbo-s3gen-q8_0.gguf",
  },
  pro: {
    backend: "qwen3-tts-1.7b-base",
    model: "qwen3-tts-12hz-1.7b-base-q8_0.gguf",
  },
  multi: { backend: "voxcpm2-tts", model: "voxcpm2-q8_0.gguf" },
};
