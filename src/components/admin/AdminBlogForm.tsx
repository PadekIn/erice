
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateBlog, useUpdateBlog } from '@/hooks/useBlogs';
import { Blog } from '@/services/blogService';

interface AdminBlogFormProps {
  blog?: Blog | null;
  onClose: () => void;
}

const AdminBlogForm = ({ blog, onClose }: AdminBlogFormProps) => {
  const createBlogMutation = useCreateBlog();
  const updateBlogMutation = useUpdateBlog();

  const [formData, setFormData] = useState({
    title: '',
    metaDesc: '',
    content: '',
    image: null as File | null,
    isPublished: false,
  });

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        metaDesc: blog.metaDesc,
        content: blog.content,
        image: null,
        isPublished: blog.isPublished,
      });
    }
  }, [blog]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('metaDesc', formData.metaDesc);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('isPublished', formData.isPublished.toString());
    
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      if (blog) {
        await updateBlogMutation.mutateAsync({ id: blog.id, formData: formDataToSend });
      } else {
        await createBlogMutation.mutateAsync(formDataToSend);
      }
      onClose();
    } catch (error) {
      console.error('Error submitting blog:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="metaDesc">Meta Description</Label>
        <textarea
          id="metaDesc"
          className="w-full p-2 border rounded-md h-20"
          value={formData.metaDesc}
          onChange={(e) => setFormData(prev => ({ ...prev, metaDesc: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <textarea
          id="content"
          className="w-full p-2 border rounded-md h-40"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          {...(!blog && { required: true })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isPublished"
          checked={formData.isPublished}
          onCheckedChange={(checked) => 
            setFormData(prev => ({ ...prev, isPublished: checked as boolean }))
          }
        />
        <Label htmlFor="isPublished">Published</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-forest-600 hover:bg-forest-700"
          disabled={createBlogMutation.isPending || updateBlogMutation.isPending}
        >
          {blog ? 'Update' : 'Create'} Post
        </Button>
      </div>
    </form>
  );
};

export default AdminBlogForm;
