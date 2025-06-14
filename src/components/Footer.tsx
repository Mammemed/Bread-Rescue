
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import BreadIcon from './icons/BreadIcon';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-bread-800 text-bread-100 py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <BreadIcon className="h-6 w-6 text-bread-300" />
            <span className="text-xl font-bold text-white">Bread Rescue</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
            <Link to="/" className="text-bread-300 hover:text-white transition-colors text-sm">
              Home
            </Link>
            <Link to="/bakeries" className="text-bread-300 hover:text-white transition-colors text-sm">
              Bakeries
            </Link>
            <Link to="/about" className="text-bread-300 hover:text-white transition-colors text-sm">
              About
            </Link>
            <Link to="/contact" className="text-bread-300 hover:text-white transition-colors text-sm">
              Contact
            </Link>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="text-bread-300 hover:text-white transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-bread-300 hover:text-white transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-bread-300 hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="text-center text-sm text-bread-400 mt-6">
          <p>&copy; {currentYear} Bread Rescue. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
