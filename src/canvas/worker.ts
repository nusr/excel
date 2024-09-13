import {
  ResponseFormula,
  RequestInit,
  IWindowSize,
  RequestRender,
  RequestFormula,
  ResponseRender,
  WorkerMethod
} from '@/types';
import { parseAllFormulas } from '@/formula';
import { OffScreenWorker } from './offScreenWorker';
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
    if (!result) {
      return
    }
    await cb(result);
  },
  async computeFormulas(data: RequestFormula, cb: (data: ResponseFormula) => void) {
    const list = parseAllFormulas(data);
    const result: ResponseFormula = {
      list,
    };
    await cb(result);
  }
}


export default workerMethod

