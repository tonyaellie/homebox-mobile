import { useState, useEffect } from 'react';
import { Text, View, TextInput, Button, SafeAreaView } from 'react-native';
import { useHBStore } from '../store';
import { Redirect, usePathname } from 'expo-router';

export const StoreInit = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const { api } = useHBStore();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      await useHBStore.getState().load();
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!api && !pathname.includes('login')) {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
};
