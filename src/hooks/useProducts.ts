
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductService, ProductFilters } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

const getErrorMessage = (error: any, fallbackMessage: string) => {
  if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors.map((err: any) => err.message || err).join(', ');
  }
  
  if (error?.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
    return error.response.data.errors.map((err: any) => err.message || err).join(', ');
  }
  
  return error?.response?.data?.message || error.message || fallbackMessage;
};

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => ProductService.getProducts(filters),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => ProductService.getProduct(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (formData: FormData) => ProductService.createProduct(formData),
    onSuccess: () => {
      toast({
        title: "Produk Berhasil Ditambahkan",
        description: "Produk baru telah berhasil ditambahkan",
        className: "bg-green-50 border-green-200 text-green-800",
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error, "Terjadi kesalahan saat menambahkan produk");
      toast({
        title: "Gagal Menambahkan Produk",
        description: errorMessage,
        className: "bg-red-50 border-red-200 text-red-800",
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => 
      ProductService.updateProduct(id, formData),
    onSuccess: () => {
      toast({
        title: "Produk Berhasil Diperbarui",
        description: "Data produk telah berhasil diperbarui",
        className: "bg-green-50 border-green-200 text-green-800",
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error, "Terjadi kesalahan saat memperbarui produk");
      toast({
        title: "Gagal Memperbarui Produk",
        description: errorMessage,
        className: "bg-red-50 border-red-200 text-red-800",
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: string) => ProductService.deleteProduct(id),
    onSuccess: () => {
      toast({
        title: "Produk Berhasil Dihapus",
        description: "Produk telah berhasil dihapus",
        className: "bg-green-50 border-green-200 text-green-800",
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error, "Terjadi kesalahan saat menghapus produk");
      toast({
        title: "Gagal Menghapus Produk",
        description: errorMessage,
        className: "bg-red-50 border-red-200 text-red-800",
      });
    },
  });
};
