import React, { memo, useCallback } from 'react';
import { Select } from '../../components';
import { OptionItem } from '../../types';
import styles from './index.module.css';
import {
  getLanguage,
  setLanguage,
  LANGUAGE_LIST,
  type LanguageType,
} from '../../i18n';

const dataList: OptionItem[] = LANGUAGE_LIST.map((v) => ({
  value: v,
  label: v,
  disabled: false,
}));
const defaultValue = getLanguage();

export const I18N: React.FunctionComponent = memo(() => {
  const handleChange = useCallback((c: string | number) => {
    setLanguage(String(c) as LanguageType);
    location.reload();
  }, []);
  return (
    <div className={styles.i18n} data-testid="menubar-i18n">
      <Select
        data={dataList}
        defaultValue={defaultValue}
        onChange={handleChange}
        testId="menubar-i18n-select"
      />
    </div>
  );
});
I18N.displayName = 'I18N';
