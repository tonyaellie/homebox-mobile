import {
  Redirect,
  Stack,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { Text, View } from 'react-native';
import { useHBStore } from '../../store';
import dayjs from 'dayjs';
import { ItemList } from '../../components/ItemList';

export default function Item() {
  const { api, url, accessToken } = useHBStore();
  const { id } = useLocalSearchParams();
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

  if (!label) {
    return (
      <View>
        <Stack.Screen
          options={{
            title: 'Loading label...',
          }}
        />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          title: (label.name || 'Loading...') as string,
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
      {queryItems.isError ? (
        <Text>Error: {JSON.stringify(queryItems.error)}</Text>
      ) : queryItems.data?.items ? (
        <ItemList
          items={queryItems.data.items}
          isFetching={queryItems.isFetching}
          refetch={queryItems.refetch}
          url={url!}
          token={accessToken!.token}
        />
      ) : (
        <Text>Loading items...</Text>
      )}
    </View>
  );
}
