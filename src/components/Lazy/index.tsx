import React, { Suspense, memo, FunctionComponent } from "react";

export const Lazy: FunctionComponent<unknown> = memo(({ children }) => {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
});
Lazy.displayName = "Lazy";
