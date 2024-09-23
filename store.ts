import { create } from 'zustand';
import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';
import type Api from './api';
import type { OpenapiQueryClient } from 'openapi-react-query';
import type { Middleware } from 'openapi-fetch';

import AsyncStorage from '@react-native-async-storage/async-storage';

const createHBClient = async (
  username: string,
  password: string,
  url: string
) => {
  await AsyncStorage.setItem('username', username);
  await AsyncStorage.setItem('password', password);
  await AsyncStorage.setItem('url', url);

  const fetchClient = createFetchClient<Api.paths>({
    baseUrl: url,
  });

  const authMiddleware: Middleware = {
    async onRequest({ request }) {
      if (request.url.includes('login')) {
        return;
      }
      const { accessToken } = useHBStore.getState();
      if (!accessToken) {
        const { data, error } = await fetchClient.POST('/v1/users/login', {
          body: {
            username,
            password,
          },
        });

        if (error) {
          throw new Error('Failed to login!');
        }

        useHBStore.setState({
          accessToken: {
            token: data.token!,
            attachmentToken: data.attachmentToken!,
          },
        });
      }

      request.headers.set(
        'Authorization',
        `${useHBStore.getState().accessToken!.token}`
      );

      return request;
    },
  };

  fetchClient.use(authMiddleware);

  const api = createClient(fetchClient);
  return api;
};

type State = {
  api: OpenapiQueryClient<Api.paths> | null;
  accessToken: null | {
    token: string;
    attachmentToken: string;
  };
  url: string | null;
  load: () => Promise<void>;
  login: (username: string, password: string, url: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useHBStore = create<State>((set) => ({
  api: null,
  accessToken: null,
  url: null,
  load: async () => {
    const username = await AsyncStorage.getItem('username');
    const password = await AsyncStorage.getItem('password');
    const url = await AsyncStorage.getItem('url');
    if (username && password && url) {
      await useHBStore.getState().login(username, password, url);
    }
  },
  login: async (username: string, password: string, url: string) => {
    set({
      api: await createHBClient(username, password, url),
      url,
    });
  },
  logout: async () => {
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('password');
    await AsyncStorage.removeItem('url');
    set({
      api: null,
      accessToken: null,
    });
  },
}));
