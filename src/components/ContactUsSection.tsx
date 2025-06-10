
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactUsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-800">
            Hubungi Kami
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kami siap membantu Anda dengan pertanyaan tentang produk, 
            pemesanan, atau kerjasama bisnis. Jangan ragu untuk menghubungi kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-forest-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-forest-100 rounded-lg flex items-center justify-center mx-auto">
                <MapPin className="h-6 w-6 text-forest-600" />
              </div>
              <h3 className="font-semibold text-forest-800">Alamat</h3>
              <p className="text-sm text-gray-600">
                Jl. Raya Indragiri Hilir<br />
                Tembilahan, Riau 29212<br />
                Indonesia
              </p>
            </CardContent>
          </Card>

          <Card className="border-forest-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-forest-100 rounded-lg flex items-center justify-center mx-auto">
                <Phone className="h-6 w-6 text-forest-600" />
              </div>
              <h3 className="font-semibold text-forest-800">Telepon</h3>
              <p className="text-sm text-gray-600">
                +62 768 123 456<br />
                +62 812 3456 7890
              </p>
            </CardContent>
          </Card>

          <Card className="border-forest-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-forest-100 rounded-lg flex items-center justify-center mx-auto">
                <Mail className="h-6 w-6 text-forest-600" />
              </div>
              <h3 className="font-semibold text-forest-800">Email</h3>
              <p className="text-sm text-gray-600">
                info@berasindragirihilir.com<br />
                order@berasindragirihilir.com
              </p>
            </CardContent>
          </Card>

          <Card className="border-forest-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-forest-100 rounded-lg flex items-center justify-center mx-auto">
                <Clock className="h-6 w-6 text-forest-600" />
              </div>
              <h3 className="font-semibold text-forest-800">Jam Operasional</h3>
              <p className="text-sm text-gray-600">
                Senin - Jumat: 08:00 - 17:00<br />
                Sabtu: 08:00 - 12:00
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link to="/contact">
            <Button size="lg" className="bg-forest-600 hover:bg-forest-700 text-white">
              Kirim Pesan
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContactUsSection;
