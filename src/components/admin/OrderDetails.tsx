
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  total: number;
  status: string;
  date: string;
  address: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  notes: string;
}

interface OrderDetailsProps {
  order: Order;
  onUpdateOrderStatus: (orderId: string, newStatus: string) => void;
}

const OrderDetails = ({ order, onUpdateOrderStatus }: OrderDetailsProps) => {
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'canceled', label: 'Canceled' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      case 'canceled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium text-forest-800 mb-2">Customer Information</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Name:</span> {order.customer}</p>
            <p><span className="font-medium">Email:</span> {order.email}</p>
            <p><span className="font-medium">Phone:</span> {order.phone}</p>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-forest-800 mb-2">Order Information</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Order ID:</span> {order.id}</p>
            <p><span className="font-medium">Date:</span> {order.date}</p>
            <p><span className="font-medium">Total:</span> Rp {order.total.toLocaleString()}</p>
            <p>
              <span className="font-medium">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-forest-800 mb-2">Shipping Address</h3>
        <p className="text-sm text-gray-600">{order.address}</p>
      </div>

      <div>
        <h3 className="font-medium text-forest-800 mb-2">Order Items</h3>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>Rp {item.price.toLocaleString()}</TableCell>
                  <TableCell>Rp {(item.quantity * item.price).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {order.notes && (
        <div>
          <h3 className="font-medium text-forest-800 mb-2">Notes</h3>
          <p className="text-sm text-gray-600 bg-rice-50 p-3 rounded-lg">{order.notes}</p>
        </div>
      )}

      <div>
        <h3 className="font-medium text-forest-800 mb-2">Update Status</h3>
        <div className="flex space-x-2">
          {statusOptions.map((status) => (
            <Button
              key={status.value}
              variant={order.status === status.value ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdateOrderStatus(order.id, status.value)}
              className={order.status === status.value ? "bg-forest-600 hover:bg-forest-700" : ""}
            >
              {status.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
