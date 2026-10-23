import wasmUrl from 'excelize-wasm/excelize.wasm.gz?no-inline&url';
import moduleUrl from 'excelize-wasm/main.js?no-inline&url';
import type { init } from 'excelize-wasm';

export type Excelize = Awaited<ReturnType<typeof init>>;

let pending: Promise<Excelize> | undefined;

async function initialize(module: typeof import('excelize-wasm')): Promise<Excelize> {
  if (typeof process !== 'undefined' && process.versions?.node) {
    return module.init(wasmUrl);
  }
  const response = await fetch(wasmUrl);
  if (!response.ok) throw new Error(`Failed to load Excelize WASM (${response.status})`);
  let blob = await response.blob();
  const header = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
  // Servers may transparently decompress .gz assets, but Excelize always expects gzip.
  if (header[0] === 0 && header[1] === 97 && header[2] === 115 && header[3] === 109) {
    blob = await new Response(blob.stream().pipeThrough(new CompressionStream('gzip'))).blob();
  }
  const url = URL.createObjectURL(blob);
  try {
    return await module.init(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function loadExcelize(): Promise<Excelize> {
  pending ??= import(/* @vite-ignore */ moduleUrl).then(initialize).catch((error: unknown) => {
    pending = undefined;
    throw error;
  });
  return pending;
}

export function checkExcelize<T extends { error?: string | null }>(result: T): T {
  if (result.error) {
    throw new Error(result.error);
  }
  return result;
}
