import { TextArea } from '@radix-ui/themes';

export function AppTextArea({ className = '', error = '', ...props }) {
  return <TextArea color={error ? 'red' : undefined} size="3" className={`!w-full ${className}`.trim()} {...props} />;
}
