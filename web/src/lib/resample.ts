export const TARGET_SAMPLE_RATE = 24000;

export async function resampleAudioBuffer(buffer: AudioBuffer, targetRate = TARGET_SAMPLE_RATE): Promise<AudioBuffer> {
  if (buffer.sampleRate === targetRate) return buffer;
  const length = Math.ceil(buffer.duration * targetRate);
  const ctx = new OfflineAudioContext(buffer.numberOfChannels, length, targetRate);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start();
  return ctx.startRendering();
}
