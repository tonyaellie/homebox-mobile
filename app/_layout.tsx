import { Slot, Stack } from 'expo-router';

import '../global.css';
import { StoreInit } from '../components/StoreInit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreInit>
        <Stack>
          <Stack.Screen name="login" options={{ title: 'Login' }} />
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          <Stack.Screen name="item/[id]" />
        </Stack>
      </StoreInit>
    </QueryClientProvider>
  );
}
