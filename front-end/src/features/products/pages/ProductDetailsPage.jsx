import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '@radix-ui/themes';
import { AppCard } from '../../../components/ui/AppCard.jsx';
import { PageLoader } from '../../../components/shared/PageLoader.jsx';
import { FormErrorMessage } from '../../../components/shared/FormErrorMessage.jsx';
import { defaultProductImageUrl, formatCurrency, formatDateTime, resolveProductDisplayImageUrl } from '../../../lib/formatters.js';
import { getApiErrorMessage } from '../../../lib/errors.js';
import { useProductQuery } from '../../../hooks/useProductQuery.js';
import { useAuthStore } from '../../../store/authStore.js';

export function ProductDetailsPage() {
  const { productId } = useParams();
  const user = useAuthStore((state) => state.user);
  const sessionKey = user ? `${user.id}:${user.role}` : null;
  const productQuery = useProductQuery(productId, sessionKey);
  const product = productQuery.data;
  const [imageSrc, setImageSrc] = useState(() => resolveProductDisplayImageUrl(product));

  useEffect(() => {
    setImageSrc(resolveProductDisplayImageUrl(product));
  }, [product]);

  if (productQuery.isLoading) {
    return <PageLoader label="Carregando detalhes do produto..." />;
  }

  if (productQuery.isError) {
    return (
      <div className="space-y-4">
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-slate-700" to="/">
          <ArrowLeftIcon />
          Voltar para o dashboard
        </Link>
        <FormErrorMessage message={getApiErrorMessage(productQuery.error, 'Não foi possível carregar o produto.')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-slate-700" to="/">
        <ArrowLeftIcon />
        Voltar para o dashboard
      </Link>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <AppCard className="overflow-hidden p-0">
          <div className="h-64 bg-slate-100 sm:h-80 lg:h-[360px]">
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
        </AppCard>

        <AppCard className="flex flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="space-y-3">
            <Badge color="gray" size="2">
              {formatCurrency(product.price)}
            </Badge>
            <div>
              <h1 className="section-title">{product.name}</h1>
              <p className="section-copy mt-3">{product.description || 'Sem descrição cadastrada para este produto.'}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 px-4 py-4 shadow-[0_8px_22px_-18px_rgba(15,23,42,0.14)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Criado em</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{formatDateTime(product.createdAt)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-4 shadow-[0_8px_22px_-18px_rgba(15,23,42,0.14)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Atualizado em</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{formatDateTime(product.updatedAt)}</p>
            </div>
          </div>
        </AppCard>
      </section>
    </div>
  );
}
