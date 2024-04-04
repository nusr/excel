declare global {
  function queryLocalFonts(): Promise<
    Array<{
      fullName: string;
      family: string;
      postscriptName: string;
      style: string;
    }>
  >;
}
export {};
