import '@testing-library/jest-dom';
import 'core-js/stable';

if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = class TextEncoder {
    encode(input = ''): Uint8Array {
      const arr = new Uint8Array(input.length);
      for (let i = 0; i < input.length; i++) {
        arr[i] = input.charCodeAt(i);
      }
      return arr;
    }
  } as any;

  globalThis.TextDecoder = class TextDecoder {
    decode(input?: Uint8Array): string {
      if (!input) return '';
      return Array.from(input)
        .map(byte => String.fromCharCode(byte))
        .join('');
    }
  } as any;
}