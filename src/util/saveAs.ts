function click(node: HTMLAnchorElement) {
  try {
    node.dispatchEvent(new MouseEvent('click'));
  } catch (e) {
    const evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(
      'click',
      true,
      true,
      window,
      0,
      0,
      0,
      80,
      20,
      false,
      false,
      false,
      false,
      0,
      null,
    );
    node.dispatchEvent(evt);
  }
}

export function saveAs(blob: Blob | string, fileName: string): void {
  const a = document.createElement('a');
  a.download = fileName || 'download';
  a.rel = 'noopener';
  a.target = '_blank';
  if (typeof blob === 'string') {
    a.href = blob;
    click(a);
  } else {
    a.href = URL.createObjectURL(blob);
    click(a);
  }
}
