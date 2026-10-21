import { createRequire } from 'node:module';
import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest'

vi.mock('excelize-wasm/excelize.wasm.gz?no-inline&url', () => ({
  default: createRequire(import.meta.url).resolve(
    'excelize-wasm/excelize.wasm.gz',
  ),
}));
vi.mock('excelize-wasm/main.js?no-inline&url', () => ({
  default: 'excelize-wasm',
}));

class PointerEventMock extends Event {
  constructor(type: string, props: Record<string, string>) {
    super(type, props);
    for (const [key, value] of Object.entries(props)) {
      // @ts-ignore
      if (value !== undefined && this[key] === undefined) {
        // @ts-ignore
        this[key] = value;
      }
    }
  }
}

class ImageMock {
  src = '';
  width = 300;
  height = 300;
  constructor(width?: number, height?: number) {
    if (width !== undefined) {
      this.width = width;
    }
    if (height !== undefined) {
      this.height = height;
    }
    setTimeout(() => this.onload(), 0);
  }
  onload() {}
  onerror() {}
}

// @ts-ignore
global.PointerEvent = PointerEventMock;
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// @ts-ignore
global.Image = ImageMock;

class WorkerMock {
  url;
  options;
  listeners = new Map();
  constructor(url: string | URL, options?: WorkerOptions) {
    this.url = url;
    this.options = options;
  }
  onmessage(_data: MessageEvent) {}
  postMessage(message: any) {
    this.onmessage(message);
    Promise.resolve().then(() => {
      const list = this.listeners.get('message') || [];
      list.forEach((/** @type {(arg0: { data: any; }) => any} */ fn) =>
        fn({ data: message }),
      );
    });
  }
  addEventListener(type: string, fn: (data: any) => void) {
    const list = this.listeners.get(type) || [];
    list.push(fn);
    this.listeners.set(type, list);
  }
  removeEventListener() {}
  terminate() {}
  onmessageerror() {}
  dispatchEvent() {
    return false;
  }
  onerror() {}
}

global.Worker = WorkerMock;

class ClipboardItemMock {
  data: Record<string, string | Blob | PromiseLike<string | Blob>>;
  options?: ClipboardItemOptions;
  types: string[] = [];
  constructor(
    data: Record<string, string | Blob | PromiseLike<string | Blob>>,
    options?: ClipboardItemOptions,
  ) {
    this.data = data;
    this.types = Object.keys(data);
    this.options = options;
  }
  getType(type: string): Promise<Blob> {
    // @ts-ignore
    return this.data[type];
  }
  supports(type: string) {
    return !!type;
  }
}
// @ts-ignore
global.ClipboardItem = ClipboardItemMock;

// @ts-ignore
global.navigator.clipboard = {
  data: [],
  write(data: ClipboardItems) {
    this.data = data;
    return Promise.resolve(data);
  },
  writeText: Promise.resolve,
  read() {
    return Promise.resolve(this.data);
  },
  readText() {
    return Promise.resolve('');
  },
};

global.URL.createObjectURL = function () {
  return 'blob:';
};
