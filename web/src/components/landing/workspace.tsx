"use client";

import { useState } from "react";
import { VoiceSourcePanel } from "@/components/landing/voice-source-panel";
import { ResultsPanel } from "@/components/landing/results-panel";
import { ScriptPanel } from "@/components/landing/script-panel";
import type { ModelId } from "@/components/landing/model-select";

export function Workspace() {
  const [sampleName, setSampleName] = useState<string | null>(null);
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
          sampleName={sampleName}
          onSampleChange={setSampleName}
          recording={recording}
          onRecordingChange={setRecording}
        />
        <ResultsPanel generating={generating} hasResult={hasResult} />
      </div>

      <div className="mt-4">
        <ScriptPanel
          script={script}
          onScriptChange={setScript}
          model={model}
          onModelChange={setModel}
          disabled={!sampleName || script.trim().length === 0}
          generating={generating}
          onGenerate={handleGenerate}
        />
      </div>
    </section>
  );
}
