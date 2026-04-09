import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Theme } from '@radix-ui/themes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export function AppProviders({ children }) {
  return (
    <Theme appearance="light" accentColor="gray" grayColor="slate" radius="medium" scaling="100%">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Theme>
  );
}

export { queryClient };
