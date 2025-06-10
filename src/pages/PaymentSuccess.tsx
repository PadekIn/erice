
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, ShoppingBag, CreditCard } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    // You can add analytics tracking here
    console.log('Payment successful for transaction:', transactionId);
  }, [transactionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-forest-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center shadow-lg">
        <CardContent className="p-8 space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <CheckCircle className="h-20 w-20 text-green-500" />
              <div className="absolute -top-1 -right-1 bg-white rounded-full p-1">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-forest-800">
              Pembayaran Berhasil!
            </h1>
            <p className="text-lg text-muted-foreground">
              Terima kasih! Pesanan Anda telah berhasil diproses dan sedang dalam tahap persiapan pengiriman.
            </p>
            {transactionId && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <span className="font-medium">ID Transaksi:</span> {transactionId}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Link to="/orders" className="block">
              <Button className="w-full bg-forest-600 hover:bg-forest-700 text-lg py-6">
                <Package className="h-5 w-5 mr-2" />
                Lihat Pesanan Saya
              </Button>
            </Link>
            <Link to="/products" className="block">
              <Button variant="outline" className="w-full text-lg py-6">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Kembali Berbelanja
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-muted-foreground">
              Anda akan menerima konfirmasi pesanan melalui email dalam beberapa menit.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
