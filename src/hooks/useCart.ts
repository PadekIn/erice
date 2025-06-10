
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CartService } from '@/services/cartService';
import { useToast } from '@/hooks/use-toast';

const getErrorMessage = (error: any, fallbackMessage: string) => {
  // Check if error has errors array with messages
  if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors.map((err: any) => err.message || err).join(', ');
  }
  
  // Check response data for errors array
  if (error?.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
    return error.response.data.errors.map((err: any) => err.message || err).join(', ');
  }
  
  // Fallback to regular message
  return error?.response?.data?.message || error.message || fallbackMessage;
};

export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => CartService.getCart(),
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ productId, qty }: { productId: string; qty: number }) =>
      CartService.addToCart(productId, qty),
    onSuccess: (response) => {
      if (response.status) {
        toast({
          title: "Produk Ditambahkan",
          description: "Produk berhasil ditambahkan ke keranjang",
          className: "bg-green-50 border-green-200 text-green-800",
        });
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error, "Terjadi kesalahan saat menambahkan produk ke keranjang");
      toast({
        title: "Gagal Menambahkan Produk",
        description: errorMessage,
        className: "bg-red-50 border-red-200 text-red-800",
      });
    },
  });
};

export const useIncrementCartItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: string) => CartService.incrementItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error, "Terjadi kesalahan saat mengupdate keranjang");
      toast({
        title: "Gagal Mengupdate Keranjang",
        description: errorMessage,
        className: "bg-red-50 border-red-200 text-red-800",
      });
    },
  });
};

export const useDecrementCartItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: string) => CartService.decrementItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error, "Terjadi kesalahan saat mengupdate keranjang");
      toast({
        title: "Gagal Mengupdate Keranjang",
        description: errorMessage,
        className: "bg-red-50 border-red-200 text-red-800",
      });
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: string) => CartService.removeItem(id),
    onSuccess: () => {
      toast({
        title: "Produk Dihapus",
        description: "Produk berhasil dihapus dari keranjang",
        className: "bg-green-50 border-green-200 text-green-800",
      });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error, "Terjadi kesalahan saat menghapus produk dari keranjang");
      toast({
        title: "Gagal Menghapus Produk",
        description: errorMessage,
        className: "bg-red-50 border-red-200 text-red-800",
      });
    },
  });
};
