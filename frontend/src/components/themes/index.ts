import { createTheme } from '@mantine/core';

type Colors = 'primary' | 'surface' | 'secondary';

export const getColors = (color: Colors) => {
  return `var(--color-${color})`;
};

export const theme = createTheme({});
