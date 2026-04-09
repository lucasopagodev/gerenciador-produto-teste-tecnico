import { Card } from '@radix-ui/themes';

export function AppCard({ children, className = '', ...props }) {
  return (
    <Card className={`panel ${className}`.trim()} {...props}>
      {children}
    </Card>
  );
}
