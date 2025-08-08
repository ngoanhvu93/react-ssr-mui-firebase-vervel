import "./app.css";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { Route } from "./+types/root";
import { Toaster } from "react-hot-toast";
import { StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider } from "./provider/ThemeContext";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <meta name="emotion-insertion-point" content="" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration
          getKey={(location) => {
            const paths = ["/", "/search", "/games", "/app-store", "/donate"];

            return paths.includes(location.pathname)
              ? location.pathname
              : location.key;
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <StyledEngineProvider>
      <ThemeProvider>
        <div className="mx-auto w-full max-w-4xl">
          <ToastContainer />
          <Toaster />
          <Outlet />
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "Đã xảy ra lỗi không mong muốn.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Không tìm thấy trang" : "Lỗi";
    details =
      error.status === 404
        ? "Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển."
        : error.statusText || details;
  } else if (error instanceof Error) {
    details = error.message || details;
    stack = import.meta.env.DEV ? error.stack : undefined;
  }

  return (
    <main className="pt-16 p-4 container mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">{message}</h1>
      <p className="text-gray-600 mb-8">{details}</p>
      <Link
        to="/"
        className="inline-block px-6 py-2 bg-indigo-600  rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Quay về trang chủ
      </Link>
      {stack && (
        <pre className="mt-8 w-full p-4 overflow-x-auto rounded-lg text-left">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
