import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useHBStore } from '../../store';
import { useEffect } from 'react';

export default function Item() {
  const { api, url } = useHBStore();
  const { id, name } = useLocalSearchParams();
  const router = useRouter();

  const query = api!.useQuery('get', `/v1/labels/{id}`, {
    params: {
      path: {
        id: id as string,
      },
    },
  });

  const label = query.data;

  useEffect(() => {
    if (label) {
      router.setParams({
        name: label.name,
      });
    }
  }, [label]);

  return (
    <View>
      <Stack.Screen
        options={{
          title: (name || 'Loading...') as string,
        }}
      />
      <Text>
        {id} - {label?.name}
      </Text>
    </View>
  );
}
