export function saveAs(blob: Blob | string, fileName: string): void {
  const link = document.createElement('a');
  link.download = fileName || 'download';
  link.rel = 'noopener';
  link.target = '_blank';
  link.setAttribute('data-testid', 'save-as-link');
  const href = typeof blob === 'string' ? blob : URL.createObjectURL(blob);
  link.href = href;
  try {
    link.dispatchEvent(new MouseEvent('click'));
  } finally {
    if (typeof blob !== 'string') {
      setTimeout(() => URL.revokeObjectURL(href), 40_000);
    }
  }
}
