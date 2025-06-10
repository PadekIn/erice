
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AboutUsSection = () => {
  return (
    <section id="about-us" className="py-16 bg-rice-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 justify-between items-center md:px-24">
          {/* Content */}
          <div className="space-y-4 md:w-1/2">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-forest-900 leading-tight flex flex-col">
                <span>Mewujudkan <span className='text-forest-300 font-bold'>Ketahanan Pangan</span></span>
                <span>Melalui Kolaborasi Daerah</span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Program Beras Indragiri merupakan bagian dari inisiatif ketahanan pangan di Kabupaten Indragiri Hilir, Riau. Berangkat dari keresahan petani lokal atas harga gabah yang tidak stabil, program ini hadir sebagai solusi untuk meningkatkan kesejahteraan petani sekaligus mendukung distribusi beras lokal yang berkualitas tinggi.
                Beras Indragiri dikelola melalui kerja sama antara TNI AD dan Pemerintah Daerah. Salah satu langkah strategis yang dilakukan adalah kegiatan tanam serentak pada tahun 2024, yang bertujuan untuk mempercepat siklus panen dan meningkatkan volume produksi beras.
              </p>
            </div>

            <Link to="/about">
              <Button size="lg" className="bg-forest-600 hover:bg-forest-700 text-white mt-8">
                Pelajari Lebih Lanjut
              </Button>
            </Link>
          </div>

          {/* Image */}
          <div className="w-fit">
            <img
              src="/img/smile-rice.png"
              alt="Petani di sawah Indragiri Hilir"
              className="w-[350px] object-cover rounded-xl overflow-hidden shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
