import React, { memo, Suspense, useState, useCallback, Fragment } from 'react';
import styles from './FloatElement.module.css';
import type { FloatElementItem } from '../../containers/store';
import { FloatElementContextMenu } from './ContextMenu';
import { classnames, DEFAULT_POSITION } from '../../util';
import { ResizePosition } from './util';
import { IWindowSize } from '../../types';
import { Image } from './Image';
import { ProgressCircle } from '../../component/ProgressCircle';
import { RotateCw } from 'lucide-react';

const Chart = React.lazy(() => import('./Chart'));

type FloatElementProps = FloatElementItem & {
  active: boolean;
  resetResize: (size: IWindowSize) => void;
  pointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
  resizeDown: (event: React.PointerEvent<HTMLDivElement>) => void;
};

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

    const handleContextMenu = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setContextMenuPosition({ top: event.clientY, left: event.clientX });
      },
      [],
    );
    const hideContextMenu = useCallback(() => {
      setContextMenuPosition({
        top: DEFAULT_POSITION,
        left: DEFAULT_POSITION,
      });
    }, []);

    let children: React.ReactNode = undefined;
    if (type === 'floating-picture') {
      children = (
        <Image
          title={props.title}
          imageSrc={props.imageSrc!}
          uuid={props.uuid}
        />
      );
    } else if (type === 'chart') {
      children = (
        <Suspense
          fallback={
            <ProgressCircle
              value={60}
              size={64}
              isIndeterminate
              aria-label="Loading chart"
            />
          }
        >
          <Chart {...props} />
        </Suspense>
      );
    }
    if (!children) {
      return children;
    }
    return (
      <Fragment>
        <div
          onPointerDown={pointerDown}
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
          data-testid="float-element"
          onContextMenu={handleContextMenu}
        >
          {children}
          {active && (
            <React.Fragment>
              <div
                className={classnames(styles['resize-handler'], styles['top'])}
                data-position={ResizePosition.top}
                onPointerDown={resizeDown}
                data-testid="float-element-resize-top"
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
                data-testid="float-element-resize-top-right"
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
                data-testid="float-element-resize-top-left"
              >
                <div className={styles['scale-dot']}></div>
              </div>
              <div
                className={classnames(styles['resize-handler'], styles['left'])}
                data-position={ResizePosition.left}
                onPointerDown={resizeDown}
                data-testid="float-element-resize-left"
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
                data-testid="float-element-resize-right"
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
                data-testid="float-element-resize-bottom-right"
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
                data-testid="float-element-resize-bottom-left"
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
                data-testid="float-element-resize-bottom"
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
                  data-testid="float-element-rotate"
                >
                  <div className={styles['rotate-icon']}>
                    <RotateCw />
                  </div>
                </div>
              )}
            </React.Fragment>
          )}
        </div>
        {contextMenuPosition.top >= 0 && contextMenuPosition.left >= 0 && (
          <FloatElementContextMenu
            {...props}
            menuLeft={contextMenuPosition.left}
            menuTop={contextMenuPosition.top}
            resetResize={resetResize}
            hideContextMenu={hideContextMenu}
          />
        )}
      </Fragment>
    );
  },
);
