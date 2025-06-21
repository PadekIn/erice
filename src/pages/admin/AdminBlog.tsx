
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useBlogs, useDeleteBlog } from '@/hooks/useBlogs';
import BlogFilters from '@/components/admin/BlogFilters';
import BlogTable from '@/components/admin/BlogTable';
import AdminBlogForm from '@/components/admin/AdminBlogForm';
import { Blog } from '@/services/blogService';

const AdminBlog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Blog | null>(null);

  const { data: blogsData, isLoading } = useBlogs();
  const deletePostMutation = useDeleteBlog();

  const blogs = blogsData?.data || [];

  const filteredPosts = blogs.filter(blog => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.metaDesc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'published' && blog.isPublished) ||
      (statusFilter === 'draft' && !blog.isPublished);
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (post: Blog) => {
    setEditingPost(post);
    setIsDialogOpen(true);
  };

  const handleDelete = (postId: string) => {
    deletePostMutation.mutate(postId);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingPost(null);
  };

  if (isLoading) {
    return <div className="p-6">Loading blogs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-forest-800">Blog Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-forest-600 hover:bg-forest-700">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? 'Edit' : 'Create New'} Blog Post</DialogTitle>
            </DialogHeader>
            <AdminBlogForm
              blog={editingPost}
              onClose={handleDialogClose}
            />
          </DialogContent>
        </Dialog>
      </div>

      <BlogFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <BlogTable
        posts={filteredPosts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminBlog;
