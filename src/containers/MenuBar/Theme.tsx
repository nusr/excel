import React, { memo, useEffect, useState } from 'react';
import { Button, Icon } from '../components';
import styles from './index.module.css';
import { sizeConfig, darkColor, lightColor, setTheme, getTheme } from '@/util';
import { ThemeType } from '@/types';

interface Props {
  toggleTheme: () => void;
}

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
  document.documentElement.setAttribute('data-theme', value);
}

export const Theme: React.FunctionComponent<Props> = memo(({ toggleTheme }) => {
  const [themeData, setThemeData] = useState<ThemeType>('light');
  useEffect(() => {
    setCssVariable(sizeConfig);
  }, []);
  useEffect(() => {
    const update = (c: ThemeType) => {
      setThemeData(c);
      setTheme(c);
      updateCssVariable(c);
      toggleTheme();
    };
    update(getTheme());
    if (window.matchMedia && typeof window.matchMedia === 'function') {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (event) => {
          const { matches: isDark } = event;
          update(isDark ? 'dark' : 'light');
        });
    }
  }, [toggleTheme]);

  const handleClick = (old: ThemeType) => {
    const n = old === 'dark' ? 'light' : 'dark';
    updateCssVariable(n);
    setTheme(n);
    setThemeData(n);
    toggleTheme();
  };
  return (
    <div>
      <Button
        onClick={() => handleClick(themeData)}
        className={styles['theme-button']}
      >
        <Icon name={themeData === 'dark' ? 'sun' : 'moon'} />
      </Button>
    </div>
  );
});
