import { Group, Menu, Text, useMantineColorScheme, Grid, SegmentedControl } from '@mantine/core';
import { AppShell, Tabs, Burger, Button, Flex } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconCalendarStats, IconFileAnalytics, IconGauge, IconLock, IconNotes } from '@tabler/icons-react';
import { IconAdjustments, IconPresentationAnalytics } from '@tabler/icons-react';
import { AiFillSetting } from 'react-icons/ai';

import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { FaBox, FaFacebookMessenger, FaGalacticRepublic, FaSun, FaSync, FaUser } from 'react-icons/fa';
import { FaHome, FaMoon, FaPhotoVideo, FaMoneyBill, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';

import { PermissionGate } from '~/components/middlewares/permission-gate';
import { LinksGroup } from './_components/link-group';
import { UserButton } from './_components/user-button';
import { getColors } from '~/components/themes';

import styles from './layout.module.css';

export const Route = createFileRoute('/(protected)')({
  component: RouteComponent,
});

const data = [
  { label: 'Dashboard', icon: IconGauge },
  {
    label: 'Market news',
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: 'Overview', link: '/' },
      { label: 'Forecasts', link: '/' },
      { label: 'Outlook', link: '/' },
      { label: 'Real time', link: '/' },
    ],
  },
  {
    label: 'Releases',
    icon: IconCalendarStats,
    links: [
      { label: 'Upcoming releases', link: '/' },
      { label: 'Previous releases', link: '/' },
      { label: 'Releases schedule', link: '/' },
    ],
  },
  { label: 'Analytics', icon: IconPresentationAnalytics },
  { label: 'Contracts', icon: IconFileAnalytics },
  { label: 'Settings', icon: IconAdjustments },
  {
    label: 'Security',
    icon: IconLock,
    links: [
      { label: 'Enable 2FA', link: '/' },
      { label: 'Change password', link: '/' },
      { label: 'Recovery codes', link: '/' },
    ],
  },
];

function RouteComponent() {
  const [section, setSection] = useState<string>('account');
  const [activeTab, setActiveTab] = useState<string | null>('home');
  const [navbarOpened, { toggle }] = useDisclosure();

  const { setColorScheme } = useMantineColorScheme();
  const isDesktop = useMediaQuery('(min-width: 56.25em)', true);
  const navigate = useNavigate();

  const links = data.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <PermissionGate permissions={['product:read']}>
      <AppShell
        header={{ height: 0, collapsed: true, offset: !navbarOpened }}
        navbar={{
          width: 270,
          breakpoint: 'sm',
          collapsed: { mobile: !navbarOpened, desktop: navbarOpened },
        }}
        padding="md"
      >
        <AppShell.Navbar p="xs" style={{ backgroundColor: getColors('primary'), alignItems: 'start' }}>
          <div className={styles.navbarMain}>
            <Flex justify={'space-between'} className={styles.header}>
              <Group>
                <FaGalacticRepublic size={32} />
                <Text fw={'bold'} fz={'h4'} style={{ textWrap: 'nowrap' }}>
                  Abya's POS
                </Text>
              </Group>
              <Burger opened={navbarOpened && !isDesktop} onClick={toggle} size="sm" />
            </Flex>
            <SegmentedControl
              styles={{
                root: { width: '100%', backgroundColor: getColors('secondary') },
                indicator: { width: '50%', backgroundColor: getColors('primary') },
              }}
              value={section}
              onChange={(value: string) => setSection(value)}
              transitionTimingFunction="ease"
              fullWidth
              m={'0 0 20px 0'}
              data={[
                { label: 'Account', value: 'account' },
                { label: 'System', value: 'general' },
              ]}
            />
            {links}
          </div>
          <UserButton />
        </AppShell.Navbar>

        <AppShell.Main
          styles={{
            main: {
              backgroundColor: getColors('secondary'),
            },
          }}
        >
          <Grid style={{ padding: '20px', width: '100%', margin: '0 0 20px 0' }}>
            <Grid.Col span={8}>
              <Flex>
                <Burger opened={!navbarOpened && isDesktop} onClick={toggle} size="sm" />
                <Tabs value={activeTab} onChange={setActiveTab} style={{ display: isDesktop ? 'block' : 'none' }}>
                  <Tabs.List>
                    <Tabs.Tab
                      className={styles.tab}
                      value="home"
                      size={'lg'}
                      fz={'h5'}
                      onClick={() => navigate({ to: '/dashboard' })}
                      leftSection={<FaHome size={16} />}
                    >
                      Home
                    </Tabs.Tab>
                    <Tabs.Tab
                      className={styles.tab}
                      value="products"
                      size={'lg'}
                      fz={'h5'}
                      onClick={() => navigate({ to: '/products' })}
                      leftSection={<FaBox size={16} />}
                    >
                      Products
                    </Tabs.Tab>
                    <Tabs.Tab
                      className={styles.tab}
                      value="pos"
                      size={'lg'}
                      fz={'h5'}
                      onClick={() => navigate({ to: '/pos' })}
                      leftSection={<FaMoneyBill size={16} />}
                    >
                      Point Of Sales
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs>
              </Flex>
            </Grid.Col>
            <Grid.Col span={4} style={{ textAlign: 'right' }}>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button>Settings</Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Application</Menu.Label>
                  <Menu.Item onClick={() => console.log('Clicked')} leftSection={<AiFillSetting size={14} />}>
                    Settings
                  </Menu.Item>
                  <Menu.Item leftSection={<FaFacebookMessenger size={14} />}>Messages</Menu.Item>
                  <Menu.Item leftSection={<FaPhotoVideo size={14} />}>Gallery</Menu.Item>

                  <Menu.Label>Theme</Menu.Label>
                  <Menu.Item leftSection={<FaMoon size={14} />} onClick={() => setColorScheme('dark')}>
                    <Text fz={'sm'}>Dark</Text>
                  </Menu.Item>
                  <Menu.Item leftSection={<FaSun size={14} />} onClick={() => setColorScheme('light')}>
                    <Text fz={'sm'}>Light</Text>
                  </Menu.Item>
                  <Menu.Item leftSection={<FaSync size={14} />} onClick={() => setColorScheme('auto')}>
                    <Text fz={'sm'}>Auto</Text>
                  </Menu.Item>

                  <Menu.Divider />

                  <Menu.Label>User</Menu.Label>
                  <Menu.Item leftSection={<FaUser size={14} />}>Profile</Menu.Item>
                  <Menu.Item color="red" leftSection={<FaSignOutAlt size={14} />}>
                    Sign Out
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Grid.Col>
          </Grid>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </PermissionGate>
  );
}
