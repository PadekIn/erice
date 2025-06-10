
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CreditCard } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const storedOrderData = localStorage.getItem('orderData');
    if (storedOrderData) {
      setOrderData(JSON.parse(storedOrderData));
    } else {
      navigate('/cart');
    }
  }, [navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleMidtransPayment = async () => {
    setIsLoading(true);
    
    // Simulate Midtrans payment processing
    setTimeout(() => {
      toast({
        title: "Pembayaran Berhasil",
        description: "Terima kasih! Pesanan Anda sedang diproses.",
        className: "bg-green-50 border-green-200 text-green-800",
      });
      
      // Clear order data and navigate to success page
      localStorage.removeItem('orderData');
      setIsLoading(false);
      navigate('/payment-success');
    }, 2000);
  };

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Memuat data pembayaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-forest-800 mb-4">
          Pembayaran
        </h1>
        <p className="text-lg text-muted-foreground">
          Selesaikan pembayaran untuk menyelesaikan pesanan Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderData.items.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.Product.name} x {item.qty}</span>
                  <span className="font-medium">{formatPrice(item.Product.price * item.qty)}</span>
                </div>
              ))}
              <hr />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(orderData.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim ({orderData.shippingMethod?.name})</span>
                <span className="font-medium">{formatPrice(orderData.shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>PPN (11%)</span>
                <span className="font-medium">{formatPrice(orderData.vat)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-forest-600">{formatPrice(orderData.total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Method */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Metode Pembayaran</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Setelah mengklik tombol bayar, Anda akan dialihkan ke halaman pembayaran Midtrans 
                untuk menyelesaikan transaksi dengan aman.
              </p>
              <Button 
                onClick={handleMidtransPayment}
                className="w-full bg-forest-600 hover:bg-forest-700 text-white py-6 text-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Memproses Pembayaran...' : 'Bayar dengan Midtrans'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
