import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider, DEFAULT_THEME, mergeMantineTheme } from '@mantine/core';

import '@mantine/core/styles.layer.css';
import '@mantine/core/styles/baseline.css';
import '@mantine/core/styles/global.css';
import '@mantine/notifications/styles.layer.css';
import '@mantine/notifications/styles.css';
import '@mantine/core/styles/Notification.css';

import '~/lib/axios/api';
import './index.css';

import { routeTree } from './routeTree.gen';
import { ErrorPage } from './components/ui/fallback/error';
import { LoadingPage } from './components/ui/fallback/loading';
import { NotFoundPage } from './components/ui/fallback/notfound';
import { useSessionStore } from './stores/use-session';
import { queryClient } from './lib/reactquery';

import { theme as themeOveride } from './components/themes';
import type { QueryKey } from './common/const/querykey';
import type { MutationKey } from './common/const/mutationkey';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      invalidateQueries: (QueryKey | MutationKey)[];
    };
  }
}

const session = useSessionStore.getState().session;

const router = createRouter({
  routeTree,
  defaultPendingComponent: LoadingPage,
  defaultNotFoundComponent: NotFoundPage,
  defaultErrorComponent: ErrorPage,
  context: { session, queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

export type AppRouter = typeof router;

const theme = mergeMantineTheme(DEFAULT_THEME, themeOveride);

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <RouterProvider router={router} />
        </MantineProvider>
        <ReactQueryDevtools position="bottom" />
      </QueryClientProvider>
    </StrictMode>,
  );
}
