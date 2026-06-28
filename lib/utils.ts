import { useState, useEffect } from "react";
import lamejs from "@breezystack/lamejs";

export function todayLocal() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export async function compressAudio(file: File, bitrate = 128): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const channels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const encoder = new lamejs.Mp3Encoder(channels, sampleRate, bitrate);

  const left = new Int16Array(audioBuffer.getChannelData(0).map(s => s * 32767));
  const right = channels > 1
    ? new Int16Array(audioBuffer.getChannelData(1).map(s => s * 32767))
    : left;

  const mp3Data: Uint8Array[] = [];
  const sampleBlockSize = 1152;

  for (let i = 0; i < left.length; i += sampleBlockSize) {
    const leftChunk = left.subarray(i, i + sampleBlockSize);
    const rightChunk = right.subarray(i, i + sampleBlockSize);
    const buf = encoder.encodeBuffer(leftChunk, rightChunk);
    if (buf.length > 0) mp3Data.push(buf);
  }

  const final = encoder.flush();
  if (final.length > 0) mp3Data.push(final);

  return new Blob(mp3Data as BlobPart[], { type: "audio/mp3" });
}