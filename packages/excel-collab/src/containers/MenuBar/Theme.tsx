import React, { memo, useCallback, useEffect, useState } from 'react';
import styles from './index.module.css';
import { setTheme, getTheme } from '../../theme';
import { ThemeType } from '../../types';
import { useExcel } from '../store';
import { Button } from '../../component/Button';
import { Moon, Sun } from 'lucide-react';

export const Theme: React.FunctionComponent = memo(() => {
  const { controller } = useExcel();
  const [themeData, setThemeData] = useState<ThemeType>('light');
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
        onPress={handleClick}
        data-testid="menubar-theme-toggle"
        aria-label="Toggle theme"
      >
        {themeData === 'dark' ? <Sun /> : <Moon />}
      </Button>
    </div>
  );
});

Theme.displayName = 'Theme';
