const ACCEPTED_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
];
const ACCEPTED_EXTENSIONS = [".mp3", ".wav"];
const MAX_FILE_BYTES = 15 * 1024 * 1024;
const MAX_DURATION_S = 30;
const MIN_DURATION_S = 1;

export function isAcceptedAudioFile(file: File): boolean {
  if (file.size > MAX_FILE_BYTES) return false;
  if (ACCEPTED_TYPES.includes(file.type)) return true;
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

export function checkDuration(buffer: AudioBuffer): string | null {
  if (buffer.duration > MAX_DURATION_S) return `tooLong`;
  if (buffer.duration < MIN_DURATION_S) return `tooShort`;
  return null;
}
