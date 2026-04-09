import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AppButton } from '../../../components/ui/AppButton.jsx';
import { AppInput } from '../../../components/ui/AppInput.jsx';
import { Field } from '../../../components/ui/Field.jsx';
import { FormErrorMessage } from '../../../components/shared/FormErrorMessage.jsx';
import { getApiErrorMessage } from '../../../lib/errors.js';
import { register } from '../../../services/authService.js';
import { useAuthStore } from '../../../store/authStore.js';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setAuth(data);
      navigate('/', { replace: true });
    },
    onError: (error) => {
      setErrorMessage(getApiErrorMessage(error, 'Não foi possível concluir o cadastro.'));
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

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'O nome completo é obrigatório.';
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'O e-mail é obrigatório.';
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'A senha é obrigatória.';
    } else if (!passwordPattern.test(formData.password)) {
      nextErrors.password = 'A senha deve ter ao menos 8 caracteres, com letra maiúscula, minúscula, número e símbolo.';
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
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Criar conta</h2>
      <p className="text-sm leading-6 text-slate-500">Novos cadastros entram como usuário padrão e acessam o painel com segurança.</p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <Field label="Nome completo" error={fieldErrors.fullName} required>
          <AppInput
            error={fieldErrors.fullName}
            name="fullName"
            placeholder="Digite seu nome completo"
            value={formData.fullName}
            onChange={handleChange}
          />
        </Field>

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

        <Field
          label="Senha"
          error={fieldErrors.password}
          hint="Use ao menos 8 caracteres, com letra maiúscula, letra minúscula, número e símbolo."
          required
        >
          <AppInput
            error={fieldErrors.password}
            name="password"
            type="password"
            placeholder="Crie uma senha forte"
            value={formData.password}
            onChange={handleChange}
          />
        </Field>

        <FormErrorMessage message={errorMessage} />

        <AppButton className="!mt-2 !w-full !justify-center" loading={mutation.isPending}>
          {mutation.isPending ? 'Criando conta...' : 'Criar conta'}
        </AppButton>
      </form>
    </div>
  );
}
