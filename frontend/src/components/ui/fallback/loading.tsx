import { Loader, Overlay } from '@mantine/core';

export const LoadingPage = () => {
  return (
    <Overlay
      opacity={0.7}
      color="#000"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Loader size="lg" />
    </Overlay>
  );
};
