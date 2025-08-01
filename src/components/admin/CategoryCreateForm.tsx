
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG } from '@/config/api';

interface CategoryCreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const getErrorMessage = (data: any, fallbackMessage: string) => {
  if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors.map((err: any) => err.message || err).join(', ');
  }
  return data?.message || fallbackMessage;
};

const CategoryCreateForm = ({ onSuccess, onCancel }: CategoryCreateFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateCategory = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.status) {
        toast({
          title: "Success",
          description: "Category created successfully"
        });
        onSuccess();
      } else {
        const errorMessage = getErrorMessage(data, "Failed to create category");
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Category Name</Label>
        <Input 
          id="name" 
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter category name" 
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea 
          id="description"
          className="w-full p-2 border rounded-md h-20"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter category description"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button 
          className="bg-forest-600 hover:bg-forest-700" 
          onClick={handleCreateCategory}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Add Category'}
        </Button>
      </div>
    </div>
  );
};

export default CategoryCreateForm;
