
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BlogService } from '@/services/blogService';
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

export const useBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: () => BlogService.getBlogs(),
  });
};

export const useBlog = (id: string) => {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: () => BlogService.getBlog(id),
    enabled: !!id,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (formData: FormData) => BlogService.createBlog(formData),
    onSuccess: () => {
      toast({
        title: "Blog Berhasil Ditambahkan",
        description: "Blog baru telah berhasil ditambahkan",
        className: "bg-green-50 border-green-200 text-green-800",
      });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error, "Terjadi kesalahan saat menambahkan blog");
      toast({
        title: "Gagal Menambahkan Blog",
        description: errorMessage,
        className: "bg-red-50 border-red-200 text-red-800",
      });
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => 
      BlogService.updateBlog(id, formData),
    onSuccess: () => {
      toast({
        title: "Blog Berhasil Diperbarui",
        description: "Data blog telah berhasil diperbarui",
        className: "bg-green-50 border-green-200 text-green-800",
      });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error, "Terjadi kesalahan saat memperbarui blog");
      toast({
        title: "Gagal Memperbarui Blog",
        description: errorMessage,
        className: "bg-red-50 border-red-200 text-red-800",
      });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: string) => BlogService.deleteBlog(id),
    onSuccess: () => {
      toast({
        title: "Blog Berhasil Dihapus",
        description: "Blog telah berhasil dihapus",
        className: "bg-green-50 border-green-200 text-green-800",
      });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error, "Terjadi kesalahan saat menghapus blog");
      toast({
        title: "Gagal Menghapus Blog",
        description: errorMessage,
        className: "bg-red-50 border-red-200 text-red-800",
      });
    },
  });
};
