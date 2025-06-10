
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { useBlog } from '@/hooks/useBlogs';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: blogData, isLoading, error } = useBlog(id!);
  const blog = blogData?.data;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading blog...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg text-red-600">Blog tidak ditemukan</p>
          <Button onClick={() => navigate('/blog')} className="mt-4">
            Kembali ke Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate('/blog')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Blog
      </Button>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div 
            className="w-full h-64 md:h-96 bg-cover bg-center rounded-lg mb-6"
            style={{ backgroundImage: `url(${blog.image})` }}
          />
          
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-forest-800">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{blog.Author.User.fullname}</span>
              </div>
              <Badge variant={blog.isPublished ? "default" : "secondary"}>
                {blog.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {blog.metaDesc}
            </p>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <div 
            className="text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }}
          />
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
