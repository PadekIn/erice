import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Printer, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReportService } from '@/services/reportService';
import { toast } from 'sonner';

interface UserSalesData {
  id: string;
  fullname: string;
  email: string;
  total: number;
  orderCount: number;
}

interface ProductSalesData {
  id: string;
  name: string;
  price: number;
  category: string;
  qtySell: number;
  total: number;
}

const AdminReports = () => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportType, setReportType] = useState('monthly');
  const [activeReport, setActiveReport] = useState('customer'); // 'customer' or 'item'
  const [customerSalesData, setCustomerSalesData] = useState<UserSalesData[]>([]);
  const [itemSalesData, setItemSalesData] = useState<ProductSalesData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      if (activeReport === 'customer') {
        const response = await ReportService.getSalesReportByUser(dateFrom || undefined, dateTo || undefined);
        if (response.status) {
          setCustomerSalesData(response.data);
        } else {
          toast.error(response.message || 'Failed to fetch customer sales data');
        }
      } else {
        const response = await ReportService.getSalesReportByProduct(dateFrom || undefined, dateTo || undefined);
        if (response.status) {
          setItemSalesData(response.data);
        } else {
          toast.error(response.message || 'Failed to fetch product sales data');
        }
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [activeReport]);

  const handleFilter = () => {
    fetchReportData();
  };

  const handlePrint = () => {
    window.print();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getReportTitle = () => {
    return activeReport === 'customer' ? 'LAPORAN PENJUALAN PER PELANGGAN' : 'LAPORAN PENJUALAN PER PRODUK';
  };

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-forest-800">Laporan Penjualan</h1>
          <Button onClick={handlePrint} className="bg-forest-600 hover:bg-forest-700">
            <Printer className="h-4 w-4 mr-2" />
            Cetak Laporan
          </Button>
        </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block text-center border-b-2 border-forest-600 pb-4 mb-4">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-forest-800 mb-2">BERAS INDRAGIRI</h1>
          <p className="text-lg text-forest-600">
            Jl. Raya Indragiri No. 123, Rengat, Riau 29313
          </p>
          <p className="text-sm text-forest-600">
            Telp: (0769) 123456 | Email: info@berasindragiri.com
          </p>
        </div>
        <h2 className="text-xl font-bold text-forest-800 mt-4">{getReportTitle()}</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Periode: {dateFrom || 'Semua'} s/d {dateTo || 'Sekarang'}
        </p>
        <p className="text-sm text-muted-foreground">
          Dicetak pada: {new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Filters and Report Type Selector */}
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="space-y-2">
              <Label htmlFor="reportSelection">Jenis Laporan</Label>
              <Select value={activeReport} onValueChange={setActiveReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis laporan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Per Pelanggan</SelectItem>
                  <SelectItem value="item">Per Produk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Dari Tanggal</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">Sampai Tanggal</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleFilter} 
                disabled={loading}
                className="w-full bg-forest-600 hover:bg-forest-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                {loading ? 'Loading...' : 'Filter'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Sales Report Table */}
      {activeReport === 'customer' && (
        <Card>
          <CardHeader className="print:hidden">
            <CardTitle>Laporan Penjualan Per Pelanggan</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Pelanggan</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Total Pesanan</TableHead>
                    <TableHead>Total Pembelian</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerSalesData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Tidak ada data tersedia
                      </TableCell>
                    </TableRow>
                  ) : (
                    customerSalesData.map((customer, index) => (
                      <TableRow key={customer.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{customer.fullname}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.orderCount}</TableCell>
                        <TableCell>{formatPrice(customer.total)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Item Sales Report Table */}
      {activeReport === 'item' && (
        <Card>
          <CardHeader className="print:hidden">
            <CardTitle>Laporan Penjualan Per Produk</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Unit Terjual</TableHead>
                    <TableHead>Total Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemSalesData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Tidak ada data tersedia
                      </TableCell>
                    </TableRow>
                  ) : (
                    itemSalesData.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{formatPrice(item.price)}</TableCell>
                        <TableCell>{item.qtySell}</TableCell>
                        <TableCell>{formatPrice(item.total)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Print Footer with Signature */}
      <div className="hidden print:block mt-16">
        <div className="flex justify-between items-end">
          <div className="text-sm text-muted-foreground">
            <p>© 2024 Beras Indragiri</p>
            <p>Laporan ini digenerate secara otomatis</p>
          </div>
          <div className="text-center">
            <p className="text-sm mb-16">Rengat, {new Date().toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
            <div className="border-t border-black pt-2 w-48">
              <p className="text-sm font-medium">Manager</p>
              <p className="text-sm">Beras Indragiri</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
