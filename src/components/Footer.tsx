
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
              Bringing you the finest quality rice from the fertile lands of Indragiri Hilir,
              supporting local farmers and sustainable agriculture.
            </p>
            <div className="flex items-center space-x-2 text-sm text-forest-200">
              <MapPin className="h-4 w-4" />
              <span>Indragiri Hilir, Riau, Indonesia</span>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-16'>
            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
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
              <h4 className="text-lg font-semibold">Customer Service</h4>
              <ul className="space-y-2">
                <li><Link to="/cart" className="text-forest-200 hover:text-white transition-colors">Shopping Cart</Link></li>
                <li><Link to="/orders" className="text-forest-200 hover:text-white transition-colors">Order History</Link></li>
                <li><Link to="/login" className="text-forest-200 hover:text-white transition-colors">Account</Link></li>
                <li><a href="#" className="text-forest-200 hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="text-forest-200 hover:text-white transition-colors">Returns</a></li>
              </ul>
            </div>

            {/* About */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Our Mission</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-forest-200 hover:text-white transition-colors">Sustainability</a></li>
                <li><a href="#" className="text-forest-200 hover:text-white transition-colors">Local Farmers</a></li>
                <li><a href="#" className="text-forest-200 hover:text-white transition-colors">Quality Promise</a></li>
                <li><a href="#" className="text-forest-200 hover:text-white transition-colors">Community Impact</a></li>
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
