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

export default function Index() {
  const { api, url } = useHBStore();

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
        <View className="w-full flex-grow">
          <FlashList
            estimatedItemSize={126}
            refreshControl={
              <RefreshControl
                refreshing={query.isFetching}
                onRefresh={query.refetch}
              />
            }
            data={query.data.items}
            renderItem={({ item }) => (
              <Link href={`/item/${item.id}`} asChild>
                <Pressable className="border w-max m-2 rounded p-2 gap-2">
                  <View className="flex flex-row items-center gap-2">
                    <Text className="font-bold text-lg">{item.name}</Text>
                    <View className="rounded-full bg-pink-300 px-2 h-6 min-w-6 flex items-center justify-center">
                      <Text>{item.quantity}</Text>
                    </View>
                    <View className="flex-grow" />
                    <Link href={`/location/${item.location?.id}`} asChild>
                      <Pressable className="flex flex-row items-center border rounded p-1 gap-1">
                        <MapPin size={16} color="black" />
                        <Text>{item.location?.name}</Text>
                      </Pressable>
                    </Link>
                  </View>
                  {item.labels && item.labels.length > 0 && (
                    <View className="flex flex-row gap-2 flex-wrap">
                      {item.labels.map((label, i) => (
                        <Link href={`/label/${label.id}`} asChild key={i}>
                          <Pressable className="bg-blue-300 rounded-full px-2 h-6 min-w-6 flex items-center justify-center">
                            <Text>{label.name}</Text>
                          </Pressable>
                        </Link>
                      ))}
                    </View>
                  )}
                  {item.imageId && (
                    <Image
                      source={{
                        uri: `${url}/v1/items/${item.id}/attachments/${
                          item.imageId
                        }?access_token=${
                          useHBStore.getState().accessToken?.token
                        }`,
                      }}
                      className="w-full h-64"
                    />
                  )}
                  {item.description && (
                    <Text className="text-sm">{item.description}</Text>
                  )}
                </Pressable>
              </Link>
            )}
            keyExtractor={(item) => item.id as string}
            extraData={false}
          />
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}
