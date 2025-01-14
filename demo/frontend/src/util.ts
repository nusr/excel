export function getDocId(): string {
  const hash = location.hash;
  if (hash.startsWith('#')) {
    return hash.slice(1);
  }
  return (
    import.meta.env.VITE_DEFAULT_EXCEL_ID ||
    '184858c4-be37-41b5-af82-52689004e605'
  );
}

export function jumpPage(route: 'collab' | '' | 'app', id?: string) {
  location.href =
    location.origin + import.meta.env.BASE_URL + route + (id ? '#' + id : '');
}
