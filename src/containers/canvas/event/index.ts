import { EventHandler } from '@/types';
import { MainHandler } from './main';
import { FilterHandler } from './filter';

const handlerList: EventHandler[] = [new FilterHandler(), new MainHandler()];

export default handlerList;
