import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, ShoppingCart, Filter, ShoppingBag } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { AuthService } from '@/services/authService';
import { useAddToCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useToast } from '@/hooks/use-toast';
import OrderQuantityModal from '@/components/product/OrderQuantityModal';
import { Product } from '@/services/productService';

const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceFilter, setPriceFilter] = useState('all');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const isAuthenticated = AuthService.isAuthenticated();
  const addToCartMutation = useAddToCart();
  const { toast } = useToast();

  // Fetch categories from API
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  // Prepare filters for API call
  const filters = {
    ...(selectedCategory !== 'all' && { categoryProductId: selectedCategory }),
    ...(priceFilter === 'low' && { maxPrice: 100000 }),
    ...(priceFilter === 'medium' && { minPrice: 100000, maxPrice: 150000 }),
    ...(priceFilter === 'high' && { minPrice: 150000 }),
  };

  const { data: productsData, isLoading } = useProducts(filters);
  const products = productsData?.data || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const truncateDescription = (text: string, maxLength: number = 289) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleAddToCart = (productId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk menambahkan produk ke keranjang",
        className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      });
      return;
    }

    addToCartMutation.mutate({
      productId: productId,
      qty: 1
    });
  };

  const handleOrderNow = (product: Product) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk memesan produk",
        className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      });
      return;
    }

    setSelectedProduct(product);
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
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-forest-800 mb-4">
          Produk Beras Premium
        </h1>
        <p className="text-lg text-muted-foreground">
          Pilih dari koleksi beras berkualitas tinggi kami langsung dari petani Indragiri Hilir
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-card rounded-lg border">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Filter:</span>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Pilih Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priceFilter} onValueChange={setPriceFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter Harga" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Harga</SelectItem>
            <SelectItem value="low">Di bawah Rp 100,000</SelectItem>
            <SelectItem value="medium">Rp 100,000 - Rp 150,000</SelectItem>
            <SelectItem value="high">Di atas Rp 150,000</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <Card key={product.id} className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="relative overflow-hidden">
              <Link to={`/products/${product.id}`}>
                <div
                  className="h-80 bg-cover bg-center transition-transform duration-300 group-hover:scale-110 cursor-pointer"
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
              </Link>
              <div className="absolute top-4 left-4">
                <Badge className="bg-forest-600 text-white">
                  {product.CategoryProduct.name}
                </Badge>
              </div>
            </div>
            <CardHeader className="space-y-2">
              <Link to={`/products/${product.id}`}>
                <div className='flex justify-between items-end'>
                  <h3 className="text-lg font-semibold text-forest-800 group-hover:text-forest-600 transition-colors cursor-pointer">
                    {product.name}
                  </h3>
                  <span className='text-sm'>Stock: {product.stock}</span>
                </div>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating.average}</span>
                </div>
                <span className="text-sm text-muted-foreground">({product.rating.count} ulasan)</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground h-24">{truncateDescription(product.description)}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-forest-800">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-muted-foreground">
                  /{product.weight} {product.unit}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={addToCartMutation.isPending || product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
                <Button
                  className="flex-[2] bg-forest-600 hover:bg-forest-700 text-white"
                  onClick={() => handleOrderNow(product)}
                  disabled={product.stock === 0}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  {product.stock === 0 ? 'Stok Habis' : 'Pesan Sekarang'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Tidak ada produk yang sesuai dengan filter yang dipilih.
          </p>
        </div>
      )}

      <OrderQuantityModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={selectedProduct}
        onOrder={handleDirectOrder}
      />
    </div>
  );
};

export default Products;
