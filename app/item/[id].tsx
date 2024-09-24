import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useHBStore } from '../../store';
import { useEffect } from 'react';

export default function Item() {
  const { api, url } = useHBStore();
  const { id, name } = useLocalSearchParams();
  const router = useRouter();

  const query = api!.useQuery('get', `/v1/items/{id}`, {
    params: {
      path: {
        id: id as string,
      },
    },
  });

  const item = query.data;

  useEffect(() => {
    if (item) {
      router.setParams({
        name: item.name,
      });
    }
  }, [item]);

  return (
    <View>
      <Stack.Screen
        options={{
          title: (name || 'Loading...') as string,
        }}
      />
      <Text>
        {id} - {item?.name}
      </Text>
    </View>
  );
}
