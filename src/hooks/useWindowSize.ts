import { useEffect, useState } from "react";
import { getWidthHeight, IWindowSize } from "@/util";

export const useWindowSize = (): IWindowSize => {
  const [state, setState] = useState<IWindowSize>(getWidthHeight());
  useEffect(() => {
    const handler = () => {
      setState(getWidthHeight());
    };
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);
  return state;
};
