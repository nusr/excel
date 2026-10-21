import { vi } from 'vitest';
import { getDocId, getProvider } from '../util';
import template from '../../../../../scripts/model.json';

vi.mock('../constant', () => ({
  VITE_DEFAULT_EXCEL_ID: '',
  VITE_BACKEND_URL: '',
}));

beforeEach(() => {
  sessionStorage.clear();
  history.replaceState(null, '', '/#initialization-test');
});

test('initializes a missing template before allowing navigation on user-created documents', async () => {
  const callback = vi.fn().mockResolvedValue(undefined);
  const drawings = JSON.stringify(template.drawings);

  const provider = await getProvider(callback);
  const document = await provider.getDocument('initialization-test');

  expect(callback).not.toHaveBeenCalled();
  expect(document?.name).toBe('Template');
  const content = JSON.parse(document!.content!);
  expect(Object.values(content.drawings)).not.toContainEqual(expect.objectContaining({
    type: 'floating-picture',
  }));
  expect(JSON.stringify(template.drawings)).toBe(drawings);

  await provider.addDocument('user-created');
  expect(callback).toHaveBeenCalledWith(provider, 'user-created');
});

test('does not seed template content in e2e mode', async () => {
  history.replaceState(null, '', '/?mode=e2e#empty-test');
  const callback = vi.fn();

  const provider = await getProvider(callback);

  expect(await provider.getDocument('empty-test')).toBeUndefined();
  expect(callback).not.toHaveBeenCalled();
});

test('uses the hash document id or the default id', () => {
  expect(getDocId()).toBe('initialization-test');
  history.replaceState(null, '', '/');
  expect(getDocId()).toBe('184858c4-be37-41b5-af82-52689004e605');
});
