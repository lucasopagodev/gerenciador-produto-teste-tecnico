import { AlertDialog } from '@radix-ui/themes';
import { AppButton } from '../../../components/ui/AppButton.jsx';

export function DeleteProductDialog({ open, product, pending, onOpenChange, onConfirm }) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Content className="!w-[calc(100vw-1.5rem)] sm:!w-[calc(100vw-2rem)] !max-w-md !p-5 sm:!p-6">
        <AlertDialog.Title>Excluir produto</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Tem certeza de que deseja excluir <strong>{product?.name}</strong>? Essa ação não pode ser desfeita.
        </AlertDialog.Description>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <AlertDialog.Cancel asChild>
            <AppButton className="!w-full !justify-center sm:!w-auto" tone="secondary" type="button">
              Cancelar
            </AppButton>
          </AlertDialog.Cancel>
          <AppButton className="!w-full !justify-center sm:!w-auto" tone="danger" type="button" onClick={onConfirm}>
            {pending ? 'Excluindo...' : 'Excluir'}
          </AppButton>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
