const DB_NAME = "timbre-audio-cache";
const DB_VERSION = 1;
const STORES = ["reference", "generated"] as const;
export type StoreName = (typeof STORES)[number];

export type AudioEntry = {
  id: string;
  name: string;
  blob: Blob;
  createdAt: number;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const store of STORES) {
        if (!db.objectStoreNames.contains(store))
          db.createObjectStore(store, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function listEntries(store: StoreName): Promise<AudioEntry[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(store, "readonly").objectStore(store).getAll();
    req.onsuccess = () =>
      resolve(
        (req.result as AudioEntry[]).sort((a, b) => b.createdAt - a.createdAt),
      );
    req.onerror = () => reject(req.error);
  });
}

export async function removeEntry(store: StoreName, id: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function addEntry(
  store: StoreName,
  entry: AudioEntry,
  maxEntries = 5,
): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).put(entry);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  const excess = (await listEntries(store)).slice(maxEntries);
  await Promise.all(excess.map((e) => removeEntry(store, e.id)));
}
