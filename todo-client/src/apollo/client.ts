import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";

const env = (import.meta as any).env ?? {};
const hasuraHttp = env.VITE_HASURA_HTTP;
const hasuraRole = env.VITE_HASURA_ROLE || "anonymous";
const hasuraAdminSecret = env.VITE_HASURA_ADMIN_SECRET;

const httpLink = new HttpLink({
  uri: hasuraHttp,
  headers: {
    "x-hasura-role": hasuraRole,
    ...(hasuraAdminSecret ? { "x-hasura-admin-secret": hasuraAdminSecret } : {}),
  },
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});