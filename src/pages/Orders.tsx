/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Package, Calendar, CreditCard, Truck, CheckCircle, Clock, RotateCcw, X, Eye } from 'lucide-react';
import { useOrders } from '@/hooks/useApi';
import OrderDetailModal from '@/components/order/OrderDetailModal';
import SnapPaymentModal from '@/components/order/SnapPaymentModal';
import ReviewModal from '@/components/order/ReviewModal';
import { useToast } from '@/hooks/use-toast';

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('Pending');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSnapModalOpen, setIsSnapModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [snapUrl, setSnapUrl] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [reviewMode, setReviewMode] = useState<'create' | 'view'>('create');

  const { data: ordersResponse, isLoading, error, refetch } = useOrders(activeTab === 'all' ? undefined : activeTab);
  const orders = ordersResponse?.data || [];

  // Check if user is authenticated
  const token = localStorage.getItem('auth_token');
  if (!token) {
    setTimeout(() => navigate('/login'), 100);
    return null;
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Pending: {
        label: 'Menunggu Pembayaran',
        className: 'bg-yellow-100 text-yellow-800',
        icon: CreditCard
      },
      Processing: {
        label: 'Dalam Proses',
        className: 'bg-blue-100 text-blue-800',
        icon: Clock
      },
      Shipped: {
        label: 'Dalam Pengiriman',
        className: 'bg-purple-100 text-purple-800',
        icon: Truck
      },
      Completed: {
        label: 'Selesai',
        className: 'bg-green-100 text-green-800',
        icon: CheckCircle
      },
      Cancelled: {
        label: 'Dibatalkan',
        className: 'bg-red-100 text-red-800',
        icon: Package
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;
    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handlePaymentSuccess = () => {
    setIsSnapModalOpen(false);
    refetch();
  };

  const handlePaymentClick = (snapUrl: string) => {
    setSnapUrl(snapUrl);
    setIsSnapModalOpen(true);
  };

  const handleOrderClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDetailModalOpen(true);
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        }
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Pesanan Dibatalkan",
          description: "Pesanan telah berhasil dibatalkan",
          className: "bg-green-50 border-green-200 text-green-800",
        });
        refetch();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Gagal Membatalkan Pesanan",
        description: error.message || "Terjadi kesalahan saat membatalkan pesanan",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/orders/${orderId}/accept`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        }
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Pesanan Diterima",
          description: "Pesanan telah berhasil diselesaikan",
          className: "bg-green-50 border-green-200 text-green-800",
        });
        setActiveTab("Completed");
        refetch();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Gagal Menerima Pesanan",
        description: error.message || "Terjadi kesalahan saat menerima pesanan",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    }
  };

  const handleReviewClick = (order: any) => {
    setSelectedOrder(order);
    // Check if order has rating to determine mode
    const hasRating = order.items && order.items.some((item: any) => item.rating !== null);
    setReviewMode(hasRating ? 'view' : 'create');
    setIsReviewModalOpen(true);
  };

  const handleBuyAgain = (order: any) => {
    try {
      // Create order items from the order
      const orderItems = order.items.map((item: any) => ({
        productId: item.Product?.id || item.productId,
        name: item.Product?.name || item.name,
        price: item.Product?.price || item.price,
        qty: item.qty,
        image: item.Product?.image || item.image
      }));

      // Store in session storage
      sessionStorage.setItem('directOrderItems', JSON.stringify(orderItems));

      // Navigate to order page
      navigate('/order');
    } catch (error) {
      console.error('Error processing buy again:', error);
      toast({
        title: "Gagal Memproses Pesanan",
        description: "Terjadi kesalahan saat memproses pesanan ulang",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    }
  };

  // Helper function to check if order has been reviewed
  const hasBeenReviewed = (order: any) => {
    return order.items && order.items.some((item: any) => item.rating !== null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-forest-800 mb-4">
            Riwayat Pesanan
          </h1>
          <p className="text-lg text-muted-foreground">
            Lihat status dan detail pesanan Anda
          </p>
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Package className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-forest-800 mb-2">Gagal Memuat Pesanan</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Terjadi kesalahan saat memuat data pesanan
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-forest-600 hover:bg-forest-700"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-forest-800 mb-4">
          Riwayat Pesanan
        </h1>
        <p className="text-lg text-muted-foreground">
          Lihat status dan detail pesanan Anda
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="Pending" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Menunggu Pembayaran
          </TabsTrigger>
          <TabsTrigger value="Processing" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Dalam Proses
          </TabsTrigger>
          <TabsTrigger value="Shipped" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Dalam Pengiriman
          </TabsTrigger>
          <TabsTrigger value="Completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Selesai
          </TabsTrigger>
          <TabsTrigger value="Cancelled" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Dibatalkan
          </TabsTrigger>
        </TabsList>

        {['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'].map((status) => (
          <TabsContent key={status} value={status} className="mt-6">
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {status === 'Pending' ? 'Tidak ada pesanan yang menunggu pembayaran' :
                      status === 'Processing' ? 'Tidak ada pesanan dalam proses' :
                        status === 'Shipped' ? 'Tidak ada pesanan dalam pengiriman' :
                          status === 'Completed' ? 'Tidak ada pesanan yang selesai' :
                            'Tidak ada pesanan yang dibatalkan'}
                  </p>
                </div>
              ) : (
                orders.map((order: any, index: number) => (
                  <Card key={order.id} className="animate-fade-in cursor-pointer hover:shadow-md transition-shadow"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleOrderClick(order.id)}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <CardTitle className="text-forest-800">
                          Pesanan #{order.orderNumber}
                        </CardTitle>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(order.createdAt || Date.now()).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-bold text-forest-600">
                          Total: {formatPrice(order.total)}
                        </div>
                        <div className="flex space-x-2">
                          {order.status === 'Pending' && (
                            <>
                              <Button size="sm" className="bg-forest-600 hover:bg-forest-700" onClick={(e) => {
                                e.stopPropagation();
                                handlePaymentClick(order.paymentUrl);
                              }}>
                                Bayar Sekarang
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm" onClick={(e) => e.stopPropagation()}>
                                    <X className="h-4 w-4 mr-1" />
                                    Batalkan
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Batalkan Pesanan</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Apakah Anda yakin ingin membatalkan pesanan dengan #{order.orderNumber}?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleCancelOrder(order.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Ya, Batalkan
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                          {order.status === 'Shipped' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={(e) => {
                              e.stopPropagation();
                              handleAcceptOrder(order.id);
                            }}>
                              Terima Pesanan
                            </Button>
                          )}
                          {(order.status === 'Completed' || order.status === 'Cancelled') && (
                            <Button variant="outline" size="sm" onClick={(e) => {
                              e.stopPropagation();
                              handleBuyAgain(order);
                            }}>
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Beli Lagi
                            </Button>
                          )}
                          {order.status === 'Completed' && order.paymentStatus === 'Completed' && (
                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700" onClick={(e) => {
                              e.stopPropagation();
                              handleReviewClick(order);
                            }}>
                              {hasBeenReviewed(order) ? (
                                <>
                                  <Eye className="h-4 w-4 mr-1" />
                                  Lihat Ulasan
                                </>
                              ) : (
                                'Beri Ulasan'
                              )}
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            handleOrderClick(order.id);
                          }}>
                            Lihat Detail
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <SnapPaymentModal
        isOpen={isSnapModalOpen}
        onClose={() => setIsSnapModalOpen(false)}
        snapUrl={snapUrl}
        onSuccess={handlePaymentSuccess}
        onCancel={handleCancelOrder}
        orderId={selectedOrderId}
      />
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        orderId={selectedOrderId}
      />
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        order={selectedOrder}
        mode={reviewMode}
      />
    </div>
  );
};

export default Orders;
