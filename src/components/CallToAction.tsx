
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-forest-600 to-forest-700 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 indonesian-pattern opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Bergabunglah dengan Gerakan Pertanian Berkelanjutan
          </h2>
          <p className="text-lg md:text-xl text-forest-100 leading-relaxed">
            Dukung petani lokal Indragiri Hilir dengan memilih beras berkualitas tinggi.
            Setiap pembelian Anda berkontribusi pada kesejahteraan petani dan kelestarian lingkungan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/products">
              <Button size="lg" className="bg-white text-forest-700 hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105">
                Mulai Berbelanja
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-white transition-all duration-300 transform hover:scale-105 text-forest-800 dark:text-white hover:bg-white hover:text-forest-700 px-8 py-6 text-lg font-semibold rounded-full">
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
