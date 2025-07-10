import React from 'react';
import { BookOpen, Clock, BarChart3, FileText, Home, Brain } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation = ({ currentPage, onPageChange }: NavigationProps) => {
  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'questions', label: 'Banco de Questões', icon: BookOpen },
    { id: 'simulados', label: 'Simulados', icon: Clock },
    { id: 'analytics', label: 'Análise de Desempenho', icon: BarChart3 },
    { id: 'resources', label: 'Recursos', icon: FileText },
    { id: 'ai-tools', label: 'Ferramentas IA', icon: Brain }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex items-center space-x-2 py-4 px-3 border-b-2 transition-colors whitespace-nowrap ${
                currentPage === item.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;