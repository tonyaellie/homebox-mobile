import {
  Link,
  Redirect,
  Stack,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useHBStore } from '../../store';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MapPin } from 'lucide-react-native';

dayjs.extend(relativeTime);

const Separator = () => <View className="h-1 bg-gray-300 w-full" />;

const formatCurrency = (
  value: number | string,
  currency = 'USD',
  locale = 'en-Us'
) => {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(value);
};

const useFormatCurrency = () => {
  const api = useHBStore((state) => state.api)!;
  const { data } = api.useQuery('get', '/v1/groups');

  const currency = data?.currency;

  return (value: number | string) => formatCurrency(value, currency);
};

export default function Item() {
  const { api, url, accessToken } = useHBStore();
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const format = useFormatCurrency();

  if (!api) {
    return <Redirect href="/login" />;
  }

  const query = api.useQuery('get', `/v1/items/{id}`, {
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

  if (!item) {
    return (
      <View>
        <Stack.Screen
          options={{
            title: (name || 'Loading Item...') as string,
          }}
        />
      </View>
    );
  }

  return (
    <ScrollView>
      <Stack.Screen
        options={{
          title: (name || 'Loading...') as string,
        }}
      />
      <View>
        <Text>
          Created {dayjs(item.createdAt).fromNow()} (
          {dayjs(item.createdAt).format('YYYY-MM-DD')})
        </Text>
        <Text>
          Updated {dayjs(item.updatedAt).fromNow()} (
          {dayjs(item.updatedAt).format('YYYY-MM-DD')})
        </Text>
        <Link href={`/location/${item.location?.id}`} asChild>
          <Pressable className="flex flex-row items-center border rounded p-1 gap-1">
            <MapPin size={16} color="black" />
            <Text>{item.location?.name}</Text>
          </Pressable>
        </Link>
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
        <Text>{item.description}</Text>
      </View>
      <Separator />
      <View>
        <Text>Details</Text>
        <View>
          <Text>Quantity</Text>
          <Text>{item.quantity}</Text>
        </View>
        <View>
          <Text>Serial Number</Text>
          <Text>{item.serialNumber}</Text>
        </View>
        <View>
          <Text>Serial Number</Text>
          <Text>{item.serialNumber}</Text>
        </View>
        <View>
          <Text>Manufacturer</Text>
          <Text>{item.manufacturer}</Text>
        </View>
        <View>
          <Text>Insured</Text>
          <Text>{item.insured ? 'Yes' : 'No'}</Text>
        </View>
        <View>
          <Text>Archived</Text>
          <Text>{item.archived ? 'Yes' : 'No'}</Text>
        </View>
        <View>
          <Text>Notes</Text>
          <Text>{item.notes}</Text>
        </View>
        <View>
          <Text>Asset Id</Text>
          <Text>{item.assetId}</Text>
        </View>
      </View>
      <Separator />
      <View>
        <Text>Photos</Text>
        {item?.attachments
          ?.filter((attachment) => attachment.type === 'photo')
          .map((attachment) => (
            <Image
              key={attachment.id}
              source={{
                uri: `${url}/v1/items/${item.id}/attachments/${attachment.id}?access_token=${accessToken?.token}`,
              }}
              className="w-full h-64"
            />
          ))}
      </View>
      <Separator />
      <View>
        <Text>Purchase Details</Text>
        <View>
          <Text>Purchased From</Text>
          <Text>{item.purchaseFrom}</Text>
        </View>
        <View>
          <Text>Purchase Price</Text>
          <Text>{item.purchasePrice && format(item.purchasePrice)}</Text>
        </View>
        <View>
          <Text>Purchase Date</Text>
          <Text>{item.purchaseTime}</Text>
        </View>
      </View>
      <Separator />
      <View>
        <Text>Warranty Details</Text>
        <View>
          <Text>Lifetime Warranty</Text>
          <Text>{item.lifetimeWarranty ? 'Yes' : 'No'}</Text>
        </View>
        <View>
          <Text>Warranty Expires</Text>
          <Text>{item.warrantyExpires}</Text>
        </View>
        <View>
          <Text>Warranty Details</Text>
          <Text>{item.warrantyDetails}</Text>
        </View>
      </View>
      <Separator />
      <View>
        <Text>Sold Details</Text>
        <View>
          <Text>Sold To</Text>
          <Text>{item.soldTo}</Text>
        </View>
        <View>
          <Text>Sold Price</Text>
          <Text>{item.soldPrice && format(item.soldPrice)}</Text>
        </View>
        <View>
          <Text>Sold At</Text>
          <Text>{item.soldTime}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
