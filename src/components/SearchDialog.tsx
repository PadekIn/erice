
import { useState } from 'react';
import { Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useProducts } from '@/hooks/useProducts';
import { useNavigate } from 'react-router-dom';

const SearchDialog = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: productsData, isLoading } = useProducts();
  const products = productsData?.data || [];
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleProductSelect = (productId: string) => {
    setOpen(false);
    navigate(`/products/${productId}`);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="hidden sm:flex"
        onClick={() => setOpen(true)}
      >
        <Search className="h-5 w-5" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search products..." />
        <CommandList>
          <CommandEmpty>No products found.</CommandEmpty>
          <CommandGroup heading="Products">
            {products.map((product) => (
              <CommandItem
                key={product.id}
                onSelect={() => handleProductSelect(product.id)}
                className="cursor-pointer"
              >
                <Package className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{product.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {product.CategoryProduct.name} - Rp {formatPrice(product.price)}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchDialog;
