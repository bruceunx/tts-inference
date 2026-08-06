"use client";

import type { ModelId } from "@/lib/tts-config";
import type { VoiceSample } from "@/components/landing/voice-source-panel";

import { useState } from "react";
import { VoiceSourcePanel } from "@/components/landing/voice-source-panel";
import { ResultsPanel } from "@/components/landing/results-panel";
import { ScriptPanel } from "@/components/landing/script-panel";

export function Workspace() {
  const [sample, setSample] = useState<VoiceSample | null>(null);
  const [recording, setRecording] = useState(false);
  const [script, setScript] = useState("");
  const [model, setModel] = useState<ModelId>("core");
  const [generating, setGenerating] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  function handleGenerate() {
    setGenerating(true);
    setHasResult(false);
    setTimeout(() => {
      setGenerating(false);
      setHasResult(true);
    }, 1800);
  }

  return (
    <section id="workspace" className="mx-auto max-w-5xl px-4 pb-24">
      <div className="grid gap-4 sm:grid-cols-2">
        <VoiceSourcePanel
          sample={sample}
          onSampleChangeAction={setSample}
          recording={recording}
          onRecordingChangeAction={setRecording}
        />
        <ResultsPanel generating={generating} hasResult={hasResult} />
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
