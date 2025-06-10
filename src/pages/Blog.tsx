
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBlogs } from '@/hooks/useBlogs';

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  const { data: blogsData, isLoading } = useBlogs();
  const allBlogs = blogsData?.data?.filter(blog => blog.isPublished) || [];

  // Calculate pagination
  const totalPages = Math.ceil(allBlogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const endIndex = startIndex + blogsPerPage;
  const currentBlogs = allBlogs.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-forest-800 mb-4">
          Blog & Artikel
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Pelajari lebih lanjut tentang pertanian berkelanjutan, manfaat beras organik,
          resep tradisional, dan tips praktis seputar beras berkualitas
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {currentBlogs.map((blog, index) => (
          <Card key={blog.id} className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="relative overflow-hidden">
              <Link to={`/blog/${blog.id}`}>
                <div
                  className="h-48 bg-cover bg-center transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                  style={{ backgroundImage: `url(${blog.image})` }}
                />
              </Link>
              <div className="absolute top-4 left-4">
                <Badge variant={blog.isPublished ? "default" : "secondary"}>
                  {blog.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
            <CardHeader className="space-y-2">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
              </div>
              <Link to={`/blog/${blog.id}`}>
                <h3 className="text-xl font-semibold text-forest-800 group-hover:text-forest-600 transition-colors line-clamp-2 cursor-pointer">
                  {blog.title}
                </h3>
              </Link>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{blog.Author.User.fullname}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground line-clamp-3">
                {blog.metaDesc ? truncateText(blog.metaDesc) : ""}
              </p>
              <Link to={`/blog/${blog.id}`} className="block">
                <div className="flex items-center text-forest-600 hover:text-forest-700 transition-colors pt-2">
                  <span className="text-sm font-medium">Baca Selengkapnya</span>
                  <ArrowUp className="h-4 w-4 ml-1 rotate-45" />
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? "bg-forest-600 hover:bg-forest-700" : ""}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {allBlogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Belum ada artikel yang tersedia.
          </p>
        </div>
      )}
    </div>
  );
};

export default Blog;
