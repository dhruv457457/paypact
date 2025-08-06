import { Buffer } from 'buffer';
import process from 'process';

if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  window.global = window;
  window.process = process;
}

export { Buffer }; 