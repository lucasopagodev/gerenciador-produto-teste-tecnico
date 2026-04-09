import { useEffect, useState } from 'react';
import { Badge } from '@radix-ui/themes';
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import { AppButton } from '../../../components/ui/AppButton.jsx';
import { AppCard } from '../../../components/ui/AppCard.jsx';
import { defaultProductImageUrl, formatCurrency, formatDateTime, resolveProductDisplayImageUrl } from '../../../lib/formatters.js';

export function ProductCard({ product, isManager, onEdit, onDelete }) {
  const [imageSrc, setImageSrc] = useState(() => resolveProductDisplayImageUrl(product));

  useEffect(() => {
    setImageSrc(resolveProductDisplayImageUrl(product));
  }, [product]);

  return (
    <AppCard className="overflow-hidden p-0">
      <article>
        <Link className="block" to={`/products/${product.id}`}>
          <div className="h-52 bg-slate-100">
            <img
              className="h-full w-full object-cover"
              src={imageSrc}
              alt={product.name}
              onError={(event) => {
                if (event.currentTarget.src !== defaultProductImageUrl) {
                  setImageSrc(defaultProductImageUrl);
                }
              }}
            />
          </div>
        </Link>

        <div className="space-y-4 p-5">
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Link
                  className="text-lg font-semibold tracking-tight text-slate-950 hover:text-slate-700"
                  to={`/products/${product.id}`}
                >
                  {product.name}
                </Link>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {product.description || 'Sem descrição cadastrada.'}
                </p>
              </div>
              <Badge className="w-fit" color="gray">
                {formatCurrency(product.price)}
              </Badge>
            </div>

            <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
              <p>Criado em: {formatDateTime(product.createdAt)}</p>
              <p>Atualizado em: {formatDateTime(product.updatedAt)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link className="text-sm font-semibold text-slate-900 hover:text-slate-700" to={`/products/${product.id}`}>
              Ver detalhes
            </Link>

            {isManager ? (
              <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-end">
                <AppButton className="!justify-center" tone="secondary" onClick={() => onEdit(product)}>
                  <Pencil2Icon />
                  Editar
                </AppButton>
                <AppButton className="!justify-center" tone="dangerSoft" onClick={() => onDelete(product)}>
                  <TrashIcon />
                  Excluir
                </AppButton>
              </div>
            ) : null}
          </div>
        </div>
      </article>
    </AppCard>
  );
}
