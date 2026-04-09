import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Callout } from '@radix-ui/themes';

export function FormErrorMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <Callout.Root color="red" size="2" variant="soft">
      <Callout.Icon>
        <ExclamationTriangleIcon />
      </Callout.Icon>
      <Callout.Text>{message}</Callout.Text>
    </Callout.Root>
  );
}
