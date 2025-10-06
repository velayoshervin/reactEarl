import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./AxiosTanstack";

import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { ModalsProvider } from "@mantine/modals";
import "@mantine/core/styles.css"; // Mantine core styles
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
// ✅ Setup persister with localStorage
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

// ✅ Attach persistence to queryClient
persistQueryClient({
  queryClient,
  persister,
  maxAge: Infinity, // never garbage collect unless you invalidate
});

export function Root() {
  return (
    <MantineProvider theme={{}} withGlobalStyles withNormalizeCSS>
      <ModalsProvider>
        <Notifications position="top-center" zIndex={2077} />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ModalsProvider>
    </MantineProvider>
  );
}

const container = document.getElementById("root");

// ✅ Keep HMR safe
if (!window._root) {
  window._root = ReactDOM.createRoot(container);
}

window._root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Root />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
