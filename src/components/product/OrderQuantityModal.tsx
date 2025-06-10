
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Product } from '@/services/productService';

interface OrderQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onOrder: (product: Product, quantity: number) => void;
}

const OrderQuantityModal = ({ isOpen, onClose, product, onOrder }: OrderQuantityModalProps) => {
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleOrder = () => {
    if (product) {
      onOrder(product, quantity);
      onClose();
      setQuantity(1);
    }
  };

  if (!product) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-forest-800">Pesan Sekarang</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div
              className="w-20 h-20 bg-cover bg-center rounded-lg flex-shrink-0"
              style={{ backgroundImage: `url(${product.image})` }}
            />
            <div className="flex-1">
              <h4 className="font-medium text-forest-800">{product.name}</h4>
              <p className="text-sm text-muted-foreground">{product.CategoryProduct.name}</p>
              <p className="font-semibold text-forest-600">{formatPrice(product.price)}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Jumlah</Label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>

              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 && value <= product.stock) {
                    setQuantity(value);
                  }
                }}
                className="w-20 text-center"
                min="1"
                max={product.stock}
              />

              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
                className="h-10 w-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Stok tersedia: {product.stock}
            </p>
          </div>

          <div className="flex justify-between items-center py-3 border-t">
            <span className="font-medium">Total:</span>
            <span className="text-lg font-bold text-forest-600">
              {formatPrice(product.price * quantity)}
            </span>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button
              onClick={handleOrder}
              className="flex-1 bg-forest-600 hover:bg-forest-700"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Pesan Sekarang
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderQuantityModal;
