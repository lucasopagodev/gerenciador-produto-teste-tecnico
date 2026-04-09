import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../services/productService.js';

export function useProductQuery(productId, sessionKey) {
  return useQuery({
    queryKey: ['product', sessionKey, productId],
    queryFn: () => getProductById(productId),
    enabled: Boolean(productId && sessionKey),
  });
}
