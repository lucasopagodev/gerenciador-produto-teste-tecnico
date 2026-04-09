import { Heading, Text } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { AppButton } from '../../../components/ui/AppButton.jsx';
import { AppCard } from '../../../components/ui/AppCard.jsx';

export function NotFoundPage() {
  return (
    <div className="app-shell">
      <div className="app-container flex min-h-screen items-center justify-center py-10">
        <AppCard className="w-full max-w-xl px-8 py-10 text-center">
          <Text as="p" size="2" weight="bold" className="uppercase tracking-[0.18em] text-slate-500">
            404
          </Text>
          <Heading className="mt-3" size="7">
            Página não encontrada
          </Heading>
          <Text as="p" className="mt-4 leading-6 text-slate-600">
            A rota informada não existe ou você não tem acesso a ela no momento.
          </Text>
          <div className="mt-8">
            <AppButton asChild>
              <Link to="/">Voltar ao dashboard</Link>
            </AppButton>
          </div>
        </AppCard>
      </div>
    </div>
  );
}
