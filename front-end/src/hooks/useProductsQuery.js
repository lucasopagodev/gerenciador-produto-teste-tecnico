import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/productService.js';

export function useProductsQuery(filters, sessionKey) {
  return useQuery({
    queryKey: ['products', sessionKey, filters],
    queryFn: () => getProducts(filters),
    enabled: Boolean(sessionKey),
  });
}
