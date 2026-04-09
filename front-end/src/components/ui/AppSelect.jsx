import { Select } from '@radix-ui/themes';

export function AppSelect({ className = '', disabled = false, error = '', options, placeholder, value, onValueChange }) {
  const color = error ? 'red' : 'green';

  return (
    <Select.Root disabled={disabled} size="3" value={value} onValueChange={onValueChange}>
      <Select.Trigger className={`!w-full ${className}`.trim()} color={color} placeholder={placeholder} />
      <Select.Content color={color} position="popper">
        {options.map((option) => (
          <Select.Item key={option.value} value={option.value}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
