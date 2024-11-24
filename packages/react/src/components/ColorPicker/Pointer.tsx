import { classnames } from '@excel/shared';
import styles from './panel.module.css';

interface Props {
  className?: string;
  top?: number;
  left: number;
  color: string;
}

export const Pointer = ({
  className,
  color,
  left,
  top = 0.5,
}: Props): JSX.Element => {
  const style = {
    top: `${top * 100}%`,
    left: `${left * 100}%`,
  };

  return (
    <div
      className={classnames(styles['color-picker-panel__pointer'], className)}
      style={style}
    >
      <div
        className={styles['color-picker-panel__pointer-fill']}
        style={{ backgroundColor: color }}
      />
    </div>
  );
};
