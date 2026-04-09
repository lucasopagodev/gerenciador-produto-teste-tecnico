import { Button } from '@radix-ui/themes';

const toneMap = {
  primary: { color: 'green', variant: 'solid' },
  secondary: { color: 'green', variant: 'soft' },
  danger: { color: 'red', variant: 'solid' },
  dangerSoft: { color: 'red', variant: 'soft' },
  success: { color: 'green', variant: 'soft' },
  warning: { color: 'amber', variant: 'soft' },
};

export function AppButton({
  children,
  className = '',
  color,
  disabled = false,
  loading = false,
  tone = 'primary',
  variant,
  ...props
}) {
  const resolvedTone = toneMap[tone] ?? toneMap.primary;

  return (
    <Button
      color={color ?? resolvedTone.color}
      className={`!h-11 !cursor-pointer !rounded-xl !px-4 !font-medium ${className}`}
      disabled={disabled || loading}
      variant={variant ?? resolvedTone.variant}
      {...props}
    >
      {children}
    </Button>
  );
}
