
import { Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-coral-400 bg-clip-text text-transparent">
              EventHub
            </h3>
            <p className="text-gray-400 mt-2">Connecting communities through events</p>
            <p className="text-gray-400 text-sm mt-1">
              Contact: <a href="mailto:hello@eventhub.com" className="text-teal-400 hover:text-teal-300">hello@eventhub.com</a>
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-gray-800 rounded-full hover:bg-blue-700 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-gray-800 rounded-full hover:bg-pink-600 transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; 2024 EventHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
