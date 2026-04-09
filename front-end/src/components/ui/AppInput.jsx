import { TextField } from '@radix-ui/themes';

export function AppInput({ className = '', error = '', ...props }) {
  return <TextField.Root color={error ? 'red' : undefined} size="3" className={`!w-full ${className}`.trim()} {...props} />;
}
