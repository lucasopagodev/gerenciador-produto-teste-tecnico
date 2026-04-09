import { Flex, Heading, Text } from '@radix-ui/themes';
import { AppCard } from '../ui/AppCard.jsx';

export function EmptyState({ title, description, action }) {
  return (
    <AppCard className="px-6 py-10">
      <Flex className="min-h-[240px]" direction="column" align="center" justify="center" gap="4">
        <Flex direction="column" align="center" gap="2">
          <Heading align="center" size="5">
            {title}
          </Heading>
          <Text as="p" align="center" className="mx-auto max-w-md leading-6 text-slate-600">
            {description}
          </Text>
        </Flex>
        {action ? <div className="mt-2">{action}</div> : null}
      </Flex>
    </AppCard>
  );
}
