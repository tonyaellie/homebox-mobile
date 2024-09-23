import { Slot, Stack } from 'expo-router';

import '../global.css';
import { StoreInit } from '../components/StoreInit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient()

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreInit>
        <Stack>
          <Stack.Screen name="login" />
          <Stack.Screen name="index" />
        </Stack>
      </StoreInit>
    </QueryClientProvider>
  );
}
