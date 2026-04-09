import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from '@radix-ui/react-icons';
import { AppButton } from '../../../components/ui/AppButton.jsx';
import { EmptyState } from '../../../components/shared/EmptyState.jsx';
import { FormErrorMessage } from '../../../components/shared/FormErrorMessage.jsx';
import { PageLoader } from '../../../components/shared/PageLoader.jsx';
import { PageHeader } from '../../../components/shared/PageHeader.jsx';
import { SuccessMessage } from '../../../components/shared/SuccessMessage.jsx';
import { ROLES } from '../../../lib/constants.js';
import { getApiErrorMessage } from '../../../lib/errors.js';
import { deleteProduct } from '../../../services/productService.js';
import { useAuthStore } from '../../../store/authStore.js';
import { useProductsQuery } from '../../../hooks/useProductsQuery.js';
import { DeleteProductDialog } from '../components/DeleteProductDialog.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { ProductFormDialog } from '../components/ProductFormDialog.jsx';
import { SortControls } from '../components/SortControls.jsx';

export function DashboardPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isManager = user?.role === ROLES.manager;
  const sessionKey = user ? `${user.id}:${user.role}` : null;

  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const productsQuery = useProductsQuery({ sortBy, sortDirection }, sessionKey);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: async () => {
      setDeleteError('');
      setSuccessMessage('Produto excluído com sucesso.');
      setProductToDelete(null);
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      setDeleteError(getApiErrorMessage(error, 'Não foi possível excluir o produto.'));
    },
  });

  function handleCreate() {
    setSuccessMessage('');
    setFormMode('create');
    setSelectedProduct(null);
    setFormOpen(true);
  }

  function handleEdit(product) {
    setSuccessMessage('');
    setFormMode('edit');
    setSelectedProduct(product);
    setFormOpen(true);
  }

  if (productsQuery.isLoading) {
    return <PageLoader label="Carregando produtos..." />;
  }

  if (productsQuery.isError) {
    return (
      <FormErrorMessage
        message={getApiErrorMessage(productsQuery.error, 'Não foi possível carregar os produtos.')}
      />
    );
  }

  const products = productsQuery.data ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        badge={isManager ? 'Painel do gestor' : 'Catálogo disponível'}
        title={isManager ? 'Gerencie seus produtos' : 'Explore os produtos disponíveis'}
        description={
          isManager
            ? 'Cadastre, edite e exclua produtos com imagens, preços e informações sempre atualizadas.'
            : 'Consulte os produtos cadastrados, organize a visualização por preço ou data e acompanhe os detalhes.'
        }
        actions={
          <>
            <SortControls
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSortByChange={setSortBy}
              onSortDirectionChange={setSortDirection}
            />
            {isManager ? (
              <AppButton className="!w-full !justify-center lg:!w-auto" onClick={handleCreate}>
                <PlusIcon />
                Novo produto
              </AppButton>
            ) : null}
          </>
        }
      />

      <SuccessMessage message={successMessage} />
      {deleteError ? <FormErrorMessage message={deleteError} /> : null}

      {products.length === 0 ? (
        <EmptyState
          title={isManager ? 'Nenhum produto encontrado' : 'Nenhum produto disponível'}
          description={
            isManager
              ? 'Cadastre seu primeiro produto para começar a organizar o catálogo.'
              : 'Assim que um gestor cadastrar produtos, eles aparecerão aqui para consulta.'
          }
          action={isManager ? <AppButton onClick={handleCreate}>Cadastrar produto</AppButton> : null}
        />
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isManager={isManager}
              onEdit={handleEdit}
              onDelete={setProductToDelete}
            />
          ))}
        </section>
      )}

      <ProductFormDialog
        open={formOpen}
        mode={formMode}
        product={selectedProduct}
        onOpenChange={setFormOpen}
        onSaved={(savedMode) => {
          setDeleteError('');
          setSuccessMessage(savedMode === 'edit' ? 'Produto atualizado com sucesso.' : 'Produto criado com sucesso.');
        }}
      />

      <DeleteProductDialog
        open={Boolean(productToDelete)}
        product={productToDelete}
        pending={deleteMutation.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setProductToDelete(null);
            setDeleteError('');
          }
        }}
        onConfirm={() => deleteMutation.mutate(productToDelete.id)}
      />
    </div>
  );
}
