
import { useQuery } from '@tanstack/react-query';
import { CategoryService } from '@/services/categoryService';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryService.getCategories(),
  });
};
