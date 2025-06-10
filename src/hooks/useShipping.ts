
import { useQuery } from '@tanstack/react-query';
import { ShippingService } from '@/services/shippingService';

export const useShippings = () => {
  return useQuery({
    queryKey: ['shippings'],
    queryFn: () => ShippingService.getShippings(),
  });
};
