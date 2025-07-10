import React from 'react';
import { Scale, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin as LinkedIn } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">OAB.AI</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              A plataforma mais avançada para preparação OAB com inteligência artificial. 
              Revolucionando a forma como você se prepara para a advocacia.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <LinkedIn className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Produto</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Funcionalidades</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">IA Integrada</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Simulados</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Correção de Peças</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Plano de Estudos</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Recursos</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Dicas de Estudo</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Jurisprudências</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Suporte</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">contato@oab.ai</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">(11) 9999-9999</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">São Paulo, SP</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Newsletter</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Seu e-mail" 
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg transition-colors">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 OAB.AI. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;