import { defineConfig } from "vite";
import path from "path";
import reactRefresh from "@vitejs/plugin-react-refresh";

const pathResolve = (pathStr: string) => {
  return path.resolve(__dirname, pathStr);
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: [{ find: "@", replacement: pathResolve("./src") }],
    extensions: [".tsx", ".ts"],
  },
  build: {
    sourcemap: true,
  },
});
