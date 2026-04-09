import { Dialog } from '@radix-ui/themes';

export function AppDialogContent({ children, className = '', ...props }) {
  return (
    <Dialog.Content
      className={`!w-[calc(100vw-1.5rem)] sm:!w-[calc(100vw-2rem)] !max-w-3xl !p-5 sm:!p-6 ${className}`.trim()}
      {...props}
    >
      {children}
    </Dialog.Content>
  );
}
