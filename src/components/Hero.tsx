
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Hero = () => {


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-12 pl-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="rice-pattern w-full h-full"></div>
        </div>

        {/* Main Content Container */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="space-y-8 text-left">
              {/* Welcome Message */}
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-semibold text-forest-700">
                  Selamat Datang di <span className="font-bold text-forest-600">E-Rice</span>
                </h2>
              </div>
              {/* Logo/Brand */}
              <div className="flex items-center mb-6 w-xs md:w-[600px]">
                <img src="/img/head.png" alt="Palm Tree Logo" className="w-full h-full object-contain" />
              </div>

              <div className="space-y-4">
                <h4 className="text-lg md:text-xl text-forest-700 italic">
                  Cita Rasa Negeri Hamparan Kelapa Dunia
                </h4>
              </div>

              {/* Features List */}
              <div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded bg-forest-600 flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-forest-800">Beras lokal berkualitas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded bg-forest-600 flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-forest-800">Dikelola koperasi Karim</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded bg-forest-600 flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-forest-800">Dukungan program ketahanan pangan</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button className="bg-forest-600 hover:bg-forest-700 text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105">
                    Belanja Sekarang
                  </Button>
                </Link>
                <Link to="/about">
                  <Button className="bg-white border border-forest-600 text-forest-600 hover:bg-forest-600 hover:text-white px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105">
                    Pelajari lebih lanjut
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Content - Product Image */}
            <div className="relative flex justify-center items-center md:pt-20 md:pl-20">
              {/* Circular Background */}
              <div className="absolute w-96 h-96 bg-gradient-to-br from-rice-200 to-rice-300 rounded-full opacity-50"></div>

              {/* Product Image */}
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-300">
                <img
                  src="/img/product.png"
                  alt="Beras Indragiri Hilir Premium"
                  className="w-full max-w-[150px] md:max-w-sm h-auto object-contain drop-shadow-2xl"
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-10 right-10 w-20 h-20 bg-rice-200 rounded-full opacity-30 animate-pulse"></div>
              <div className="absolute bottom-20 left-10 w-16 h-16 bg-forest-200 rounded-full opacity-40 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Blog Section */}
      {/* {blogs.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-forest-800 mb-4">
                Artikel Terbaru
              </h2>
              <p className="text-lg text-muted-foreground">
                Baca artikel terbaru tentang beras dan pertanian
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                        <span>{blog.Author.fullname}</span>
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
            <div className="text-center mt-12">
              <Link to="/blog">
                <Button className="bg-forest-600 hover:bg-forest-700 text-white px-8 py-3">
                  Lihat Semua Artikel
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )} */}
    </div>
  );
};

export default Hero;
