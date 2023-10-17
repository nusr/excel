import iconConfig from './icon';
import { BaseIcon } from './BaseIcon';
export const Icon = ({ name, className = '', }) => {
    const paths = iconConfig[name].map((item) => ({ d: item }));
    return BaseIcon({ className, paths });
};
Icon.displayName = 'Icon';
export { BaseIcon };
export { FillColorIcon } from './FillColorIcon';
//# sourceMappingURL=index.js.map