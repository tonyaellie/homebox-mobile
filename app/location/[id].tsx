import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useHBStore } from '../../store';
import { useEffect } from 'react';

export default function Item() {
  const { api, url } = useHBStore();
  const { id, name } = useLocalSearchParams();
  const router = useRouter();

  const query = api!.useQuery('get', `/v1/locations/{id}`, {
    params: {
      path: {
        id: id as string,
      },
    },
  });

  const location = query.data;

  useEffect(() => {
    if (location) {
      router.setParams({
        name: location.name,
      });
    }
  }, [location]);

  return (
    <View>
      <Stack.Screen
        options={{
          title: (name || 'Loading...') as string,
        }}
      />
      <Text>
        {id} - {location?.name}
      </Text>
    </View>
  );
}
