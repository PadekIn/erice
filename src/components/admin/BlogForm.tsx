
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface Tag {
  id: number;
  name: string;
  color: string;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  status: 'draft' | 'published';
  author: string;
  publishDate: string;
  views: number;
  tags?: Tag[];
}

interface BlogFormProps {
  post?: BlogPost | null;
  availableTags: Tag[];
  onSubmit: (postData: Omit<BlogPost, 'id' | 'views'>) => void;
  onCancel: () => void;
}

const BlogForm = ({ post, availableTags, onSubmit, onCancel }: BlogFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    status: 'draft' as 'draft' | 'published',
    author: 'Admin',
    publishDate: new Date().toISOString().split('T')[0],
    tags: [] as Tag[]
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        status: post.status,
        author: post.author,
        publishDate: post.publishDate,
        tags: post.tags || []
      });
    }
  }, [post]);

  const handleTagToggle = (tag: Tag, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.filter(t => t.id !== tag.id)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
        <Label htmlFor="excerpt">Excerpt</Label>
        <textarea
          id="excerpt"
          className="w-full p-2 border rounded-md h-20"
          value={formData.excerpt}
          onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
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
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          type="url"
          value={formData.image}
          onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          value={formData.author}
          onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="publishDate">Publish Date</Label>
        <Input
          id="publishDate"
          type="date"
          value={formData.publishDate}
          onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label>Tags</Label>
        <div className="space-y-2 mt-2">
          {availableTags.map((tag) => (
            <div key={tag.id} className="flex items-center space-x-2">
              <Checkbox
                id={`tag-${tag.id}`}
                checked={formData.tags.some(t => t.id === tag.id)}
                onCheckedChange={(checked) => handleTagToggle(tag, checked as boolean)}
              />
              <Badge style={{ backgroundColor: tag.color, color: 'white' }}>
                {tag.name}
              </Badge>
            </div>
          ))}
        </div>
        {formData.tags.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">Selected tags:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {formData.tags.map((tag) => (
                <Badge key={tag.id} style={{ backgroundColor: tag.color, color: 'white' }}>
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <Label>Status</Label>
        <div className="flex space-x-4 mt-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="draft"
              checked={formData.status === 'draft'}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
            />
            <span>Draft</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="published"
              checked={formData.status === 'published'}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
            />
            <span>Published</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-forest-600 hover:bg-forest-700">
          {post ? 'Update' : 'Create'} Post
        </Button>
      </div>
    </form>
  );
};

export default BlogForm;
