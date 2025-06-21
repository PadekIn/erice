/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOrderDetail, useUpdateOrderStatus } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Package, MapPin, User, FileText, Gift, Phone, Truck } from 'lucide-react';

interface AdminOrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

const AdminOrderDetailModal = ({ isOpen, onClose, orderId }: AdminOrderDetailModalProps) => {
  const { data: orderResponse, isLoading, error } = useOrderDetail(orderId);
  const updateStatusMutation = useUpdateOrderStatus();
  const { toast } = useToast();
  const [receiptNumber, setReceiptNumber] = useState('');
  const [isDelivering, setIsDelivering] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  const orderDetail = orderResponse?.data;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Pending: { className: 'bg-yellow-100 text-yellow-800' },
      Processing: { className: 'bg-blue-100 text-blue-800' },
      Shipped: { className: 'bg-purple-100 text-purple-800' },
      Completed: { className: 'bg-green-100 text-green-800' },
      Cancelled: { className: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;
    return <Badge className={config.className}>{status}</Badge>;
  };

  const handleDeliverOrder = async () => {
    if (!receiptNumber.trim()) {
      toast({
        title: "Receipt Number Required",
        description: "Please enter the receipt number",
        className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      });
      return;
    }

    setIsDelivering(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/orders/${orderId}/deliver`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ receiptNumber })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Order Shipped",
          description: "Order has been successfully shipped",
          className: "bg-green-50 border-green-200 text-green-800",
        });
        setReceiptNumber('');
        setShowDeliveryModal(false);
        window.location.reload();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Delivery Failed",
        description: error.message || "Failed to ship order",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    } finally {
      setIsDelivering(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading Order Details</DialogTitle>
            <DialogDescription>Please wait while we load the order information.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <p>Loading order details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !orderDetail) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Error Loading Order</DialogTitle>
            <DialogDescription>Unable to load order details. Please try again.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <p>Failed to load order details</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-forest-800">Order Details - {orderDetail?.orderNumber}</DialogTitle>
            <DialogDescription>Manage order information and update status as needed.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Order Date:</span>
                  <span>{new Date(orderDetail.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Status:</span>
                  {getStatusBadge(orderDetail.status)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Payment Status:</span>
                  <Badge className={orderDetail.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                    {orderDetail.paymentStatus}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Customer:</span>
                  <span>{orderDetail.User.fullname}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Phone:</span>
                  <span>{orderDetail.User.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Ekspedisi:</span>
                  <span>{orderDetail.Shipping.name}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Shipping Address:</span>
              </div>
              <p className="text-sm text-muted-foreground ml-7">
                {orderDetail.Address.street}, {orderDetail.Address.village}, {orderDetail.Address.subDistrict}, {orderDetail.Address.city}, {orderDetail.Address.province}, {orderDetail.Address.country} {orderDetail.Address.postalCode}
              </p>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h3 className="font-medium text-forest-800">Order Items</h3>
              <div className="space-y-2">
                {orderDetail.OrderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-rice-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price)}</p>
                      <p className="text-sm text-muted-foreground">Total: {formatPrice(item.price * item.qty)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Voucher */}
            {orderDetail.Voucher && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Gift className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Voucher Applied:</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span>{orderDetail.Voucher.code}</span>
                  <span className="font-medium text-green-600">-{formatPrice(orderDetail.Voucher.value)}</span>
                </div>
              </div>
            )}

            {/* Notes */}
            {orderDetail.notes && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Notes:</span>
                </div>
                <p className="text-sm text-muted-foreground ml-7">{orderDetail.notes}</p>
              </div>
            )}

            {/* Order Summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatPrice(orderDetail.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-forest-600">{formatPrice(orderDetail.total)}</span>
              </div>
            </div>

            {/* Send Item Button */}
            {orderDetail?.status === 'Processing' && (
              <div className="border-t pt-4">
                <h3 className="font-medium text-forest-800 mb-3">Order Management</h3>
                <Button
                  onClick={() => setShowDeliveryModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Send Item
                </Button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delivery Modal */}
      <Dialog open={showDeliveryModal} onOpenChange={setShowDeliveryModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Item</DialogTitle>
            <DialogDescription>Enter the receipt number to ship this order</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="receiptNumber">Receipt Number</Label>
              <Input
                id="receiptNumber"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                placeholder="Enter shipping receipt number"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDeliveryModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleDeliverOrder}
                disabled={isDelivering || !receiptNumber.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isDelivering ? 'Shipping...' : 'Ship Order'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminOrderDetailModal;
