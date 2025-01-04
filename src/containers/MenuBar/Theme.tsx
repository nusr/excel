import React, { memo, useCallback, useEffect, useState } from 'react';
import { Button, Icon } from '../../components';
import styles from './index.module.css';
import {
  sizeConfig,
  darkColor,
  lightColor,
  setTheme,
  getTheme,
} from '../../theme';
import { ThemeType } from '../../types';
import { useExcel } from '../store';

function setCssVariable(data: Record<string, string | number>) {
  const keyList = Object.keys(data);
  for (const key of keyList) {
    const name = `--${key}`;
    const value = String(data[key] || '');
    document.documentElement.style.setProperty(name, value);
  }
}

function updateCssVariable(value: ThemeType) {
  if (value === 'dark') {
    setCssVariable(darkColor);
  } else {
    setCssVariable(lightColor);
  }
}

export const Theme: React.FunctionComponent = memo(() => {
  const { controller } = useExcel();
  const [themeData, setThemeData] = useState<ThemeType>('light');
  useEffect(() => {
    setCssVariable(sizeConfig);
  }, []);
  useEffect(() => {
    setThemeData(getTheme());
    if (typeof window.matchMedia === 'function') {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (event) => {
          setThemeData(event.matches ? 'dark' : 'light');
        });
    }
  }, []);

  useEffect(() => {
    setTheme(themeData);
    updateCssVariable(themeData);
    controller.emit('renderChange', {
      changeSet: new Set(['cellStyle']),
    });
  }, [themeData, controller]);

  const handleClick = useCallback(() => {
    setThemeData((oldTheme) => {
      return oldTheme === 'dark' ? 'light' : 'dark';
    });
  }, []);
  return (
    <div data-testid="menubar-theme" className={styles.theme}>
      <Button
        onClick={handleClick}
        className={styles['theme-button']}
        testId="menubar-theme-toggle"
      >
        <Icon name={themeData === 'dark' ? 'sun' : 'moon'} />
      </Button>
    </div>
  );
});

Theme.displayName = 'Theme';
