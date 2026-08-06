"use client";

import { useState } from "react";
import {
  VoiceSourcePanel,
  type VoiceSample,
} from "@/components/landing/voice-source-panel";
import { ResultsPanel } from "@/components/landing/results-panel";
import { ScriptPanel } from "@/components/landing/script-panel";
import type { ModelId } from "@/lib/tts-config";

export function Workspace() {
  const [sample, setSample] = useState<VoiceSample | null>(null);
  const [recording, setRecording] = useState(false);
  const [script, setScript] = useState("");
  const [model, setModel] = useState<ModelId>("en");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!sample) return;
    setGenerating(true);
    setResult(null);
    setError(null);

    const form = new FormData();
    form.append("voice", sample.blob, sample.name);
    form.append("script", script);
    form.append("model", model);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 65_000);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: form,
        signal: controller.signal,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `request failed (${res.status})`);
      }
      setResult(await res.blob());
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Generation timed out");
      } else {
        setError(err instanceof Error ? err.message : "unknown error");
      }
    } finally {
      clearTimeout(timer);
      setGenerating(false);
    }
  }

  return (
    <section id="workspace" className="mx-auto max-w-5xl w-full px-4 pb-24">
      <div className="grid gap-4 sm:grid-cols-2">
        <VoiceSourcePanel
          sample={sample}
          onSampleChangeAction={setSample}
          recording={recording}
          onRecordingChangeAction={setRecording}
        />
        <ResultsPanel generating={generating} result={result} error={error} />
      </div>
      <div className="mt-4">
        <ScriptPanel
          script={script}
          onScriptChangeAction={setScript}
          model={model}
          onModelChangeAction={setModel}
          disabled={!sample || script.trim().length === 0}
          generating={generating}
          onGenerateAction={handleGenerate}
        />
      </div>
    </section>
  );
}
