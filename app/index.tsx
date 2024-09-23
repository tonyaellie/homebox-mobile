import {
  Button,
  Image,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useHBStore } from '../store';
import { Redirect } from 'expo-router';
import { FlashList } from '@shopify/flash-list';

export default function Index() {
  const { api, url } = useHBStore();

  const query = api?.useQuery('get', '/v1/items');

  if (!api) {
    // redirect to login
    return <Redirect href="/login" />;
  }

  return (
    <View className="flex-1">
      <Button
        title="Logout"
        onPress={async () => await useHBStore.getState().logout()}
      />
      {query?.data ? (
        <View className="w-full flex-grow">
          <FlashList
            refreshControl={
              <RefreshControl
                refreshing={query.isFetching}
                onRefresh={query.refetch}
              />
            }
            data={query.data.items}
            renderItem={({ item }) => (
              <View className="border w-max m-2 rounded p-2">
                <Text className="font-bold text-lg">{item.name} - {item.location?.name}</Text>
                {item.imageId && (
                  <Image
                    source={{
                      uri: `${url}/v1/items/${item.id}/attachments/${item.imageId}?access_token=${
                        useHBStore.getState().accessToken?.token
                      }`,
                    }}
                    className="w-full h-64"
                  />
                )}
                <Text className="text-sm">{item.description}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id as string}
            extraData={true}
          />
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}
