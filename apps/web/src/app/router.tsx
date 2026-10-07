import { createBrowserRouter } from "react-router";

import { RootLayout } from "./root-layout";
import { RouteError } from "./route-error";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: RouteError,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import("../routes/playground")).PlaygroundPage,
        }),
      },
      {
        path: "users",
        lazy: async () => ({
          Component: (await import("../routes/users")).UsersPage,
        }),
      },
      {
        path: "*",
        lazy: async () => ({
          Component: (await import("../routes/not-found")).NotFoundPage,
        }),
      },
    ],
  },
]);
