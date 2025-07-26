import React, { memo, useCallback } from 'react';
import { Select } from '../../components';
import type { OptionItem, LanguageType } from '../../types';
import styles from './index.module.css';
import i18n from '../../i18n';
import { LANGUAGE_LIST } from '../../util';

const dataList: OptionItem[] = LANGUAGE_LIST.map((v) => ({
  value: v,
  label: v,
  disabled: false,
}));

export const I18N: React.FunctionComponent = memo(() => {
  const handleChange = useCallback((c: string | number) => {
    i18n.changeLanguage(String(c) as LanguageType);
    if (process.env.NODE_ENV !== 'test') {
      location.reload();
    }
  }, []);
  return (
    <div className={styles.i18n} data-testid="menubar-i18n">
      <Select
        data={dataList}
        defaultValue={i18n.current}
        onChange={handleChange}
        testId="menubar-i18n-select"
      />
    </div>
  );
});
I18N.displayName = 'I18N';
