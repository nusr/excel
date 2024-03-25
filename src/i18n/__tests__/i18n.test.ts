import { getLanguage, setLanguage, $ } from '../';

describe('i18n.test.ts', () => {
  let languageGetter: any;
  beforeEach(() => {
    languageGetter = jest.spyOn(window.navigator, 'language', 'get');
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('$', () => {
    it('en', () => {
      languageGetter.mockReturnValue('en');
      expect($('copy')).toEqual('Copy');
    });

    it('zh', () => {
      languageGetter.mockReturnValue('zh');
      expect($('copy')).toEqual('复制');
    });
  });
  describe('getLanguage', () => {
    it('mock', () => {
      languageGetter.mockReturnValue('en');
      expect(getLanguage()).toEqual('en');
    });
    it('mock', () => {
      languageGetter.mockReturnValue('zh');
      expect(getLanguage()).toEqual('zh');
    });
  });

  describe('setLanguage', () => {
    it('en', () => {
      setLanguage('en');
      expect(getLanguage()).toEqual('en');
    });

    it('zh', () => {
      setLanguage('zh');
      expect(getLanguage()).toEqual('zh');
    });
  });
});
