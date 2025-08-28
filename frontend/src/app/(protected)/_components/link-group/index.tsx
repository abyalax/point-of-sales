import { Box, Collapse, Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import type { FileRouteTypes } from '~/routeTree.gen';
import { useNavigate } from '@tanstack/react-router';
import classes from './NavbarLinksGroup.module.css';
import { useState } from 'react';

interface LinksGroupProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: FileRouteTypes['to'] }[] | FileRouteTypes['to'];
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, links }: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const navigate = useNavigate();
  const [opened, setOpened] = useState(initiallyOpened || false);
  const items = (hasLinks ? links : []).map((link) => (
    <UnstyledButton onClick={() => navigate({ to: link.link })} key={link.label} style={{ display: 'block', width: '100%' }}>
      <Text className={classes.link} key={link.label} onClick={(event) => event.preventDefault()}>
        {link.label}
      </Text>
    </UnstyledButton>
  ));

  return (
    <>
      <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight className={classes.chevron} stroke={1.5} size={16} style={{ transform: opened ? 'rotate(-90deg)' : 'none' }} />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
