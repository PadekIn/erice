
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Package, ShoppingBag, AlertCircle } from 'lucide-react';

const PaymentPending = () => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    // You can add analytics tracking here
    console.log('Payment pending for transaction:', transactionId);
  }, [transactionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center shadow-lg">
        <CardContent className="p-8 space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Clock className="h-20 w-20 text-yellow-500" />
              <div className="absolute -top-1 -right-1 bg-white rounded-full p-1">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-yellow-800">
              Pembayaran Tertunda
            </h1>
            <p className="text-lg text-muted-foreground">
              Pembayaran Anda sedang diproses. Mohon tunggu beberapa saat atau periksa status pembayaran Anda.
            </p>
            {transactionId && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">ID Transaksi:</span> {transactionId}
                </p>
              </div>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-yellow-800">Langkah Selanjutnya:</h3>
            <ul className="text-sm text-yellow-700 space-y-1 text-left">
              <li>• Tunggu konfirmasi pembayaran (biasanya 1-24 jam)</li>
              <li>• Periksa email untuk update status</li>
              <li>• Hubungi customer service jika ada pertanyaan</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link to="/orders" className="block">
              <Button className="w-full bg-forest-600 hover:bg-forest-700 text-lg py-6">
                <Package className="h-5 w-5 mr-2" />
                Cek Status Pesanan
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
              Status pembayaran akan diperbarui secara otomatis ketika konfirmasi diterima.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPending;
