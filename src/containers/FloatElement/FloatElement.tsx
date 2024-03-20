import React, { useState, memo, lazy, Suspense } from 'react';
import styles from './FloatElement.module.css';
import { FloatElementItem } from '@/containers/store';
import { FloatElementContextMenu } from './ContextMenu';
import { DEFAULT_POSITION, classnames } from '@/util';
import { ResizePosition } from './util';
import { Icon } from '../components';
import { IController, IWindowSize } from '@/types';
import { Loading } from '../components';

type FloatElementProps = FloatElementItem & {
  controller: IController;
  active: boolean;
  resetResize: (size: IWindowSize) => void;
  pointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
  resizeDown: (event: React.PointerEvent<HTMLDivElement>) => void;
};

const Chart = lazy(() => import('./Chart'));

export const FloatElement: React.FunctionComponent<FloatElementProps> = memo(
  (props) => {
    const {
      top,
      left,
      active,
      width,
      height,
      type,
      imageAngle = 0,
      resetResize,
      pointerDown,
      resizeDown,
    } = props;
    const [contextMenuPosition, setContextMenuPosition] = useState({
      top: DEFAULT_POSITION,
      left: DEFAULT_POSITION,
    });

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setContextMenuPosition({ top: event.clientY, left: event.clientX });
      return false;
    };
    const hideContextMenu = () => {
      setContextMenuPosition({
        top: DEFAULT_POSITION,
        left: DEFAULT_POSITION,
      });
    };

    let children = null;
    if (type === 'floating-picture') {
      children = (
        <img
          title={props.title}
          alt={props.title}
          src={props.imageSrc!}
          className={styles['image']}
        />
      );
    } else if (type === 'chart') {
      children = (
        <Suspense fallback={<Loading/>}>
          <Chart {...props} />;
        </Suspense>
      );
    }
    if (!children) {
      return null;
    }
    return (
      <React.Fragment>
        <div
          onPointerDown={pointerDown}
          onContextMenu={handleContextMenu}
          className={classnames(styles['float-element'], {
            [styles['active']]: active,
          })}
          style={{
            transform: `translateX(${left}px) translateY(${top}px) ${
              type === 'floating-picture' ? `rotate(${imageAngle}deg)` : ''
            } `,
            width,
            height,
          }}
        >
          {children}
          {active && (
            <React.Fragment>
              <div
                className={classnames(styles['resize-handler'], styles['top'])}
                data-position={ResizePosition.top}
                onPointerDown={resizeDown}
              >
                <div className={styles['scale-dot']}></div>
              </div>
              <div
                className={classnames(
                  styles['resize-handler'],
                  styles['top-right'],
                )}
                data-position={ResizePosition.topRight}
                onPointerDown={resizeDown}
              >
                <div className={styles['scale-dot']}></div>
              </div>
              <div
                className={classnames(
                  styles['resize-handler'],
                  styles['top-left'],
                )}
                data-position={ResizePosition.topLeft}
                onPointerDown={resizeDown}
              >
                <div className={styles['scale-dot']}></div>
              </div>
              <div
                className={classnames(styles['resize-handler'], styles['left'])}
                data-position={ResizePosition.left}
                onPointerDown={resizeDown}
              >
                <div className={styles['scale-dot']}></div>
              </div>
              <div
                className={classnames(
                  styles['resize-handler'],
                  styles['right'],
                )}
                data-position={ResizePosition.right}
                onPointerDown={resizeDown}
              >
                <div className={styles['scale-dot']}></div>
              </div>
              <div
                className={classnames(
                  styles['resize-handler'],
                  styles['bottom-right'],
                )}
                data-position={ResizePosition.bottomRight}
                onPointerDown={resizeDown}
              >
                <div className={styles['scale-dot']}></div>
              </div>
              <div
                className={classnames(
                  styles['resize-handler'],
                  styles['bottom-left'],
                )}
                data-position={ResizePosition.bottomLeft}
                onPointerDown={resizeDown}
              >
                <div className={styles['scale-dot']}></div>
              </div>
              <div
                className={classnames(
                  styles['resize-handler'],
                  styles['bottom'],
                )}
                data-position={ResizePosition.bottom}
                onPointerDown={resizeDown}
              >
                <div className={styles['scale-dot']}></div>
              </div>
              {type === 'floating-picture' && (
                <div
                  className={classnames(
                    styles['resize-handler'],
                    styles['rotate'],
                  )}
                  data-position={ResizePosition.rotate}
                  onPointerDown={resizeDown}
                >
                  <div className={styles['rotate-icon']}>
                    <Icon name="rotate" />
                  </div>
                </div>
              )}
            </React.Fragment>
          )}
        </div>
        {contextMenuPosition.top >= 0 && contextMenuPosition.left >= 0 && (
          <FloatElementContextMenu
            {...props}
            resetResize={resetResize}
            menuLeft={contextMenuPosition.left}
            menuTop={contextMenuPosition.top}
            hideContextMenu={hideContextMenu}
          />
        )}
      </React.Fragment>
    );
  },
);
