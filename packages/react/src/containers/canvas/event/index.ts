import type { EventHandler } from '@excel/shared';
import { MainHandler } from './main';
import { FilterHandler } from './filter';

const handlerList: EventHandler[] = [new FilterHandler(), new MainHandler()];

export default handlerList;
