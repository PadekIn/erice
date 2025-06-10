
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/services/cartService';

interface CartItemProps {
  item: CartItemType;
  index: number;
  onUpdateQuantity: (id: string, action: 'increment' | 'decrement') => void;
  onRemoveItem: (id: string) => void;
  isUpdating: boolean;
  isRemoving: boolean;
  isSelected: boolean;
  onSelect: (itemId: string, checked: boolean) => void;
}

const CartItem = ({ 
  item, 
  index, 
  onUpdateQuantity, 
  onRemoveItem, 
  isUpdating, 
  isRemoving,
  isSelected,
  onSelect
}: CartItemProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className={`animate-fade-in ${isSelected ? 'ring-2 ring-forest-600 bg-forest-50' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Checkbox */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id={`item-${item.id}`}
              checked={isSelected}
              onChange={(e) => onSelect(item.id, e.target.checked)}
              className="w-4 h-4 text-forest-600 bg-gray-100 border-gray-300 rounded focus:ring-forest-500"
            />
          </div>

          {/* Product Content */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
            <div 
              className="w-full sm:w-24 h-32 sm:h-24 bg-cover bg-center rounded-lg flex-shrink-0"
              style={{ backgroundImage: `url(${item.Product.image})` }}
            />
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold text-forest-800">{item.Product.name}</h3>
              <p className="text-xl font-bold text-forest-600">
                {formatPrice(item.Product.price)}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onUpdateQuantity(item.id, 'decrement')}
                    className="h-8 w-8"
                    disabled={isUpdating}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.qty}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onUpdateQuantity(item.id, 'increment')}
                    className="h-8 w-8"
                    disabled={isUpdating}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                  disabled={isRemoving}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-forest-800">
                {formatPrice(item.Product.price * item.qty)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
