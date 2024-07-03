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
// @ts-ignore
delete global.location;
// @ts-ignore
global.location = {
  reload: () => {},
};

global.localStorage = new LocalStorageMock();
// @ts-ignore
global.Image = ImageMock;

// type MessageHandler = (msg: string) => void;

class WorkerMock {
  url;
  options;
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
   * @param {any} _data
   */
  onmessage(_data) {}
  /**
   *
   * @param {any} msg
   */
  postMessage(msg) {
    this.onmessage(msg);
  }
  addEventListener() {}
  removeEventListener() {}
  terminate() {}
  onmessageerror() {}
  dispatchEvent() {
    return false;
  }
  onerror() {}
}

global.Worker = WorkerMock;

// @ts-ignore
global.navigator.clipboard = {
  write: Promise.resolve,
  writeText: Promise.resolve,
  read() {
    return Promise.resolve([]);
  },
  readText() {
    return Promise.resolve('');
  },
};
