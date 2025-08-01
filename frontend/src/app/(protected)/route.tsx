import { Group, Menu, Text, useMantineColorScheme, Grid, SegmentedControl } from '@mantine/core';
import { AppShell, Tabs, Burger, Button, Flex } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconActivity, IconCashPlus, IconLock, IconNotes, IconPackage, IconSettingsAutomation, IconUser } from '@tabler/icons-react';
import { IconPresentationAnalytics } from '@tabler/icons-react';

import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { FaBox, FaFacebookMessenger, FaGalacticRepublic, FaSun, FaSync, FaUser } from 'react-icons/fa';
import { FaHome, FaMoon, FaPhotoVideo, FaMoneyBill, FaSignOutAlt } from 'react-icons/fa';
import { AiFillSetting } from 'react-icons/ai';
import { useState } from 'react';

import { LinksGroup } from './_components/link-group';
import { UserButton } from './_components/user-button';
import styles from './layout.module.css';

import { PermissionGate } from '~/components/middlewares/permission-gate';
import { CartProvider } from '~/components/provider/cart';
import { getColors } from '~/components/themes';

export const Route = createFileRoute('/(protected)')({
  component: RouteComponent,
});

const data = [
  {
    label: 'Sales',
    icon: IconCashPlus,
    initiallyOpened: true,
    links: [
      { label: 'Dashboard', link: '/' },
      { label: 'Point of Sales', link: '/pos' },
      { label: 'Histories', link: '/' },
    ],
  },
  {
    label: 'Product',
    icon: IconPackage,
    links: [
      { label: 'Overview', link: '/' },
      { label: 'Products', link: '/' },
    ],
  },
  {
    label: 'Inventories',
    icon: IconNotes,
    links: [
      { label: 'Inventory', link: '/' },
      { label: 'Supplier', link: '/' },
      { label: 'Stock', link: '/' },
    ],
  },
  {
    label: 'Report',
    icon: IconPresentationAnalytics,
    links: [
      { label: 'Daily Sales', link: '/' },
      { label: 'Monthly Sales', link: '/' },
      { label: 'Sales Performance', link: '/' },
      { label: 'Analytics', link: '/' },
    ],
  },
  {
    label: 'Customers',
    icon: IconUser,
    links: [
      { label: 'Overview', link: '/' },
      { label: 'Members', link: '/' },
    ],
  },
  {
    label: 'Staff',
    icon: IconActivity,
    links: [
      { label: 'Karyawan', link: '/' },
      { label: 'Account', link: '/' },
      { label: 'Roles', link: '/' },
    ],
  },
  {
    label: 'Auth',
    icon: IconLock,
    links: [
      { label: 'Profile', link: '/' },
      { label: 'Login', link: '/' },
    ],
  },
  {
    label: 'Settings',
    icon: IconSettingsAutomation,
    links: [
      { label: 'Payment', link: '/' },
      { label: 'Configuration', link: '/' },
    ],
  },
];

function RouteComponent() {
  const [section, setSection] = useState<string>('cashier');
  const [navbarOpened, { toggle }] = useDisclosure();

  const { setColorScheme } = useMantineColorScheme();
  const isDesktop = useMediaQuery('(min-width: 56.25em)', true);
  const navigate = useNavigate();

  const links = data.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <PermissionGate permissions={['product:read']}>
      <CartProvider>
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
                  { label: 'Cashier', value: 'cashier' },
                  { label: 'Admin', value: 'admin' },
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
            <Grid style={{ padding: '20px', width: '100%', margin: '0 0 20px 0', backgroundColor: getColors('primary') }}>
              <Grid.Col span={4}>
                <Burger opened={!navbarOpened && isDesktop} onClick={toggle} size="sm" style={{ marginRight: 20 }} />
              </Grid.Col>
              <Grid.Col span={4}>
                <Tabs color="rgba(255, 255, 255, 0)" style={{ display: isDesktop ? 'block' : 'none' }}>
                  <Tabs.List justify="center">
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
              </Grid.Col>
              <Grid.Col span={4} style={{ textAlign: 'right' }}>
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Button variant="default">Settings</Button>
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

            <Grid bg={getColors('primary')} mt={'lg'} p={'lg'} style={{ width: '100%' }}>
              <Grid.Col span={12}>
                <Text fz={'sm'} fw={600}>
                  Copyright &copy; 2025 Abya's POS
                </Text>
              </Grid.Col>
            </Grid>
          </AppShell.Main>
        </AppShell>
      </CartProvider>
    </PermissionGate>
  );
}
