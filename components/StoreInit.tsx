import { useState, useEffect } from 'react';
import { Text, View, TextInput, Button, SafeAreaView } from 'react-native';
import { useHBStore } from '../store';

export const StoreInit = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

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

  return <>{children}</>;
};
