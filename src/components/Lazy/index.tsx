import React, { Suspense, memo, FunctionComponent } from "react";

export const Lazy: FunctionComponent<React.PropsWithChildren> = memo(({ children }) => {
  return <Suspense fallback={null}>{children}</Suspense>;
});
Lazy.displayName = "Lazy";
