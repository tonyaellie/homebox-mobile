import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useHBStore } from '../../store';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { ItemList } from '../../components/ItemList';

export default function Item() {
  const { api, url, accessToken } = useHBStore();
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

  const queryItems = api!.useQuery('get', `/v1/items`, {
    params: {
      query: {
        locations: [id as string],
      },
    },
  });

  const items = queryItems.data?.items;

  useEffect(() => {
    if (location) {
      router.setParams({
        name: location.name,
      });
    }
  }, [location]);

  if (!location || !items) {
    return (
      <View>
        <Stack.Screen
          options={{
            title: (name || 'Loading location...') as string,
          }}
        />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          title: (name || 'Loading...') as string,
        }}
      />
      <Text>
        Created {dayjs(location.createdAt).fromNow()} (
        {dayjs(location.createdAt).format('YYYY-MM-DD')})
      </Text>
      <Text>
        Updated {dayjs(location.updatedAt).fromNow()} (
        {dayjs(location.updatedAt).format('YYYY-MM-DD')})
      </Text>
      <Text>{location.description}</Text>
      <Text>Items</Text>
      <ItemList
        items={items}
        isFetching={queryItems.isFetching}
        refetch={queryItems.refetch}
        url={url!}
        token={accessToken!.token}
      />
    </View>
  );
}
