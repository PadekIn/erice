
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

const EmptyCart = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-6">
        <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto" />
        <h1 className="text-3xl font-bold text-forest-800">Keranjang Kosong</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Keranjang belanja Anda masih kosong. Mulai berbelanja untuk menambahkan produk.
        </p>
        <Link to="/products">
          <Button size="lg" className="bg-forest-600 hover:bg-forest-700">
            Mulai Berbelanja
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;
