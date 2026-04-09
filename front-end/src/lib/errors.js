export function getApiErrorMessage(error, fallbackMessage = 'Não foi possível concluir a operação.') {
  return error?.response?.data?.message ?? fallbackMessage;
}
