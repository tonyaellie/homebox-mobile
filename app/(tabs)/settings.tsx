import { Button, Text, View } from 'react-native';
import { useHBStore } from '../../store';
import { Redirect, router } from 'expo-router';
import { ItemList } from '../../components/ItemList';

export default function Index() {
  const { api, url } = useHBStore();

  if (!api) {
    return <Redirect href="/login" />;
  }

  return (
    <View className="flex-1">
      <Text>Hi</Text>
    </View>
  );
}
