export async function decodePeaks(blob: Blob, buckets = 48): Promise<number[]> {
  const ctx = new AudioContext();
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    const data = audioBuffer.getChannelData(0);
    const step = Math.floor(data.length / buckets) || 1;
    const peaks: number[] = [];
    for (let i = 0; i < buckets; i++) {
      let max = 0;
      const start = i * step;
      for (let j = start; j < start + step && j < data.length; j++) {
        max = Math.max(max, Math.abs(data[j]));
      }
      peaks.push(Math.max(6, Math.round(max * 100)));
    }
    return peaks;
  } finally {
    ctx.close();
  }
}
