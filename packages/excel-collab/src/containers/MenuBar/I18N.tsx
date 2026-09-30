import React, { memo, useCallback } from 'react';
import type { LanguageType } from '../../types';
import styles from './index.module.css';
import i18n from '../../i18n';
import { LANGUAGE_LIST } from '../../util';
import { Select, SelectItem } from '../../component/Select';

export const I18N: React.FunctionComponent = memo(() => {
  const handleChange = useCallback((c: LanguageType) => {
    i18n.changeLanguage(c);
    if (process.env.NODE_ENV !== 'test') {
      location.reload();
    }
  }, []);
  return (
    <div className={styles.i18n} data-testid="menubar-i18n">
      <Select
        data-testid="menubar-i18n-select"
        defaultValue={i18n.current}
        onChange={(value) => {
          handleChange(value as LanguageType);
        }}
        aria-label="Select language"
      >
        {LANGUAGE_LIST.map((item) => (
          <SelectItem key={item} id={item} aria-label={item}>
            {item}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
});
I18N.displayName = 'I18N';
