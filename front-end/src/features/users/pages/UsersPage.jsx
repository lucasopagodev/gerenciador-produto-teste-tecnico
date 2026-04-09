import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge, Table, Text } from '@radix-ui/themes';
import { AppButton } from '../../../components/ui/AppButton.jsx';
import { AppCard } from '../../../components/ui/AppCard.jsx';
import { AppSelect } from '../../../components/ui/AppSelect.jsx';
import { FormErrorMessage } from '../../../components/shared/FormErrorMessage.jsx';
import { PageHeader } from '../../../components/shared/PageHeader.jsx';
import { PageLoader } from '../../../components/shared/PageLoader.jsx';
import { SuccessMessage } from '../../../components/shared/SuccessMessage.jsx';
import { ROLE_LABELS, ROLES } from '../../../lib/constants.js';
import { getApiErrorMessage } from '../../../lib/errors.js';
import { getUsers, updateUserRole } from '../../../services/authService.js';
import { useAuthStore } from '../../../store/authStore.js';

const roleOptions = [
  { label: ROLE_LABELS[ROLES.user], value: ROLES.user },
  { label: ROLE_LABELS[ROLES.manager], value: ROLES.manager },
];

export function UsersPage() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const [draftRoles, setDraftRoles] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  useEffect(() => {
    if (!usersQuery.data) {
      return;
    }

    setDraftRoles(
      usersQuery.data.reduce((accumulator, user) => {
        accumulator[user.id] = user.role;
        return accumulator;
      }, {}),
    );
  }, [usersQuery.data]);

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => updateUserRole(userId, { role }),
    onSuccess: async (_, variables) => {
      setFeedbackMessage('');
      setSuccessMessage('Perfil atualizado com sucesso.');
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      setDraftRoles((current) => ({
        ...current,
        [variables.userId]: variables.role,
      }));
    },
    onError: (error) => {
      setSuccessMessage('');
      setFeedbackMessage(getApiErrorMessage(error, 'Não foi possível atualizar o perfil do usuário.'));
    },
  });

  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);

  if (usersQuery.isLoading) {
    return <PageLoader label="Carregando usuários..." />;
  }

  if (usersQuery.isError) {
    return <FormErrorMessage message={getApiErrorMessage(usersQuery.error, 'Não foi possível carregar os usuários.')} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Gestão de usuários"
        title="Gerencie os perfis de acesso"
        description="Somente gestores podem promover usuários para o perfil de gestor dentro da aplicação."
      />

      <SuccessMessage message={successMessage} />
      {feedbackMessage ? <FormErrorMessage message={feedbackMessage} /> : null}

      <AppCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Nome</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>E-mail</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Perfil atual</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Novo perfil</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Ações</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {users.map((user) => {
                const selectedRole = draftRoles[user.id] ?? user.role;
                const isCurrentUser = currentUser?.id === user.id;
                const hasChanges = selectedRole !== user.role;
                const isPending = updateRoleMutation.isPending && updateRoleMutation.variables?.userId === user.id;

                return (
                  <Table.Row key={user.id}>
                    <Table.RowHeaderCell>
                      <div className="min-w-[180px]">
                        <Text as="p" weight="medium">
                          {user.fullName}
                        </Text>
                        {isCurrentUser ? (
                          <Text as="p" size="1" className="mt-1 text-slate-500">
                            Sessão atual
                          </Text>
                        ) : null}
                      </div>
                    </Table.RowHeaderCell>
                    <Table.Cell>
                      <Text className="min-w-[220px] text-slate-600">{user.email}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color="gray">{ROLE_LABELS[user.role] ?? user.role}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="min-w-[150px]">
                        <AppSelect
                          disabled={isCurrentUser}
                          options={roleOptions}
                          value={selectedRole}
                          onValueChange={(value) =>
                            setDraftRoles((current) => ({
                              ...current,
                              [user.id]: value,
                            }))
                          }
                        />
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex min-w-[170px] flex-col gap-2">
                        <AppButton
                          className="!justify-center"
                          disabled={!hasChanges || isCurrentUser}
                          loading={isPending}
                          onClick={() => {
                            setFeedbackMessage('');
                            setSuccessMessage('');
                            updateRoleMutation.mutate({
                              userId: user.id,
                              role: selectedRole,
                            });
                          }}
                        >
                          {isPending ? 'Salvando...' : 'Salvar'}
                        </AppButton>

                        {isCurrentUser ? (
                          <Text as="p" size="1" className="text-slate-500">
                            Você não pode alterar o próprio perfil.
                          </Text>
                        ) : null}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </div>
      </AppCard>
    </div>
  );
}
