import { Flex, Spinner, Text } from '@radix-ui/themes';
import { AppCard } from '../ui/AppCard.jsx';

export function PageLoader({ label = 'Carregando...' }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <AppCard className="rounded-xl px-5 py-3">
        <Flex align="center" gap="3">
          <Spinner />
          <Text size="2" weight="medium" className="text-slate-600">
            {label}
          </Text>
        </Flex>
      </AppCard>
    </div>
  );
}
