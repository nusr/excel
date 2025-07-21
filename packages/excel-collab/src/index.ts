import './global.css';
export * from './components';
export * from './containers';
export { default as workerMethod } from './canvas/worker';
export { initController } from './controller';
export * from './util';
export * from './types';
export * from './editor';
export const version = process.env.VERSION;
