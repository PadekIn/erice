
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart, useRemoveCartItem } from '@/hooks/useCart';
import { useShippings } from '@/hooks/useShipping';
import { useUserAddresses } from '@/hooks/useAddress';
import { useVoucher } from '@/hooks/useVoucher';
import { useCreateOrder } from '@/hooks/useOrder';
import { AuthService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Package, Plus, Gift } from 'lucide-react';
import AddAddressModal from '@/components/order/AddAddressModal';
import SnapPaymentModal from '@/components/order/SnapPaymentModal';

interface DirectOrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

interface SelectedCartItem {
  cartItemId: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

interface CartItem {
  id: string;
  Product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  qty: number;
}

const Order = () => {
  const navigate = useNavigate();
  const isAuthenticated = AuthService.isAuthenticated();
  const { toast } = useToast();

  const { data: cartData, isLoading: cartLoading } = useCart();
  const { data: shippingData, isLoading: shippingLoading } = useShippings();
  const { data: addressData, isLoading: addressLoading } = useUserAddresses();
  const createOrderMutation = useCreateOrder();
  const removeCartItemMutation = useRemoveCartItem();

  const cartItems = useMemo(() => cartData?.data || [], [cartData]);
  const shippings = shippingData?.data || [];
  const userAddresses = addressData?.data || [];

  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isSnapModalOpen, setIsSnapModalOpen] = useState(false);
  const [snapUrl, setSnapUrl] = useState<string>('');

  const [selectedShipping, setSelectedShipping] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [cartItemsToRemove, setCartItemsToRemove] = useState<string[]>([]);

  // Check for direct order items or selected cart items from sessionStorage
  useEffect(() => {
    const directOrderItems = sessionStorage.getItem('directOrderItems');
    const selectedCartItems = sessionStorage.getItem('selectedCartItems');
    
    if (selectedCartItems) {
      try {
        const items: SelectedCartItem[] = JSON.parse(selectedCartItems);
        const formattedItems: CartItem[] = items.map((item) => ({
          id: `selected-${item.cartItemId}`,
          Product: {
            id: item.productId,
            name: item.name,
            price: item.price,
            image: item.image || 'https://via.placeholder.com/150'
          },
          qty: item.qty
        }));
        setOrderItems(formattedItems);
        setCartItemsToRemove(items.map(item => item.cartItemId));
      } catch (error) {
        console.error('Error parsing selected cart items:', error);
        setOrderItems(cartItems);
      }
    } else if (directOrderItems) {
      try {
        const items: DirectOrderItem[] = JSON.parse(directOrderItems);
        const formattedItems: CartItem[] = items.map((item) => ({
          id: `direct-${item.productId}`,
          Product: {
            id: item.productId,
            name: item.name,
            price: item.price,
            image: item.image || 'https://via.placeholder.com/150'
          },
          qty: item.qty
        }));
        setOrderItems(formattedItems);
      } catch (error) {
        console.error('Error parsing direct order items:', error);
        setOrderItems(cartItems);
      }
    } else {
      setOrderItems(cartItems);
    }
  }, [cartItems]);

  const { data: voucherData, isLoading: voucherLoading } = useVoucher(voucherCode);

