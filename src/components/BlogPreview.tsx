
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, User } from 'lucide-react';
import { useBlogs } from '@/hooks/useBlogs';

const BlogPreview = () => {
  const { data: blogsData } = useBlogs();

  const blogs = blogsData?.data?.filter(blog => blog.isPublished)?.slice(0, 3) || [];
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-16 bg-earth-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-800 mb-4">
            Blog & Artikel
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pelajari lebih lanjut tentang pertanian berkelanjutan, resep, dan manfaat beras berkualitas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {blogs.map((blog) => (
            <Card key={blog.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative overflow-hidden">
                <Link to={`/blog/${blog.id}`}>
                  <div
                    className="h-48 bg-cover bg-center transition-transform duration-300 hover:scale-110"
                    style={{ backgroundImage: `url(${blog.image})` }}
                  />
                </Link>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{blog.Author.User.fullname}</span>
                  </div>
                </div>
                <Link to={`/blog/${blog.id}`}>
                  <h3 className="text-xl font-semibold text-forest-800 hover:text-forest-600 transition-colors mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                </Link>
                <p className="text-muted-foreground line-clamp-3 mb-4">
                  {blog.metaDesc}
                </p>
                <Link to={`/blog/${blog.id}`}>
                  <Button variant="outline" size="sm" className="border-forest-600 text-forest-600 hover:bg-forest-600 hover:text-white">
                    Baca Selengkapnya
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/blog">
            <Button size="lg" variant="outline" className="border-forest-600 text-forest-600 hover:bg-forest-600 hover:text-white">
              Lihat Semua Artikel
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
