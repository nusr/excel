import React, { useCallback } from 'react';
import { Button } from '@/components';
import { $ } from '@/i18n';
import { CLOSE_WORKER_KEY } from '@/util';

export const Worker = () => {
  const handleClick = useCallback(() => {
    const isCloseWorker = !!localStorage.getItem(CLOSE_WORKER_KEY);
    localStorage.setItem(CLOSE_WORKER_KEY, isCloseWorker ? '' : '1');
    window.location.reload();
  }, []);
  return (
    <Button onClick={handleClick} style={{ marginLeft: 8 }} title='Worker parse formulas and OffScreenCanvas'>
      {localStorage.getItem(CLOSE_WORKER_KEY)
        ? $('open-worker')
        : $('close-worker')}
    </Button>
  );
};
