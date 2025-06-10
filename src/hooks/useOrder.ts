
import { useMutation } from '@tanstack/react-query';
import { OrderService, CreateOrderRequest } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';

export const useCreateOrder = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (orderData: CreateOrderRequest) => OrderService.createOrder(orderData),
    onError: (error: any) => {
      toast({
        title: "Gagal Membuat Pesanan",
        description: error.message || "Terjadi kesalahan saat membuat pesanan",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    },
  });
};
