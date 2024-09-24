import {
  Button,
  Image,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useHBStore } from '../store';
import { Link, Redirect } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { MapPin } from 'lucide-react-native';
import { Plus } from 'lucide-react-native';
import { ItemList } from '../components/ItemList';

export default function Index() {
  const { api, url, accessToken } = useHBStore();

  const query = api!.useQuery('get', '/v1/items');

  return (
    <View className="flex-1">
      <Button
        title="Logout"
        onPress={async () => await useHBStore.getState().logout()}
      />
      {/* <Link href="/location/new" asChild>
        <Pressable className="rounded-full bg-blue-400 p-2 absolute bottom-2 right-2">
          <Plus size={36} color="black" />
        </Pressable>
      </Link> */}
      {query?.data ? (
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
