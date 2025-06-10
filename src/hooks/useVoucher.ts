
import { useQuery } from '@tanstack/react-query';
import { VoucherService } from '@/services/voucherService';

export const useVoucher = (code: string) => {
  return useQuery({
    queryKey: ['voucher', code],
    queryFn: () => VoucherService.getVoucher(code),
    enabled: !!code && code.length > 0,
  });
};
