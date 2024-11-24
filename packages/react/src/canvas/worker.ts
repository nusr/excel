import type {
  RequestInit,
  IWindowSize,
  RequestRender,
  ResponseRender,
  WorkerMethod,
  RequestFormulas,
  ResponseFormulas,
} from '@excel/shared';
import { computeFormulas } from '@excel/formula';
import OffScreenWorker from './offScreenWorker';
import { setDpr } from '@excel/shared';

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
  async computeFormulas(
    data: RequestFormulas,
    cb: (data: ResponseFormulas) => boolean,
  ) {
    const result = await computeFormulas(data, cb);
    return result;
  },
};

export default workerMethod;
