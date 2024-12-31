import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const token = import.meta.env.VITE_JWT_DEFAULT_TOKEN;

const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_API_BASE_URL + '/graphql',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
