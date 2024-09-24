import { Button, Text, View } from 'react-native';
import { useHBStore } from '../store';
import { Redirect, router } from 'expo-router';
import { ItemList } from '../components/ItemList';

export default function Index() {
  const { api, url, accessToken } = useHBStore();

  if (!api) {
    return <Redirect href="/login" />;
  }

  const query = api.useQuery('get', '/v1/items');

  return (
    <View className="flex-1">
      <Button
        title="Logout"
        onPress={async () => {
          await useHBStore.getState().logout();
          router.replace('/login');
        }}
      />
      {/* <Link href="/location/new" asChild>
        <Pressable className="rounded-full bg-blue-400 p-2 absolute bottom-2 right-2">
          <Plus size={36} color="black" />
        </Pressable>
      </Link> */}
      {query.isError ? (
        <Text>Error: {JSON.stringify(query.error)}</Text>
      ) : query.data ? (
        <ItemList
          items={query.data.items!}
          isFetching={query.isFetching}
          refetch={query.refetch}
          url={url!}
          token={accessToken!.token}
        />
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}
