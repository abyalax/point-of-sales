import { Chart, CategoryScale, ArcElement, LinearScale, PointElement, Filler, Tooltip, Legend, BubbleController } from 'chart.js';
import { LineController, LineElement, PieController, BarController, BarElement } from 'chart.js';
import { MantineProvider, DEFAULT_THEME, mergeMantineTheme } from '@mantine/core';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';

import '@mantine/core/styles.css';
import '@mantine/core/styles.layer.css';

import '@mantine/core/styles/global.css';
import '@mantine/core/styles/global.layer.css';

import '@mantine/dates/styles.css';

import '@mantine/notifications/styles.layer.css';
import '@mantine/notifications/styles.css';

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
import SessionProvider from './components/provider/session';

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

Chart.register([
  CategoryScale,
  LinearScale,
  PieController,
  LineController,
  BarController,
  MatrixController,
  BubbleController,
  MatrixElement,
  ArcElement,
  LineElement,
  PointElement,
  BarElement,
  Filler,
  Tooltip,
  Legend,
]);

const session = useSessionStore.getState().session;

export const router = createRouter({
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
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme}>
            <RouterProvider router={router} />
          </MantineProvider>
          <ReactQueryDevtools position="bottom" />
        </QueryClientProvider>
      </SessionProvider>
    </StrictMode>,
  );
}
