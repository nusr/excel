export const IMAGE_TYPE_MAP = {
  'image/apng': ['.apng'],
  'image/bmp': ['.bmp'],
  'image/x-icon': ['.ico', '.cur'],
  // 'image/tiff': ['.tif', '.tiff'], // only Safari
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
  'image/avif': ['.avif'],
  'image/gif': ['.gif'],
  'image/jpeg': ['.jpeg', '.jpg', '.jfif', '.pjpeg', '.pjp'],
} as const;

export function extractImageType(src: string): {
  ext: string;
  type: string;
  base64: string;
} {
  if (!src) {
    return { ext: '', base64: '', type: '' };
  }
  const base64Prefix = ';base64,';
  const i = src.indexOf(base64Prefix);
  const prefix = 'data:';
  const type = src.slice(prefix.length, i);
  // @ts-ignore
  const list = IMAGE_TYPE_MAP[type] || [];
  if (list.length > 0) {
    return { ext: list[0], type, base64: src.slice(i + base64Prefix.length) };
  }
  return { ext: '', base64: '', type: '' };
}

export function convertFileToTextOrBase64(
  file: File,
  isBase64 = false,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const result = event.target?.result;
      if (result && typeof result === 'string') {
        resolve(result);
      } else {
        resolve('');
      }
    };
    reader.onerror = function (error) {
      reject(error);
    };
    if (isBase64) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  });
}
