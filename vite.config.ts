import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  optimizeDeps: {
    include: [
      "@mui/material",
      "@mui/icons-material",
      "@emotion/react",
      "@emotion/styled",
      "react-toastify",
      "react-hot-toast",
      "framer-motion",
    ],
  },
  build: {
    ssrManifest: true,
    rollupOptions: {
      output: {
        manualChunks: {
          mui: ["@mui/material", "@mui/icons-material"],
          ui: ["react-toastify", "react-hot-toast", "framer-motion"],
        },
      },
    },
  },
  ssr: {
    noExternal: [
      "@mui/material",
      "@mui/icons-material",
      "@emotion/react",
      "@emotion/styled",
      "react-toastify",
      "react-hot-toast",
      "framer-motion",
    ],
  },
});
