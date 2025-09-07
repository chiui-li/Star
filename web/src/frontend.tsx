/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import {
  Outlet,
  RouterProvider,
  Link,
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { RedirectComponent } from "./RedirectComponent";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

const routeTree = rootRoute.addChildren([
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: App,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => (
      <RedirectComponent
        to="/login"
        // Add your custom redirect logic here:
        // delay={1000} // Optional delay in milliseconds
        // condition={() => true} // Optional condition function
        // onBeforeRedirect={() => console.log('Redirecting to login...')} // Optional pre-redirect callback
        // onAfterRedirect={() => console.log('Redirect completed')} // Optional post-redirect callback
        // message="Redirecting to login page..." // Optional custom message
      />
    ),
  }),
]);
const router = createRouter({ routeTree });
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

if (import.meta.hot) {
  // With hot module reloading, `import.meta.hot.data` is persisted.
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  // The hot module reloading API is not available in production.
  createRoot(elem).render(app);
}
