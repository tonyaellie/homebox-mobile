import { Link, Redirect, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useHBStore } from '../../store';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { ItemList } from '../../components/ItemList';

export default function Item() {
  const { api, url, accessToken } = useHBStore();
  const { id, name } = useLocalSearchParams();
  const router = useRouter();

  if (!api) {
    return <Redirect href="/login" />;
  }

  const query = api.useQuery('get', `/v1/labels/{id}`, {
    params: {
      path: {
        id: id as string,
      },
    },
  });

  const label = query.data;

  const queryItems = api.useQuery('get', `/v1/items`, {
    params: {
      query: {
        labels: [id as string],
      },
    },
  });

  const items = queryItems.data?.items;

  useEffect(() => {
    if (label) {
      router.setParams({
        name: label.name,
      });
    }
  }, [label]);

  if (!label || !items) {
    return (
      <View>
        <Stack.Screen
          options={{
            title: (name || 'Loading label...') as string,
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
        Created {dayjs(label.createdAt).fromNow()} (
        {dayjs(label.createdAt).format('YYYY-MM-DD')})
      </Text>
      <Text>
        Updated {dayjs(label.updatedAt).fromNow()} (
        {dayjs(label.updatedAt).format('YYYY-MM-DD')})
      </Text>
      <Text>{label.description}</Text>
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
