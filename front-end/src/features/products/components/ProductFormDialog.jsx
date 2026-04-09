import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog } from '@radix-ui/themes';
import { AppButton } from '../../../components/ui/AppButton.jsx';
import { AppDialogContent } from '../../../components/ui/AppDialogContent.jsx';
import { AppInput } from '../../../components/ui/AppInput.jsx';
import { AppTextArea } from '../../../components/ui/AppTextArea.jsx';
import { Field } from '../../../components/ui/Field.jsx';
import { FormErrorMessage } from '../../../components/shared/FormErrorMessage.jsx';
import { getApiErrorMessage } from '../../../lib/errors.js';
import { resolveImageUrl } from '../../../lib/formatters.js';
import { createProduct, updateProduct, uploadProductImage } from '../../../services/productService.js';
import { ImageUploadInput } from './ImageUploadInput.jsx';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  imagePath: '',
};

export function ProductFormDialog({ open, mode, product, onOpenChange, onSaved }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const currentImageUrl = useMemo(() => resolveImageUrl(product), [product]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormData(
      product
        ? {
            name: product.name,
            description: product.description ?? '',
            price: String(product.price),
            imagePath: product.imagePath ?? '',
          }
        : emptyForm,
    );
    setSelectedFile(null);
    setPreviewUrl('');
    setFieldErrors({});
    setErrorMessage('');
  }, [open, product]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const mutation = useMutation({
    mutationFn: async () => {
      const normalizedName = formData.name.trim();
      const parsedPrice = Number(formData.price);

      let imagePath = formData.imagePath || null;
      if (selectedFile) {
        const uploadResponse = await uploadProductImage(selectedFile);
        imagePath = uploadResponse.imagePath;
      }

      const payload = {
        name: normalizedName,
        description: formData.description.trim() || null,
        price: parsedPrice,
        imagePath,
      };

      if (mode === 'edit' && product) {
        return updateProduct(product.id, payload);
      }

      return createProduct(payload);
    },
    onSuccess: async (savedProduct) => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['product', savedProduct.id] });
      if (typeof onSaved === 'function') {
        onSaved(mode);
      }
      onOpenChange(false);
    },
    onError: (error) => {
      setErrorMessage(getApiErrorMessage(error, 'Não foi possível salvar o produto.'));
    },
  });

  function handleChange(event) {
    setErrorMessage('');
    setFieldErrors((current) => ({
      ...current,
      [event.target.name]: '',
    }));
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function handleFileChange(file) {
    setErrorMessage('');
    setSelectedFile(file);

    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      return;
    }

    setPreviewUrl('');
  }

  function handleClearImage() {
    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl('');
    setFormData((current) => ({
      ...current,
      imagePath: '',
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextFieldErrors = {};
    const parsedPrice = Number(formData.price);

    if (!formData.name.trim()) {
      nextFieldErrors.name = 'O nome é obrigatório.';
    }

    if (!formData.price.trim()) {
      nextFieldErrors.price = 'O preço é obrigatório.';
    } else if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      nextFieldErrors.price = 'O preço deve ser maior que zero.';
    }

    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    mutation.mutate();
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AppDialogContent>
        <Dialog.Title>{mode === 'edit' ? 'Editar produto' : 'Cadastrar produto'}</Dialog.Title>
        <Dialog.Description size="2">
          Preencha os dados abaixo para {mode === 'edit' ? 'atualizar' : 'cadastrar'} o produto.
        </Dialog.Description>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nome" error={fieldErrors.name} required>
              <AppInput error={fieldErrors.name} name="name" placeholder="Digite o nome do produto" value={formData.name} onChange={handleChange} />
            </Field>

            <Field label="Preço" error={fieldErrors.price} required>
              <AppInput
                error={fieldErrors.price}
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0,00"
                value={formData.price}
                onChange={handleChange}
              />
            </Field>
          </div>

          <Field label="Descrição">
            <AppTextArea name="description" placeholder="Descreva o produto" value={formData.description} onChange={handleChange} />
          </Field>

          <ImageUploadInput
            previewUrl={previewUrl}
            currentImageUrl={currentImageUrl}
            onFileChange={handleFileChange}
            onClear={handleClearImage}
          />

          <FormErrorMessage message={errorMessage} />

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Dialog.Close asChild>
              <AppButton className="!w-full !justify-center sm:!w-auto" tone="secondary" type="button">
                Cancelar
              </AppButton>
            </Dialog.Close>
            <AppButton className="!w-full !justify-center sm:!w-auto" type="submit">
              {mutation.isPending ? 'Salvando...' : mode === 'edit' ? 'Salvar alterações' : 'Salvar produto'}
            </AppButton>
          </div>
        </form>
      </AppDialogContent>
    </Dialog.Root>
  );
}
