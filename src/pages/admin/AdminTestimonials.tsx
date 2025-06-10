
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const AdminTestimonials = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  // Mock data - replace with actual API calls
  const testimonials = [
    {
      id: 1,
      name: 'Ahmad Rizki',
      position: 'Kepala Keluarga',
      message: 'Beras Indragiri Hilir adalah pilihan terbaik untuk keluarga kami. Kualitasnya konsisten dan harga terjangkau.',
      date: '2024-05-20',
      featured: true
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      position: 'Ibu Rumah Tangga',
      message: 'Sudah 2 tahun berlangganan beras dari sini. Anak-anak suka karena nasinya pulen dan wangi.',
      date: '2024-05-18',
      featured: false
    },
    {
      id: 3,
      name: 'Budi Santoso',
      position: 'Pengusaha Warung',
      message: 'Untuk usaha warung saya, beras ini sangat membantu. Kualitas bagus dengan harga bersaing.',
      date: '2024-05-15',
      featured: true
    },
    {
      id: 4,
      name: 'Maya Sari',
      position: 'Pegawai Swasta',
      message: 'Pelayanan ramah dan pengiriman selalu tepat waktu. Sangat merekomendasikan!',
      date: '2024-05-12',
      featured: false
    }
  ];

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (testimonial: any) => {
    setEditingTestimonial(testimonial);
    setIsDialogOpen(true);
  };

  const handleDelete = (testimonialId: number) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      console.log('Delete testimonial:', testimonialId);
      // Implement delete logic here
    }
  };

  const TestimonialForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Customer Name</Label>
        <Input id="name" placeholder="Enter customer name" />
      </div>
      <div>
        <Label htmlFor="position">Position/Role</Label>
        <Input id="position" placeholder="e.g., Ibu Rumah Tangga" />
      </div>
      <div>
        <Label htmlFor="message">Testimonial Message</Label>
        <textarea 
          id="message"
          className="w-full p-2 border rounded-md h-24"
          placeholder="Enter testimonial message"
        />
      </div>
      <div className="flex items-center space-x-2">
        <input type="checkbox" id="featured" />
        <Label htmlFor="featured">Featured Testimonial</Label>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
          Cancel
        </Button>
        <Button className="bg-forest-600 hover:bg-forest-700">
          {editingTestimonial ? 'Update' : 'Add'} Testimonial
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-forest-800">Testimonial Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-forest-600 hover:bg-forest-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTestimonial ? 'Edit' : 'Add New'} Testimonial</DialogTitle>
            </DialogHeader>
            <TestimonialForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search testimonials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Table */}
      <Card>
        <CardHeader>
          <CardTitle>Testimonials ({filteredTestimonials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTestimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.position}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm line-clamp-2">{testimonial.message}</p>
                  </TableCell>
                  <TableCell>{testimonial.date}</TableCell>
                  <TableCell>
                    {testimonial.featured ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(testimonial)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(testimonial.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTestimonials;
