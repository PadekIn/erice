
import { Link } from 'react-router-dom';
import { MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-forest-800 text-forest-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between gap-4">
          {/* Brand */}
          <div className="space-y-4 md:w-1/2">
            <div className="flex items-center space-x-2 w-[250px] bg-rice-300 rounded-2xl px-4 py-2">
              <img src="/img/head.png" alt="logo" />
            </div>
            <p className="text-forest-200 text-lg">
              Memberikan Anda beras kualitas terbaik dari tanah subur Indragiri Hilir, mendukung petani lokal dan pertanian berkelanjutan.
            </p>
            <div className="flex items-center space-x-2 text-sm text-forest-200">
              <MapPin className="h-4 w-4" />
              <span>Indragiri Hilir, Riau, Indonesia</span>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-16'>
            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Tautan Cepat</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-forest-200 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/products" className="text-forest-200 hover:text-white transition-colors">Products</Link></li>
                <li><Link to="/about" className="text-forest-200 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/blog" className="text-forest-200 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/testimonials" className="text-forest-200 hover:text-white transition-colors">Testimonials</Link></li>
                <li><Link to="/contact" className="text-forest-200 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Service</h4>
              <ul className="space-y-2">
                <li><Link to="/cart" className="text-forest-200 hover:text-white transition-colors">Keranjang Belanja</Link></li>
                <li><Link to="/orders" className="text-forest-200 hover:text-white transition-colors">Riwayat Pesanan</Link></li>
                <li><Link to="/login" className="text-forest-200 hover:text-white transition-colors">Akun</Link></li>
              </ul>
            </div>

            {/* About */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Misi Kami</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-forest-200 hover:text-white transition-colors">Terjangkau</a></li>
                <li><a href="#" className="text-forest-200 hover:text-white transition-colors">Premium</a></li>
                <li><a href="#" className="text-forest-200 hover:text-white transition-colors">Pemberdayaan</a></li>
                <li><a href="#" className="text-forest-200 hover:text-white transition-colors">Ketahanan</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-forest-600 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-forest-200 text-sm">
              © 2025 Beras Indragiri Hilir. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-forest-200 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for Indonesian farmers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
