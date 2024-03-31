import React, { memo } from 'react';
import { Select } from '../components';
import { OptionItem, LanguageType } from '@/types';
import { LANGUAGE_LIST } from '@/util';
import styles from './index.module.css';
import { getLanguage, setLanguage } from '@/i18n';

const dataList: OptionItem[] = LANGUAGE_LIST.map((v) => ({
  value: v,
  label: v,
  disabled: false,
}));
const defaultValue = getLanguage();

export const I18N: React.FunctionComponent = memo(() => {
  const handleChange = (c: string | number) => {
    const l = String(c) as LanguageType;
    setLanguage(l);
    window.location.reload();
  };
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
