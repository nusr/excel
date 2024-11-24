interface Window {
  queryLocalFonts?: () => Promise<
    Array<{
      fullName: string;
      family: string;
      postscriptName: string;
      style: string;
    }>
  >;
}

