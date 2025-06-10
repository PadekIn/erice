
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Award, Leaf, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: Users,
      title: 'Kemitraan dengan Petani',
      description: 'Kami bekerja sama langsung dengan petani lokal untuk memastikan kualitas terbaik dan harga yang adil.'
    },
    {
      icon: Award,
      title: 'Kualitas Premium',
      description: 'Setiap butir beras melalui proses seleksi ketat untuk memastikan standar kualitas premium.'
    },
    {
      icon: Leaf,
      title: 'Pertanian Berkelanjutan',
      description: 'Menerapkan praktik pertanian ramah lingkungan untuk menjaga kelestarian alam.'
    },
    {
      icon: Heart,
      title: 'Komitmen Sosial',
      description: 'Berkontribusi pada kesejahteraan masyarakat dan pengembangan ekonomi lokal.'
    }
  ];

  const team = [
    {
      name: 'Bapak Ahmad Suryadi',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      description: 'Petani generasi ketiga dengan visi memajukan pertanian Indragiri Hilir.'
    },
    {
      name: 'Ibu Siti Aminah',
      role: 'Head of Quality Control',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      description: 'Ahli dalam kontrol kualitas dengan pengalaman 15 tahun di industri pangan.'
    },
    {
      name: 'Bapak Rahman Hidayat',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      description: 'Mengelola operasional harian dan koordinasi dengan petani mitra.'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-forest-600 to-forest-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Tentang Kami
          </h1>
          <p className="text-xl md:text-2xl text-forest-100 max-w-3xl mx-auto">
            Membangun masa depan pertanian Indonesia yang berkelanjutan 
            dan sejahtera bersama petani Indragiri Hilir
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-forest-800">
                Cerita Kami
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Beras Indragiri Hilir dimulai dari mimpi sederhana untuk mengangkat 
                kualitas beras lokal ke tingkat premium. Didirikan pada tahun 1999 
                oleh keluarga petani yang telah bergelut di dunia pertanian selama 
                puluhan tahun.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Kami percaya bahwa tanah subur Indragiri Hilir mampu menghasilkan 
                beras berkualitas world-class. Dengan dukungan teknologi modern 
                dan tetap mempertahankan kearifan lokal, kami terus berinovasi 
                untuk memberikan yang terbaik.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Hari ini, kami bangga melayani ribuan keluarga Indonesia dengan 
                beras premium yang diproduksi langsung oleh petani mitra kami.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Sawah Indragiri Hilir"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-rice-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-forest-800">
              Nilai-Nilai Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Komitmen kami terhadap kualitas, keberlanjutan, dan kesejahteraan 
              bersama menjadi fondasi dalam setiap langkah yang kami ambil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-forest-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto">
                    <value.icon className="h-8 w-8 text-forest-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-forest-800">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-forest-800">
              Tim Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dibalik setiap butir beras berkualitas, ada tim berpengalaman 
              yang berdedikasi untuk memberikan yang terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-forest-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-forest-800">
                      {member.name}
                    </h3>
                    <p className="text-forest-600 font-medium mb-2">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {member.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-forest-600 to-forest-700 text-white">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Bergabunglah dengan Keluarga Besar Kami
          </h2>
          <p className="text-xl text-forest-100 max-w-2xl mx-auto">
            Mari bersama-sama membangun masa depan pertanian Indonesia 
            yang lebih baik dan berkelanjutan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="bg-white text-forest-700 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                Lihat Produk Kami
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-forest-700 px-8 py-6 text-lg font-semibold">
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
