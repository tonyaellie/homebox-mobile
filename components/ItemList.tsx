import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import type Api from '../api';

// TODO: switch to flashlist for better performance

export const ItemList = ({
  items,
  isFetching,
  refetch,
  url,
  token,
}: {
  items: Api.components['schemas']['repo.ItemSummary'][];
  isFetching: boolean;
  refetch: () => void;
  url: string;
  token: string;
}) => {
  return (
    <View className="w-full flex-grow">
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        data={items}
        renderItem={({ item }) => (
          <Link href={`/item/${item.id}`} asChild>
            <Pressable className="border w-max m-2 rounded p-2 gap-2">
              <View className="flex flex-row items-center gap-2">
                <Text className="font-bold text-lg">{item.name}</Text>
                <View className="rounded-full bg-pink-500 px-2 h-6 min-w-6 flex items-center justify-center">
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
                    uri: `${url}/v1/items/${item.id}/attachments/${item.imageId}?access_token=${token}`,
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
  );
};
