import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { Affix, Button, Transition } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { FaArrowUp } from 'react-icons/fa';

import SessionProvider from '~/components/provider/session';

import type { ISession } from '~/stores/use-session';
import type { QueryClient } from '@tanstack/react-query';

import '@mantine/core/styles/UnstyledButton.css';
import '@mantine/core/styles/SegmentedControl.css';
import '@mantine/core/styles/Button.css';
import '@mantine/core/styles/CloseButton.css';
import '@mantine/core/styles/AppShell.css';
import '@mantine/core/styles/Flex.css';
import '@mantine/core/styles/Tabs.css';
import '@mantine/core/styles/Input.css';
import '@mantine/core/styles/NumberInput.css';
import '@mantine/core/styles/PasswordInput.css';
import '@mantine/core/styles/Text.css';
import '@mantine/core/styles/Pill.css';
import '@mantine/core/styles/Overlay.css';
import '@mantine/core/styles/Menu.css';
import '@mantine/core/styles/Modal.css';
import '@mantine/core/styles/Loader.css';
import '@mantine/core/styles/Grid.css';
import '@mantine/core/styles/Fieldset.css';
import '@mantine/core/styles/Container.css';
import '@mantine/core/styles/Breadcrumbs.css';
import '@mantine/core/styles/Burger.css';
import '@mantine/core/styles/Avatar.css';
import '@mantine/core/styles/NavLink.css';
import '@mantine/core/styles/Affix.css';

interface RouterContext {
  session: ISession;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootRouteComponent,
});

function RootRouteComponent() {
  const [scroll, scrollTo] = useWindowScroll();
  return (
    <SessionProvider>
      <Outlet />
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {transitionStyles => (
            <Button style={transitionStyles} bdrs={'xl'} onClick={() => scrollTo({ y: 0 })}>
              <FaArrowUp size={16} />
            </Button>
          )}
        </Transition>
      </Affix>
    </SessionProvider>
  );
}
