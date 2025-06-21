class PointerEventMock extends Event {
  /**
   *
   * @param { string } type
   * @param { Record<string,string> } props
   */
  constructor(type, props) {
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

class LocalStorageMock {
  constructor() {
    /** @type Record<string,string> */
    this.store = {};
  }
  get length() {
    return Object.keys(this.store).length;
  }

  clear() {
    this.store = {};
  }
  /**
   *
   * @param { string } key
   * @returns
   */
  getItem(key) {
    return this.store[key];
  }
  /**
   *
   * @param {string} key
   * @param {string} value
   */
  setItem(key, value) {
    this.store[key] = value;
  }
  /**
   *
   * @param {string} key
   */
  removeItem(key) {
    delete this.store[key];
  }
  /**
   *
   * @param {number} index
   * @returns {string}
   */
  key(index) {
    const list = Object.keys(this.store);
    return list[index];
  }
}
class ImageMock {
  src = '';
  width = 300;
  height = 300;
  /**
   *
   * @param {number | undefined} width
   * @param {number | undefined} height
   */
  constructor(width, height) {
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

if (!global.location) {
  global.location = {
    // @ts-ignore
    ancestorOrigins: {},
    href: '',
    origin: '',
    protocol: 'https:',
    host: '',
    hostname: '',
    port: '',
    pathname: '',
    search: '',
    hash: '',
    reload() {},
  };
}
global.location.reload = () => {};

global.localStorage = new LocalStorageMock();
global.sessionStorage = new LocalStorageMock();
// @ts-ignore
global.Image = ImageMock;

// type MessageHandler = (msg: string) => void;

class WorkerMock {
  url;
  options;
  listeners = new Map();
  /**
   *
   * @param {string | URL} url
   * @param {WorkerOptions | undefined} options
   */
  constructor(url, options) {
    this.url = url;
    this.options = options;
  }
  /**
   *
   * @param {MessageEvent} _data
   */
  onmessage(_data) {}
  /**
   *
   * @param {any} message
   */
  postMessage(message) {
    this.onmessage(message);
    Promise.resolve().then(() => {
      const list = this.listeners.get('message') || [];
      list.forEach((/** @type {(arg0: { data: any; }) => any} */ fn) =>
        fn({ data: message }),
      );
    });
  }
  /**
   *
   * @param {string} type
   * @param { (data:any) => void} fn
   */
  addEventListener(type, fn) {
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
  /**
   *
   * @type {Record<string, string | Blob | PromiseLike<string | Blob>>}
   */
  data;
  /**
   * @type {ClipboardItemOptions | undefined}
   */
  options;
  /**
   * @type {string[]}
   */
  types = [];
  /**
   *
   * @param {Record<string, string | Blob | PromiseLike<string | Blob>>} data
   * @param {ClipboardItemOptions | undefined} options
   */
  constructor(data, options) {
    this.data = data;
    this.types = Object.keys(data);
    this.options = options;
  }
  /**
   *
   * @param {string} type
   * @returns {Promise<Blob>}
   */
  getType(type) {
    // @ts-ignore
    return this.data[type];
  }
  /**
   *
   * @param {string} type
   * @returns
   */
  supports(type) {
    return !!type;
  }
}
// @ts-ignore
global.ClipboardItem = ClipboardItemMock;

// @ts-ignore
global.navigator.clipboard = {
  data: [],
  /**
   *
   * @param {ClipboardItems} data
   * @returns
   */
  write(data) {
    // @ts-ignore
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
