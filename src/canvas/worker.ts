import {
  RequestInit,
  IWindowSize,
  RequestRender,
  ResponseRender,
  WorkerMethod,
} from '@/types';
import { computeFormulas } from '@/formula';
import OffScreenWorker from './offScreenWorker';
import { setDpr } from '@/util/dpr';

let offScreen: OffScreenWorker | null = null;

const workerMethod: WorkerMethod = {
  init(data: RequestInit) {
    offScreen = new OffScreenWorker(data.canvas);
    setDpr(data.dpr);
  },
  resize(data: IWindowSize) {
    offScreen?.resize(data);
  },
  async render(data: RequestRender, cb: (data: ResponseRender) => void) {
    const result = offScreen?.render(data);
    if (result) {
      await cb(result);
    }
  },
  computeFormulas,
};

export default workerMethod;
