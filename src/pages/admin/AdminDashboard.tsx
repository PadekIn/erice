/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProductService } from '@/services/productService';
import { OrderService } from '@/services/orderService';
import { UserService } from '@/services/userService';
import { ReportService } from '@/services/reportService';
import { toast } from 'sonner';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  monthlyRevenue: number;
}

interface SalesChartData {
  name: string;
  sales: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customer: string;
  total: string;
  status: string;
  date: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    monthlyRevenue: 0
  });
  const [salesData, setSalesData] = useState<SalesChartData[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all dashboard data concurrently
      const [
        productsResponse,
        ordersResponse,
        usersResponse,
        salesResponse,
        chartResponse,
        recentOrdersResponse
      ] = await Promise.all([
        ProductService.getProductsCount(),
        OrderService.getOrdersCount(),
        UserService.getUsersCount(),
        ReportService.getMonthlySales(),
        ReportService.getSalesChart(),
        OrderService.getRecentOrders()
      ]);

      // Update stats
      setStats({
        totalProducts: productsResponse.status ? productsResponse.data.productCount : 0,
        totalOrders: ordersResponse.status ? ordersResponse.data.orderCount : 0,
        totalUsers: usersResponse.status ? usersResponse.data.userCount : 0,
        monthlyRevenue: salesResponse.status ? salesResponse.data.total : 0
      });

      // Update sales chart data
      if (chartResponse.status && chartResponse.data) {
        const formattedChartData = chartResponse.data.map((item: any) => ({
          name: new Date(item.month + '-01').toLocaleDateString('id-ID', { month: 'short' }),
          sales: item.totalSales
        }));
        setSalesData(formattedChartData);
      }

      // Update recent orders
      if (recentOrdersResponse.status && recentOrdersResponse.data) {
        const formattedOrders = recentOrdersResponse.data.map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customer: order.User.fullname,
          total: formatPrice(order.total),
          status: order.status,
          date: new Date(order.createdAt).toLocaleDateString('id-ID')
        }));
        setRecentOrders(formattedOrders);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statsCards = [
    {
      title: 'Total Products',
      value: loading ? 'Loading...' : stats.totalProducts.toString(),
      icon: Package,
      color: 'text-forest-600'
    },
    {
      title: 'Total Orders',
      value: loading ? 'Loading...' : stats.totalOrders.toLocaleString('id-ID'),
      icon: ShoppingCart,
      color: 'text-earth-600'
    },
    {
      title: 'Total Users',
      value: loading ? 'Loading...' : stats.totalUsers.toLocaleString('id-ID'),
      icon: Users,
      color: 'text-rice-600'
    },
    {
      title: 'Monthly Revenue',
      value: loading ? 'Loading...' : formatPrice(stats.monthlyRevenue),
      icon: TrendingUp,
      color: 'text-forest-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-forest-800">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang di Admin Panel Beras Indragiri</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-forest-800">{stat.value}</p>
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
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">Loading chart data...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [formatPrice(Number(value)), 'Sales']}
                  />
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
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-forest-800">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">Loading recent orders...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No recent orders found</p>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-rice-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-forest-800">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.orderNumber} • {order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-forest-800">{order.total}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
