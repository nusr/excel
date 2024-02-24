export function saveAs(blob: Blob | string, fileName: string): void {
  let link: HTMLAnchorElement | null = document.createElement('a');
  link.download = fileName || 'download';
  link.rel = 'noopener';
  link.target = '_blank';
  if (typeof blob === 'string') {
    link.href = blob;
  } else {
    link.href = URL.createObjectURL(blob);
  }
  link.dispatchEvent(new MouseEvent('click'));
  link = null;
}
