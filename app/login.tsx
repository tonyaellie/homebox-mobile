import { Button, Text, TextInput, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useHBStore } from '../store';
import { Redirect } from 'expo-router';

export default function Login() {
  const { api } = useHBStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');

  if (!api) {
    return (
      <View className="m-2 gap-2">
        <Text className="text-center text-xl text-red-600">
          This is for testing, your details will not be securely stored, DO NOT
          USE IN PRODUCTION also it wont tell you if you get your details wrong
        </Text>
        <Text className="font-bold">Username</Text>
        <TextInput
          className="h-10 border p-2"
          value={username}
          onChangeText={setUsername}
        />
        <Text className="font-bold">Password</Text>
        <TextInput
          className="h-10 border p-2"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <Text className="font-bold">URL (e.g. http://[ip]:3000/api)</Text>
        <TextInput
          className="h-10 border p-2"
          value={url}
          onChangeText={setUrl}
        />
        <Button
          title="Login"
          onPress={async () => {
            await useHBStore.getState().login(username, password, url);
          }}
        />
      </View>
    );
  }

  return <Redirect href="/" />;
}
