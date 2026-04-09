import { Link, Outlet, useLocation } from 'react-router-dom';

export function AuthLayout() {
  const location = useLocation();
  const isRegisterPage = location.pathname === '/register';

  return (
    <div className="app-shell">
      <div className="w-full">
        <section className="auth-stage">
          <div className="auth-card">
            <div className="auth-pane">
              <div className="flex flex-1 items-center">
                <div className="mx-auto w-full max-w-md space-y-10 lg:max-w-[520px]">
                  <div className="space-y-6">
                    <div className="eyebrow">
                      Gerenciador de Produtos
                    </div>
                    <div className="space-y-3">
                      <h1 className="max-w-md text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                        Controle todos os seus produtos com facilidade e segurança.
                      </h1>
                      <p className="max-w-md text-sm leading-7 text-slate-500">
                        Acesse sua conta para acompanhar o catálogo, administrar produtos e operar com tranquilidade.
                      </p>
                    </div>
                  </div>

                  <div className="max-w-md">
                    <Outlet />
                  </div>

                  <div className="max-w-md pt-2 text-center text-sm text-slate-500">
                    {isRegisterPage ? (
                      <>
                        Já tem conta?{' '}
                        <Link className="font-semibold text-slate-900 hover:text-slate-700" to="/login">
                          Entrar
                        </Link>
                        .
                      </>
                    ) : (
                      <>
                        Ainda não tem conta?{' '}
                        <Link className="font-semibold text-slate-900 hover:text-slate-700" to="/register">
                          Criar conta
                        </Link>
                        .
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="auth-visual">
              <div className="relative flex h-full flex-col justify-between p-8 text-white">
                <div className="flex items-center justify-between text-sm font-medium text-white/90">
                  <span className="rounded-lg bg-white/10 px-3 py-1">Acesso seguro</span>
                  <span className="rounded-lg bg-white/10 px-3 py-1">Gestão centralizada</span>
                </div>

                <div className="max-w-md space-y-5">
                  <div className="h-4 w-4 rounded-full bg-white/80" />
                  <p className="text-4xl font-medium leading-tight">
                    Controle todos os seus produtos com facilidade e segurança.
                  </p>
                  <p className="text-sm leading-7 text-white/82">
                    Organize catálogo, imagens, preços e atualizações em uma interface objetiva, clara e pronta para o dia a dia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
