import workerMethod from './canvas/worker';
import { expose } from 'comlink';

expose(workerMethod)
