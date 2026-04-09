import { CheckCircledIcon } from '@radix-ui/react-icons';
import { Callout } from '@radix-ui/themes';

export function SuccessMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <Callout.Root color="gray" size="2" variant="soft">
      <Callout.Icon>
        <CheckCircledIcon />
      </Callout.Icon>
      <Callout.Text>{message}</Callout.Text>
    </Callout.Root>
  );
}
