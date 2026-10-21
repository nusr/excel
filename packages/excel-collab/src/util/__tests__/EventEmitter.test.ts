import { vi } from 'vitest';
import { EventEmitter } from '../EventEmitter';

type EventType = {
  test: unknown;
};
describe('EventEmitter.test.ts', () => {
  describe('EventEmitter', () => {
    test('supports event names inherited by ordinary objects', () => {
      const emitter = new EventEmitter();
      for (const name of ['constructor', '__proto__', 'toString']) {
        const listener = vi.fn();
        expect(emitter.getEventLength(name)).toBe(0);
        const unsubscribe = emitter.on(name, listener);
        emitter.emit(name, 1);
        expect(listener).toHaveBeenCalledWith(1);
        unsubscribe();
        expect(emitter.getEventLength(name)).toBe(0);
      }
    });
    test('new subscriptions wait until the next emission', () => {
      const emitter = new EventEmitter<EventType>();
      const later = vi.fn();
      emitter.on('test', () => emitter.on('test', later));
      emitter.emit('test', {});
      expect(later).not.toHaveBeenCalled();
      emitter.emit('test', {});
      expect(later).toHaveBeenCalledTimes(1);
    });
    test('once remains once across nested emissions', () => {
      const emitter = new EventEmitter<EventType>();
      let nested = false;
      const listener = vi.fn();
      emitter.on('test', () => {
        if (!nested) {
          nested = true;
          emitter.emit('test', {});
        }
      });
      emitter.once('test', listener);
      emitter.emit('test', {});
      expect(listener).toHaveBeenCalledTimes(1);
    });
    test('subscribes to an event', function () {
      const emitter = new EventEmitter<EventType>();
      const fn = vi.fn();
      emitter.on('test', fn);
      expect(emitter.getEventLength('test')).toEqual(1);
    });

    test('subscibes only once to an event', function () {
      const emitter = new EventEmitter<EventType>();
      const fn = vi.fn();
      emitter.once('test', fn);
      expect(fn).not.toHaveBeenCalled();
      emitter.emit('test', {});
    });

    test('emits an event', function () {
      const emitter = new EventEmitter<EventType>();
      const fn = vi.fn();
      emitter.on('test', fn);
      emitter.emit('test', {});
      expect(fn).toHaveBeenCalled();
    });

    test('unsubscribes from all events with name', function () {
      const emitter = new EventEmitter<EventType>();
      const fn = vi.fn();
      emitter.on('test', fn);
      emitter.off('test');
      emitter.emit('test', {});
      expect(fn).not.toHaveBeenCalled();
    });

    test('unsubscribes single event with name and callback', function () {
      const emitter = new EventEmitter<EventType>();
      const fn = vi.fn();
      emitter.on('test', fn);
      emitter.off('test', fn);
      emitter.emit('test', {});
      expect(fn).not.toHaveBeenCalled();
    });

    test('unsubscribes single event with name and callback when subscribed twice', function () {
      const emitter = new EventEmitter<EventType>();
      const fn = vi.fn();

      emitter.on('test', fn);
      emitter.on('test', fn);

      emitter.off('test', fn);
      emitter.emit('test', {});

      expect(fn).not.toHaveBeenCalled();
      expect(emitter.getEventLength('test')).toEqual(0);
    });

    test('calling off before any events added does nothing', function () {
      const emitter = new EventEmitter<EventType>();
      const fn = vi.fn();
      emitter.off('test', fn);
      expect(fn).not.toHaveBeenCalled();
    });

    test('emitting event that has not been subscribed to yet', function () {
      const emitter = new EventEmitter<EventType>();
      emitter.emit('test', 'some message');
      expect(emitter.getEventLength('test')).toEqual(0);
    });

    test('unsubscribes single event with name and callback which was subscribed once', function () {
      const emitter = new EventEmitter<EventType>();
      const fn = vi.fn();
      emitter.once('test', fn);
      emitter.off('test', fn);
      emitter.emit('test', {});

      expect(fn).not.toHaveBeenCalled();
    });

    test('unsubscribes single event with name and callback when subscribed twice out of order', function () {
      const emitter = new EventEmitter<EventType>();
      const fn = vi.fn();
      const fn2 = vi.fn();

      emitter.on('test', fn);
      emitter.on('test', fn2);
      emitter.on('test', fn);
      emitter.off('test', fn);
      emitter.emit('test', {});

      expect(fn).not.toHaveBeenCalled();

      expect(fn2).toHaveBeenCalledTimes(1);
    });

    test('removes an event inside another event', function () {
      const emitter = new EventEmitter<EventType>();

      emitter.on('test', function () {
        expect(emitter.getEventLength('test')).toEqual(1);
        emitter.off('test');
        expect(emitter.getEventLength('test')).toEqual(0);
      });

      emitter.emit('test', {});
    });

    test('event is emitted even if unsubscribed in the event callback', function () {
      const emitter = new EventEmitter<EventType>();
      let calls = 0;
      const fn = function () {
        calls += 1;
        emitter.off('test', fn);
      };
      emitter.on('test', fn);

      emitter.on('test', function () {
        calls += 1;
      });

      emitter.on('test', function () {
        calls += 1;
      });

      emitter.emit('test', {});
      expect(calls).toEqual(3);
    });

    const argumentList = [
      'test',
      undefined,
      null,
      2323,
      Symbol('test'),
      { a: 34 },
      new Map(),
      new Set(),
      344.434,
      function () {
        console.log('test');
      },
      () => {
        console.log('test');
      },
    ];
    for (const item of argumentList) {
      test(`passes ${Object.prototype.toString.apply(
        item,
      )} to event listener`, () => {
        const emitter = new EventEmitter<EventType>();
        emitter.on('test', function (data) {
          expect(data).toEqual(item);
        });
        emitter.emit('test', item);
      });
    }
  });
});
