import { IconChevronRight } from '@tabler/icons-react';
import { Avatar, Flex, Text, UnstyledButton } from '@mantine/core';
import classes from './UserButton.module.css';

export function UserButton() {
  return (
    <UnstyledButton className={classes.user}>
      <Flex w={'100%'} p={0}>
        <Avatar
          style={{ marginRight: '10px' }}
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
          radius="xl"
        />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            Harriette
          </Text>

          <Text c="dimmed" size="xs">
            hspoon@outlook.com
          </Text>
        </div>

        <IconChevronRight size={14} stroke={1.5} />
      </Flex>
    </UnstyledButton>
  );
}
