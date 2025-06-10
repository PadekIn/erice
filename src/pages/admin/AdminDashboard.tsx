
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  // Mock data - replace with actual API calls
  const stats = [
    {
      title: 'Total Products',
      value: '156',
      change: '+12%',
      icon: Package,
      color: 'text-forest-600'
    },
    {
      title: 'Total Orders',
      value: '2,847',
      change: '+23%',
      icon: ShoppingCart,
      color: 'text-earth-600'
    },
    {
      title: 'Total Users',
      value: '1,429',
      change: '+8%',
      icon: Users,
      color: 'text-rice-600'
    },
    {
      title: 'Monthly Revenue',
      value: 'Rp 45,230,000',
      change: '+18%',
      icon: TrendingUp,
      color: 'text-forest-600'
    }
  ];

  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'Ahmad Rizki', total: 'Rp 125,000', status: 'completed', date: '2024-05-27' },
    { id: 'ORD-002', customer: 'Siti Nurhaliza', total: 'Rp 85,000', status: 'processing', date: '2024-05-27' },
    { id: 'ORD-003', customer: 'Budi Santoso', total: 'Rp 200,000', status: 'pending', date: '2024-05-26' },
    { id: 'ORD-004', customer: 'Maya Sari', total: 'Rp 150,000', status: 'completed', date: '2024-05-26' },
    { id: 'ORD-005', customer: 'Joko Widodo', total: 'Rp 95,000', status: 'processing', date: '2024-05-25' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-forest-800">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang di Admin Panel Beras Indragiri</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-forest-800">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change} from last month</p>
                </div>
                <div className={`p-3 rounded-full bg-forest-100 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-forest-800">Sales Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#339933" 
                  strokeWidth={2}
                  dot={{ fill: '#339933' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-forest-800">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-rice-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-forest-800">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">{order.id} • {order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-forest-800">{order.total}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
