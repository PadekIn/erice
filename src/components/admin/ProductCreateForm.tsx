
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateProduct } from '@/hooks/useProducts';
import { Category } from '@/services/categoryService';

interface ProductCreateFormProps {
  onClose: () => void;
  categories: Category[];
}

const ProductCreateForm = ({ onClose, categories }: ProductCreateFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: '',
    stock: '',
    weight: '',
    categoryProductId: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const createProductMutation = useCreateProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('unit', formData.unit);
    formDataToSend.append('stock', formData.stock);
    formDataToSend.append('weight', formData.weight);
    formDataToSend.append('categoryProductId', formData.categoryProductId);
    
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    createProductMutation.mutate(formDataToSend, {
      onSuccess: () => {
        onClose();
        setFormData({
          name: '',
          description: '',
          price: '',
          unit: '',
          stock: '',
          weight: '',
          categoryProductId: '',
        });
        setImageFile(null);
      }
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter product name"
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.categoryProductId} onValueChange={(value) => handleInputChange('categoryProductId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter product description"
          className="h-24"
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price (Rp)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="0"
            required
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => handleInputChange('stock', e.target.value)}
            placeholder="0"
            required
          />
        </div>
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            step="0.01"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="unit">Unit</Label>
        <Input
          id="unit"
          value={formData.unit}
          onChange={(e) => handleInputChange('unit', e.target.value)}
          placeholder="e.g., kg, pcs, box"
          required
        />
      </div>

      <div>
        <Label htmlFor="image">Product Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-forest-600 hover:bg-forest-700"
          disabled={createProductMutation.isPending}
        >
          {createProductMutation.isPending ? 'Adding...' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductCreateForm;