  if (!isAuthenticated) {
    setTimeout(() => navigate('/login'), 100);
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const subtotal = orderItems.reduce((sum, item) => sum + (item.Product.price * item.qty), 0);
  const selectedShippingCost = shippings.find(s => s.id === selectedShipping)?.cost || 0;
  const vat = Math.round(subtotal * 0.11); // 11% VAT
  const voucherDiscount = appliedVoucher ? appliedVoucher.value : 0;
  const total = subtotal + selectedShippingCost + vat - voucherDiscount;

  const handleApplyVoucher = () => {
    if (voucherData?.data) {
      setAppliedVoucher(voucherData.data);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
  };

  const handleCreateOrder = async () => {
    if (!selectedShipping) {
      toast({
        title: "Bad Request",
        description: "Silakan pilih metode pengiriman",
        className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      });
      return;
    }

    if (userAddresses.length > 0 && !selectedAddress) {
      toast({
        title: "Bad Request",
        description: "Silakan pilih alamat pengiriman",
        className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      });
      return;
    }

    try {
      const orderData = {
        shippingId: selectedShipping,
        addressId: selectedAddress,
        voucherId: appliedVoucher?.id || '',
        notes: notes,
        tax: vat,
        total: total,
        products: orderItems.map(item => ({
          productId: item.Product.id,
          qty: item.qty,
          price: item.Product.price
        }))
      };

      const response = await createOrderMutation.mutateAsync(orderData);

      if (response.data.paymentUrl) {
        setSnapUrl(response.data.paymentUrl);
        setIsSnapModalOpen(true);
        // Clear session storage items
        sessionStorage.removeItem('directOrderItems');
        sessionStorage.removeItem('selectedCartItems');
      }
    } catch (error) {
      console.error('Order creation failed:', error);
    }
  };

  const handlePaymentSuccess = async () => {
    setIsSnapModalOpen(false);
    
    // Remove cart items if they came from cart selection
    if (cartItemsToRemove.length > 0) {
      try {
        for (const cartItemId of cartItemsToRemove) {
          await removeCartItemMutation.mutateAsync(cartItemId);
        }
      } catch (error) {
        console.error('Error removing cart items:', error);
      }
    }
    
    navigate('/orders');
  };

  if (cartLoading || shippingLoading || addressLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Memuat data pesanan...</p>
        </div>
      </div>
    );
  }

  if (orderItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-forest-800 mb-4">
          Detail Pesanan
        </h1>
        <p className="text-lg text-muted-foreground">
          Lengkapi informasi pengiriman dan pilih kurir
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Produk Pesanan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-rice-50 rounded-lg">
                  <div
                    className="w-16 h-16 bg-cover bg-center rounded-lg flex-shrink-0"
                    style={{ backgroundImage: `url(${item.Product.image})` }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-forest-800">{item.Product.name}</h4>
                    <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
                    <p className="font-semibold text-forest-600">{formatPrice(item.Product.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-forest-800">
                      {formatPrice(item.Product.price * item.qty)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Informasi Pengiriman</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userAddresses.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>Pilih Alamat Pengiriman</Label>
                    {userAddresses.map((address) => (
                      <div
                        key={address.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedAddress === address.id
                          ? 'border-forest-600 bg-forest-50'
                          : 'border-gray-200 hover:border-forest-300'
                          }`}
                        onClick={() => setSelectedAddress(address.id)}
                      >
                        <div className="space-y-1">
                          <h4 className="font-medium text-forest-800">{address.fullname}</h4>
                          <p className="text-sm text-muted-foreground">{address.phone}</p>
                          <p className="text-sm">
                            {address.street}, {address.village}, {address.subDistrict}, {address.city}, {address.province} {address.postalCode}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddAddressModalOpen(true)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Alamat Baru
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-forest-800 mb-2">
                      Belum Ada Alamat Pengiriman
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Tambahkan alamat pengiriman untuk melanjutkan pemesanan
                    </p>
                    <Button
                      onClick={() => setIsAddAddressModalOpen(true)}
                      className="bg-forest-600 hover:bg-forest-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Alamat Pengiriman
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Method */}
          <Card>
            <CardHeader>
              <CardTitle>Pilih Ekspedisi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Select
                  value={selectedShipping}
                  onValueChange={setSelectedShipping}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih ekspedisi..." />
                  </SelectTrigger>
                  <SelectContent>
                    {shippings.map((shipping) => (
                      <SelectItem key={shipping.id} value={shipping.id}>
                        <div className="flex justify-between items-center w-full">
                          <span className='tracking-wide font-bold'>{shipping.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Notes and Voucher Section */}
          <Card>
            <CardHeader>
              <CardTitle>Catatan & Voucher</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Catatan Pesanan</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tambahkan catatan untuk pesanan Anda..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="voucher">Kode Voucher</Label>
                <div className="flex space-x-2">
                  <Input
                    id="voucher"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Masukkan kode voucher"
                    disabled={!!appliedVoucher}
                  />
                  {appliedVoucher ? (
                    <Button
                      variant="outline"
                      onClick={handleRemoveVoucher}
                      className="whitespace-nowrap"
                    >
                      Hapus
                    </Button>
                  ) : (
                    <Button
                      onClick={handleApplyVoucher}
                      disabled={!voucherCode || voucherLoading}
                      className="whitespace-nowrap"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Terapkan
                    </Button>
                  )}
                </div>
                {appliedVoucher && (
                  <p className="text-sm text-green-600">
                    Voucher "{appliedVoucher.voucherCode}" diterapkan! Diskon: {formatPrice(appliedVoucher.value)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-forest-800">Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({orderItems.length} item)</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim</span>
                <span className="font-medium">{formatPrice(selectedShippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>PPN (11%)</span>
                <span className="font-medium">{formatPrice(vat)}</span>
              </div>
              {appliedVoucher && (
                <div className="flex justify-between text-green-600">
                  <span>Diskon Voucher</span>
                  <span className="font-medium">-{formatPrice(voucherDiscount)}</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-forest-600">{formatPrice(total)}</span>
              </div>
              <Button
                className="w-full bg-forest-600 hover:bg-forest-700 text-white py-6 text-lg"
                onClick={handleCreateOrder}
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? 'Memproses...' : 'Bayar Sekarang'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddAddressModal
        isOpen={isAddAddressModalOpen}
        onClose={() => setIsAddAddressModalOpen(false)}
      />

      <SnapPaymentModal
        isOpen={isSnapModalOpen}
        onClose={() => setIsSnapModalOpen(false)}
        snapUrl={snapUrl}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Order;
