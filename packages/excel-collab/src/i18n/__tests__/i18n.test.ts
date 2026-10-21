import { vi } from 'vitest';
import i18n from '../';
import { LANGUAGE_LIST } from '../../util';

describe('i18n.test.ts', () => {
  let languageGetter: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    languageGetter = vi.spyOn(window.navigator, 'language', 'get');
    localStorage.clear();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  describe('$', () => {
    it('en-US', () => {
      languageGetter.mockReturnValue('en-US');
      i18n.init();
      expect(i18n.t('copy')).toEqual('Copy');
    });

    it('zh-CN', () => {
      languageGetter.mockReturnValue('zh-CN');
      i18n.init();
      expect(i18n.t('copy')).toEqual('复制');
    });
  });
  describe('get current language', () => {
    for (const item of LANGUAGE_LIST) {
      it(`mock navigator.language = ${item}`, () => {
        languageGetter.mockReturnValue(item);
        i18n.init();
        expect(i18n.current).toEqual(item);
      });
    }
  });
});
