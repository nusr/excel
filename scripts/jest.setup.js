const { mainDomSet } = require('../src/util');
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
    return this.store[key] || null;
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
   * @returns {string| null}
   */
  key(index) {
    const list = Object(this.store);
    if (list[index]) {
      return list[index];
    }
    return null;
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

const spy = jest.spyOn(mainDomSet, 'getDomRect');
spy.mockReturnValue({ top: 144.5, left: 0, width: 1300, height: 500 });

global.localStorage = new LocalStorageMock();
// @ts-ignore
global.Image = ImageMock;
