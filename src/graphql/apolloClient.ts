import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const token = import.meta.env.VITE_JWT_DEFAULT_TOKEN;

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:3000/graphql',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
