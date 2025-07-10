import React, { useState } from 'react';
import { BookOpen, FileText, Video, Headphones, Download, Search, Filter, Star, Clock, Eye, Play, Users } from 'lucide-react';

const Resources = () => {
  const [activeTab, setActiveTab] = useState('resumos');
  const [searchTerm, setSearchTerm] = useState('');

  const resumos = [
    {
      id: 1,
      titulo: 'Direitos Fundamentais na CF/88',
      disciplina: 'Direito Constitucional',
      tipo: 'Resumo',
      paginas: 12,
      visualizacoes: 2847,
      rating: 4.8,
      tags: ['Direitos Fundamentais', 'Constituição', 'Eficácia'],
      descricao: 'Resumo completo sobre direitos fundamentais, incluindo características, classificações e eficácia.',
      autor: 'Prof. Ana Silva'
    },
    {
      id: 2,
      titulo: 'Contratos - Teoria Geral',
      disciplina: 'Direito Civil',
      tipo: 'Mapa Mental',
      paginas: 8,
      visualizacoes: 1923,
      rating: 4.9,
      tags: ['Contratos', 'Teoria Geral', 'Código Civil'],
      descricao: 'Mapa mental abrangente sobre a teoria geral dos contratos no direito civil brasileiro.',
      autor: 'Prof. Carlos Santos'
    },
    {
      id: 3,
      titulo: 'Crimes contra a Vida',
      disciplina: 'Direito Penal',
      tipo: 'Flashcards',
      paginas: 25,
      visualizacoes: 3156,
      rating: 4.7,
      tags: ['Crimes', 'Vida', 'Código Penal'],
      descricao: 'Conjunto de flashcards para memorização dos crimes contra a vida e suas características.',
      autor: 'Prof. Maria Oliveira'
    }
  ];

  const videos = [
    {
      id: 1,
      titulo: 'Princípios Constitucionais Fundamentais',
      disciplina: 'Direito Constitucional',
      duracao: '45:30',
      visualizacoes: 15420,
      rating: 4.9,
      professor: 'Prof. Ana Silva',
      tags: ['Princípios', 'Constituição', 'Fundamentos'],
      thumbnail: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      descricao: 'Aula completa sobre os princípios fundamentais da Constituição Federal'
    },
    {
      id: 2,
      titulo: 'Responsabilidade Civil - Conceitos',
      disciplina: 'Direito Civil',
      duracao: '38:15',
      visualizacoes: 12890,
      rating: 4.8,
      professor: 'Prof. Carlos Santos',
      tags: ['Responsabilidade', 'Civil', 'Danos'],
      thumbnail: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      descricao: 'Conceitos fundamentais da responsabilidade civil e suas aplicações'
    },
    {
      id: 3,
      titulo: 'Teoria do Crime - Elementos',
      disciplina: 'Direito Penal',
      duracao: '52:20',
      visualizacoes: 18750,
      rating: 4.9,
      professor: 'Prof. Maria Oliveira',
      tags: ['Teoria', 'Crime', 'Elementos'],
      thumbnail: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      descricao: 'Análise detalhada dos elementos que compõem a teoria do crime'
    }
  ];

  const audios = [
    {
      id: 1,
      titulo: 'Podcast: Novidades do STF',
      disciplina: 'Direito Constitucional',
      duracao: '28:45',
      downloads: 5420,
      rating: 4.7,
      tags: ['STF', 'Jurisprudência', 'Novidades'],
      descricao: 'Análise das principais decisões recentes do Supremo Tribunal Federal.',
      host: 'Dr. João Silva'
    },
    {
      id: 2,
      titulo: 'Áudio Resumo: Processo Civil',
      disciplina: 'Direito Processual Civil',
      duracao: '35:20',
      downloads: 3890,
      rating: 4.8,
      tags: ['Processo', 'Civil', 'CPC'],
      descricao: 'Resumo em áudio dos principais pontos do Código de Processo Civil.',
      host: 'Dra. Ana Costa'
    }
  ];

  const jurisprudencias = [
    {
      id: 1,
      titulo: 'STF - Direito ao Esquecimento',
      tribunal: 'STF',
      numero: 'RE 1.010.606',
      data: '2021-02-11',
      disciplina: 'Direito Constitucional',
      ementa: 'Direito ao esquecimento. Incompatibilidade com a Constituição Federal...',
      tags: ['Direito ao Esquecimento', 'Liberdade de Expressão', 'Dignidade'],
      relevancia: 'Alta'
    },
    {
      id: 2,
      titulo: 'STJ - Responsabilidade Civil Digital',
      tribunal: 'STJ',
      numero: 'REsp 1.679.465',
      data: '2020-08-25',
      disciplina: 'Direito Civil',
      ementa: 'Responsabilidade civil por danos morais. Redes sociais...',
      tags: ['Responsabilidade Civil', 'Danos Morais', 'Internet'],
      relevancia: 'Média'
    }
  ];

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'Resumo':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'Mapa Mental':
        return <BookOpen className="w-5 h-5 text-green-600" />;
      case 'Flashcards':
        return <Star className="w-5 h-5 text-yellow-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRelevanceColor = (relevancia: string) => {
    switch (relevancia) {
      case 'Alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Média':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Baixa':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Recursos Complementares</h1>
              <p className="text-gray-600">Materiais de apoio para potencializar seus estudos</p>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar recursos, temas, professores..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 flex items-center shadow-lg">
              <Filter className="w-4 h-4 mr-2" />
              Filtros Avançados
            </button>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('resumos')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm flex items-center transition-colors ${
                  activeTab === 'resumos'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Resumos e Mapas
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm flex items-center transition-colors ${
                  activeTab === 'videos'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Video className="w-4 h-4 mr-2" />
                Videoaulas
              </button>
              <button
                onClick={() => setActiveTab('audios')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm flex items-center transition-colors ${
                  activeTab === 'audios'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Headphones className="w-4 h-4 mr-2" />
                Podcasts e Áudios
              </button>
              <button
                onClick={() => setActiveTab('jurisprudencias')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm flex items-center transition-colors ${
                  activeTab === 'jurisprudencias'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Jurisprudências
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'resumos' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumos.map((resumo) => (
                  <div key={resumo.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-orange-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                          {getTypeIcon(resumo.tipo)}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-orange-600">{resumo.tipo}</span>
                          <p className="text-xs text-gray-500">{resumo.autor}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">{resumo.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{resumo.titulo}</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{resumo.descricao}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="font-medium text-orange-600">{resumo.disciplina}</span>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {resumo.paginas} pág.
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {resumo.visualizacoes.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resumo.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 font-medium">
                        Visualizar
                      </button>
                      <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'videos' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <div key={video.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-orange-200">
                    <div className="relative group">
                      <img 
                        src={video.thumbnail} 
                        alt={video.titulo}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm font-medium">
                        {video.duracao}
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100">
                          <Play className="w-8 h-8 text-orange-600 ml-1" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{video.titulo}</h3>
                      <p className="text-sm text-orange-600 font-medium mb-2">{video.professor}</p>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{video.descricao}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="font-medium">{video.disciplina}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{video.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {video.visualizacoes.toLocaleString()} views
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {video.duracao}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {video.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium flex items-center justify-center">
                        <Play className="w-4 h-4 mr-2" />
                        Assistir Agora
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'audios' && (
              <div className="space-y-6">
                {audios.map((audio) => (
                  <div key={audio.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-purple-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Headphones className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{audio.titulo}</h3>
                            <p className="text-sm text-purple-600 font-medium">{audio.host}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-gray-700">{audio.rating}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 leading-relaxed">{audio.descricao}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                          <span className="font-medium text-purple-600">{audio.disciplina}</span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {audio.duracao}
                          </span>
                          <span className="flex items-center">
                            <Download className="w-4 h-4 mr-1" />
                            {audio.downloads.toLocaleString()} downloads
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {audio.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex space-x-3">
                          <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium flex items-center">
                            <Play className="w-4 h-4 mr-2" />
                            Reproduzir
                          </button>
                          <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'jurisprudencias' && (
              <div className="space-y-6">
                {jurisprudencias.map((juris) => (
                  <div key={juris.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-green-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{juris.titulo}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="font-medium text-green-600">{juris.tribunal}</span>
                              <span>{juris.numero}</span>
                              <span>{new Date(juris.data).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRelevanceColor(juris.relevancia)}`}>
                        {juris.relevancia}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4 leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                      <strong>Ementa:</strong> {juris.ementa}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {juris.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-3">
                        <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 text-sm font-medium">
                          Ver Inteiro Teor
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 text-sm font-medium px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                          Salvar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;