export const ROLES = {
  manager: 'Manager',
  user: 'User',
};

export const ROLE_LABELS = {
  [ROLES.manager]: 'Gestor',
  [ROLES.user]: 'Usuário',
};

export const SORT_BY_OPTIONS = [
  { label: 'Data de criação', value: 'createdAt' },
  { label: 'Preço', value: 'price' },
];

export const SORT_DIRECTION_OPTIONS = [
  { label: 'Mais recentes / maiores', value: 'desc' },
  { label: 'Mais antigos / menores', value: 'asc' },
];
