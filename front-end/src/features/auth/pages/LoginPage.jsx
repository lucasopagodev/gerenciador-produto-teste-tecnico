import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppButton } from '../../../components/ui/AppButton.jsx';
import { AppInput } from '../../../components/ui/AppInput.jsx';
import { Field } from '../../../components/ui/Field.jsx';
import { FormErrorMessage } from '../../../components/shared/FormErrorMessage.jsx';
import { getApiErrorMessage } from '../../../lib/errors.js';
import { login } from '../../../services/authService.js';
import { useAuthStore } from '../../../store/authStore.js';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(location.state?.message ?? '');

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data);
      navigate(location.state?.from ?? '/', { replace: true });
    },
    onError: (error) => {
      setErrorMessage(getApiErrorMessage(error, 'Não foi possível fazer login.'));
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

  function validateForm() {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = 'O e-mail é obrigatório.';
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'A senha é obrigatória.';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    mutation.mutate(formData);
  }

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Entrar</h2>
      <p className="text-sm leading-6 text-slate-500">Use seu e-mail e sua senha para acessar sua conta.</p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <Field label="E-mail" error={fieldErrors.email} required>
          <AppInput
            error={fieldErrors.email}
            name="email"
            type="email"
            placeholder="nome@empresa.com"
            value={formData.email}
            onChange={handleChange}
          />
        </Field>

        <Field label="Senha" error={fieldErrors.password} required>
          <AppInput
            error={fieldErrors.password}
            name="password"
            type="password"
            placeholder="Sua senha"
            value={formData.password}
            onChange={handleChange}
          />
        </Field>

        <FormErrorMessage message={errorMessage} />

        <AppButton className="!mt-2 !w-full !justify-center" loading={mutation.isPending}>
          {mutation.isPending ? 'Entrando...' : 'Entrar'}
        </AppButton>
      </form>
    </div>
  );
}
