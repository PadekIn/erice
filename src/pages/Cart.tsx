
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useIncrementCartItem, useDecrementCartItem, useRemoveCartItem } from '@/hooks/useCart';
import { AuthService } from '@/services/authService';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import EmptyCart from '@/components/cart/EmptyCart';
import LoadingCart from '@/components/cart/LoadingCart';

const Cart = () => {
  const navigate = useNavigate();
  const isAuthenticated = AuthService.isAuthenticated();
  const incrementMutation = useIncrementCartItem();
  const decrementMutation = useDecrementCartItem();
  const removeMutation = useRemoveCartItem();
  const { data: cartData, isLoading } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    setTimeout(() => navigate('/login'), 100);
    return null;
  }

  const cartItems = cartData?.data || [];

  const updateQuantity = (id: string, action: 'increment' | 'decrement') => {
    if (action === 'increment') {
      incrementMutation.mutate(id);
    } else {
      decrementMutation.mutate(id);
    }
  };

  const removeItem = (id: string) => {
    removeMutation.mutate(id);
    // Remove from selected items if it was selected
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
  };

  const handleItemSelect = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(cartItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleOrderNow = () => {
    if (selectedItems.length === 0) {
      return;
    }

    // Filter selected items and store them in sessionStorage for order page
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
    const orderItems = selectedCartItems.map(item => ({
      cartItemId: item.id,
      productId: item.Product.id,
      name: item.Product.name,
      price: item.Product.price,
      qty: item.qty,
      image: item.Product.image
    }));

    sessionStorage.setItem('selectedCartItems', JSON.stringify(orderItems));
    navigate('/order');
  };

  if (isLoading) {
    return <LoadingCart />;
  }

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-forest-800 mb-4">
          Keranjang Belanja
        </h1>
        <p className="text-lg text-muted-foreground">
          Review produk yang akan Anda beli
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Select All */}
          <div className="flex items-center space-x-2 p-4 bg-rice-50 rounded-lg">
            <input
              type="checkbox"
              id="select-all"
              checked={selectedItems.length === cartItems.length && cartItems.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="w-4 h-4 text-forest-600 bg-gray-100 border-gray-300 rounded focus:ring-forest-500"
            />
            <label htmlFor="select-all" className="text-sm font-medium text-forest-800">
              Pilih Semua ({cartItems.length} item)
            </label>
          </div>

          {cartItems.map((item, index) => (
            <CartItem
              key={item.id}
              item={item}
              index={index}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              isUpdating={incrementMutation.isPending || decrementMutation.isPending}
              isRemoving={removeMutation.isPending}
              isSelected={selectedItems.includes(item.id)}
              onSelect={handleItemSelect}
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <CartSummary
            cartItems={selectedCartItems}
            onOrderNow={handleOrderNow}
            selectedCount={selectedItems.length}
            totalItems={cartItems.length}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
