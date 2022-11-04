import { useEffect } from "@/react";
import theme from "../theme";

export function useTheme(): void {
  useEffect(() => {
    for (const key of Object.keys(theme)) {
      document.documentElement.style.setProperty(
        `--${key}`,
        String(theme[key] || "")
      );
    }
  }, []);
}
