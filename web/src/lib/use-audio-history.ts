"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addEntry,
  listEntries,
  removeEntry,
  type AudioEntry,
  type StoreName,
} from "@/lib/audio-db";

export function useAudioHistory(store: StoreName) {
  const [entries, setEntries] = useState<AudioEntry[]>([]);

  const refresh = useCallback(async () => {
    setEntries(await listEntries(store));
  }, [store]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (name: string, blob: Blob) => {
      await addEntry(store, {
        id: crypto.randomUUID(),
        name,
        blob,
        createdAt: Date.now(),
      });
      await refresh();
    },
    [store, refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await removeEntry(store, id);
      await refresh();
    },
    [store, refresh],
  );

  return { entries, add, remove };
}
