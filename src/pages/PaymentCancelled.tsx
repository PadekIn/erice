
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, RotateCcw, ShoppingBag, AlertTriangle } from 'lucide-react';

const PaymentCancelled = () => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    // You can add analytics tracking here
    console.log('Payment cancelled for transaction:', transactionId);
  }, [transactionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center shadow-lg">
        <CardContent className="p-8 space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <XCircle className="h-20 w-20 text-red-500" />
              <div className="absolute -top-1 -right-1 bg-white rounded-full p-1">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-red-800">
              Pembayaran Dibatalkan
            </h1>
            <p className="text-lg text-muted-foreground">
              Pembayaran Anda telah dibatalkan. Pesanan tidak diproses dan tidak ada biaya yang dikenakan.
            </p>
            {transactionId && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  <span className="font-medium">ID Transaksi:</span> {transactionId}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Link to="/cart" className="block">
              <Button className="w-full bg-forest-600 hover:bg-forest-700 text-lg py-6">
                <RotateCcw className="h-5 w-5 mr-2" />
                Coba Lagi
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
              Jika Anda mengalami masalah, silakan hubungi customer service kami untuk bantuan.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancelled;
