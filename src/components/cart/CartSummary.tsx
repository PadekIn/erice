
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItem } from '@/services/cartService';

interface CartSummaryProps {
  cartItems: CartItem[];
  onOrderNow: () => void;
  selectedCount: number;
  totalItems: number;
}

const CartSummary = ({ cartItems, onOrderNow, selectedCount, totalItems }: CartSummaryProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.Product.price * item.qty), 0);

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-forest-800">Ringkasan Pesanan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          {selectedCount} dari {totalItems} item dipilih
        </div>
        <div className="flex justify-between">
          <span>Subtotal ({selectedCount} item)</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <hr />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-forest-600">{formatPrice(subtotal)}</span>
        </div>
        <Button 
          className="w-full bg-forest-600 hover:bg-forest-700 text-white py-6 text-lg"
          onClick={onOrderNow}
          disabled={selectedCount === 0}
        >
          Pesan Sekarang {selectedCount > 0 && `(${selectedCount} item)`}
        </Button>
        <Link to="/products">
          <Button variant="outline" className="w-full mt-4">
            Lanjutkan Berbelanja
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
