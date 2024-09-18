export function saveAs(blob: Blob | string, fileName: string): void {
  let link: HTMLAnchorElement | undefined = document.createElement('a');
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
  link = undefined;
}


