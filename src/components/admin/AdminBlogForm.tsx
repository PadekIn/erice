
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateBlog, useUpdateBlog } from '@/hooks/useBlogs';
import { Blog } from '@/services/blogService';
import { Loader2, Image as ImageIcon, X } from 'lucide-react';

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

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        metaDesc: blog.metaDesc,
        content: blog.content,
        image: null,
        isPublished: blog.isPublished,
      });
      if (blog.image) {
        setImagePreview(blog.image);
      }
    }
  }, [blog]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.metaDesc.trim()) {
      newErrors.metaDesc = 'Meta description is required';
    } else if (formData.metaDesc.length < 10) {
      newErrors.metaDesc = 'Meta description must be at least 10 characters';
    } else if (formData.metaDesc.length > 300) {
      newErrors.metaDesc = 'Meta description must be less than 300 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }

    if (!blog && !formData.image) {
      newErrors.image = 'Image is required for new blog posts';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear image error
      setErrors(prev => {
        const { image, ...rest } = prev;
        return rest;
      });
    } else {
      setFormData(prev => ({ ...prev, image: null }));
      setImagePreview(blog?.image || null);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(blog?.image || null);
    
    // Reset file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title.trim());
    formDataToSend.append('metaDesc', formData.metaDesc.trim());
    formDataToSend.append('content', formData.content.trim());
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

  const isLoading = createBlogMutation.isPending || updateBlogMutation.isPending;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{blog ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, title: e.target.value }));
                if (errors.title) {
                  setErrors(prev => {
                    const { title, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              placeholder="Enter blog post title..."
              className={errors.title ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.title.length}/200 characters
            </p>
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <Label htmlFor="metaDesc">Meta Description *</Label>
            <Textarea
              id="metaDesc"
              value={formData.metaDesc}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, metaDesc: e.target.value }));
                if (errors.metaDesc) {
                  setErrors(prev => {
                    const { metaDesc, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              placeholder="Brief description for SEO and previews..."
              className={`resize-none ${errors.metaDesc ? 'border-red-500' : ''}`}
              rows={3}
              disabled={isLoading}
            />
            {errors.metaDesc && (
              <p className="text-sm text-red-600">{errors.metaDesc}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.metaDesc.length}/300 characters
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, content: e.target.value }));
                if (errors.content) {
                  setErrors(prev => {
                    const { content, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              placeholder="Write your blog post content here..."
              className={`resize-none min-h-[200px] ${errors.content ? 'border-red-500' : ''}`}
              disabled={isLoading}
            />
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.content.length} characters (minimum 50)
            </p>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">
              Featured Image {!blog && '*'}
            </Label>
            
            {imagePreview && (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 bg-white"
                  onClick={removeImage}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={errors.image ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              <ImageIcon className="h-5 w-5 text-gray-400" />
            </div>
            
            {errors.image && (
              <p className="text-sm text-red-600">{errors.image}</p>
            )}
            
            <p className="text-xs text-gray-500">
              Supported formats: JPG, PNG, GIF (max 5MB)
            </p>
          </div>

          {/* Published Status */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, isPublished: checked as boolean }))
              }
              disabled={isLoading}
            />
            <Label htmlFor="isPublished" className="text-sm font-medium">
              Publish immediately
            </Label>
          </div>

          {formData.isPublished && (
            <Alert>
              <AlertDescription>
                This blog post will be visible to all users once saved.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-forest-600 hover:bg-forest-700"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {blog ? 'Update Post' : 'Create Post'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminBlogForm;
