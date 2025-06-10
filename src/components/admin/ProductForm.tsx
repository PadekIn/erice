
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProductFormProps {
  editingProduct: any;
  onClose: () => void;
}

const ProductForm = ({ editingProduct, onClose }: ProductFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" placeholder="Enter product name" />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <select className="w-full p-2 border rounded-md">
            <option value="">Select category</option>
            <option value="premium">Premium</option>
            <option value="medium">Medium</option>
            <option value="organic">Organic</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (Rp)</Label>
          <Input id="price" type="number" placeholder="0" />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" placeholder="0" />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea 
          id="description"
          className="w-full p-2 border rounded-md h-24"
          placeholder="Enter product description"
        />
      </div>
      <div>
        <Label htmlFor="image">Product Image</Label>
        <Input id="image" type="file" accept="image/*" />
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button className="bg-forest-600 hover:bg-forest-700">
          {editingProduct ? 'Update' : 'Add'} Product
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;
