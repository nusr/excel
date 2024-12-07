import { stringToUint8Array, uint8ArrayToString } from '../util';

describe('uint8ArrayToString', () => {
  it('should convert Uint8Array to base64 string correctly', () => {
    const input = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
    const result = uint8ArrayToString(input);
    expect(result).toBe('SGVsbG8=');
  });

  it('should handle empty Uint8Array', () => {
    const input = new Uint8Array([]);
    const result = uint8ArrayToString(input);
    expect(result).toBe('');
  });

  it('should handle Uint8Array with special characters', () => {
    const input = new Uint8Array([240, 159, 146, 169]); // "😊"
    const result = uint8ArrayToString(input);
    expect(result).toBe('8J+SqQ==');
  });

  it('should handle Uint8Array with null bytes', () => {
    const input = new Uint8Array([0, 0, 0]);
    const result = uint8ArrayToString(input);
    expect(result).toBe('AAAA');
  });
});

describe('stringToUint8Array', () => {
  it('should convert base64 string to Uint8Array correctly', () => {
    const input = 'SGVsbG8='; // "Hello"
    const result = stringToUint8Array(input);
    expect(result).toEqual(new Uint8Array([72, 101, 108, 108, 111]));
  });

  it('should handle empty string', () => {
    const input = '';
    const result = stringToUint8Array(input);
    expect(result).toEqual(new Uint8Array([]));
  });

  it('should handle base64 string with special characters', () => {
    const input = '8J+SqQ=='; // "😊"
    const result = stringToUint8Array(input);
    expect(result).toEqual(new Uint8Array([240, 159, 146, 169]));
  });

  it('should handle base64 string with null bytes', () => {
    const input = 'AAAA';
    const result = stringToUint8Array(input);
    expect(result).toEqual(new Uint8Array([0, 0, 0]));
  });
});
