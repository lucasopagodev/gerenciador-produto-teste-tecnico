import { Badge, Flex, Heading, Text } from '@radix-ui/themes';
import { AppCard } from '../ui/AppCard.jsx';

export function PageHeader({ badge, title, description, actions }) {
  return (
    <AppCard className="overflow-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <Flex direction="column" gap="3">
          {badge ? (
            <Badge color="gray" variant="soft" className="w-fit">
              {badge}
            </Badge>
          ) : null}
          <div>
            <Heading size="7">{title}</Heading>
            {description ? (
              <Text as="p" className="mt-2 max-w-2xl leading-6 text-slate-600">
                {description}
              </Text>
            ) : null}
          </div>
        </Flex>

        {actions ? <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[340px]">{actions}</div> : null}
      </div>
    </AppCard>
  );
}
