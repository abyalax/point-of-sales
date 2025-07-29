import { createTheme } from '@mantine/core';

type Colors = 'primary' | 'surface' | 'secondary';

export const getColors = (color: Colors) => {
  return `var(--color-${color})`;
};

export const colors = {
  primary: getColors('primary'),
  surface: getColors('surface'),
  secondary: getColors('secondary'),
  black: 'var(--color-black)',
  white: 'var(--color-white)',
};

export const theme = createTheme({});
