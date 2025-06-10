
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Blog } from '@/services/blogService';

interface BlogTableProps {
  posts: Blog[];
  onEdit: (post: Blog) => void;
  onDelete: (postId: string) => void;
}

const BlogTable = ({ posts, onEdit, onDelete }: BlogTableProps) => {
  const [selectedPost, setSelectedPost] = useState<Blog | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const getStatusBadge = (isPublished: boolean) => {
    return isPublished
      ? <Badge className="bg-green-500">Published</Badge>
      : <Badge className="bg-yellow-500">Draft</Badge>;
  };

  const handlePreview = (post: Blog) => {
    setSelectedPost(post);
    setIsPreviewOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{post.title}</p>
                    </div>
                  </TableCell>
                  <TableCell>{post.Author.User.fullname}</TableCell>
                  <TableCell>{formatDate(post.createdAt)}</TableCell>
                  <TableCell>{getStatusBadge(post.isPublished)}</TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {post.content || truncateContent(post.content)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePreview(post)}
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(post.id)}
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

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Blog Post Preview</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              {selectedPost.image && (
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{selectedPost.title}</h1>
                  <p className="text-sm text-gray-500">
                    By {selectedPost.Author.User.fullname} • {formatDate(selectedPost.createdAt)}
                  </p>
                </div>
                {getStatusBadge(selectedPost.isPublished)}
              </div>
              <p className="text-lg text-gray-600 italic">{selectedPost.metaDesc}</p>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{selectedPost.content}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogTable;
