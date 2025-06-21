
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingBag, ArrowLeft, ShoppingCart } from 'lucide-react';
import { AuthService } from '@/services/authService';
import { useAddToCart } from '@/hooks/useCart';
import { useProduct } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/services/productService';
import OrderQuantityModal from '@/components/product/OrderQuantityModal';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const isAuthenticated = AuthService.isAuthenticated();
  const addToCartMutation = useAddToCart();
  const { toast } = useToast();

  const { data: productData, isLoading, error } = useProduct(id!);
  const product = productData?.data;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk menambahkan produk ke keranjang",
        className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      });
      return;
    }

    if (product) {
      addToCartMutation.mutate({
        productId: product.id,
        qty: 1
      });
    }
  };

  const handleOrderNow = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk memesan produk",
        className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      });
      return;
    }

    setIsOrderModalOpen(true);
  };

  const handleDirectOrder = (product: Product, quantity: number) => {
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const directOrderItems = [{
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: quantity,
      image: product.image
    }];

    // Store in sessionStorage for persistence
    sessionStorage.setItem('directOrderItems', JSON.stringify(directOrderItems));
    navigate('/order');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg text-red-600">Produk tidak ditemukan</p>
          <Button onClick={() => navigate('/products')} className="mt-4">
            Kembali ke Produk
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        onClick={() => navigate('/products')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Produk
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div
            className="w-full h-full bg-cover bg-center rounded-lg"
            style={{
              backgroundImage: `url(${product.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onError={(e) => {
              const target = e.target as HTMLDivElement;
              target.style.backgroundImage = 'url(https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80)';
            }}
          />
        </div>

        <div className="space-y-6">
          <div>
            <Badge className="bg-forest-600 text-white mb-2">
              {product.CategoryProduct.name}
            </Badge>
            <h1 className="text-3xl font-bold text-forest-800 mb-4">
              {product.name}
            </h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating.average}</span>
              </div>
              <span className="text-muted-foreground">({product.rating.count} ulasan)</span>
            </div>
            <p className="text-xl font-bold text-forest-600 mb-4">
              {formatPrice(product.price)}
            </p>
            <p className="text-muted-foreground mb-4">
              Stock: {product.stock}
            </p>
            <p className="text-muted-foreground mb-4">
              Weight: {product.weight} {product.unit}
            </p>
          </div>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Deskripsi Produk</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending || product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button
              className="flex-[2] bg-forest-600 hover:bg-forest-700 text-white py-3 text-lg"
              onClick={handleOrderNow}
              disabled={product.stock === 0}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              {product.stock === 0 ? 'Stok Habis' : 'Pesan Sekarang'}
            </Button>
          </div>
        </div>
      </div>

      <OrderQuantityModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={product}
        onOrder={handleDirectOrder}
      />
    </div>
  );
};

export default ProductDetail;
