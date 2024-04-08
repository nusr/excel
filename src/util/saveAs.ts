import { IWindowSize } from '@/types';

export function saveAs(blob: Blob | string, fileName: string): void {
  let link: HTMLAnchorElement | null = document.createElement('a');
  link.download = fileName || 'download';
  link.rel = 'noopener';
  link.target = '_blank';
  link.setAttribute('data-testid', 'save-as-link');
  if (typeof blob === 'string') {
    link.href = blob;
  } else {
    link.href = URL.createObjectURL(blob);
  }
  link.dispatchEvent(new MouseEvent('click'));
  link = null;
}

export function getImageSize(src: string): Promise<IWindowSize> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const width = image.width;
      const height = image.height;

      resolve({ width, height });
    };
    image.onerror = (error) => {
      reject(error);
    };
    // base64 or link
    image.src = src;
  });
}
