import { Container as ContainerMantine } from '@mantine/core';
import type { ContainerProps, MantineStyleProp } from '@mantine/core';
import type { ReactNode } from 'react';
import { getColors } from '~/components/themes';

type Props = {
  children: ReactNode;
  style?: MantineStyleProp;
} & ContainerProps;

export function Container({ children, style, ...props }: Props) {
  return (
    <ContainerMantine p={10} bdrs={10} {...props} style={{ backgroundColor: getColors('primary'), ...style }}>
      {children}
    </ContainerMantine>
  );
}
