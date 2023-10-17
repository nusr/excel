import type { ScrollValue } from './components';
export interface IScrollValue {
    setScroll(scroll: ScrollValue): void;
    getScroll(): ScrollValue;
}
