import React, { useState } from 'react';
import { Clock, Users, Trophy, Play, Settings, BarChart3, CheckCircle, Calendar, Target, Award, TrendingUp, Star, Filter } from 'lucide-react';

const Simulados = () => {
  const [activeTab, setActiveTab] = useState('disponivel');

  const simuladosDisponiveis = [
    {
      id: 1,
      titulo: 'Simulado OAB XXXVII - 1ª Fase',
      tipo: 'Prova Real',
      questoes: 80,
      tempo: 300,
      disciplinas: ['Todas as disciplinas'],
      participantes: 2847,
      dificuldade: 'Oficial',
      status: 'Disponível',
      descricao: 'Simulado completo nos moldes da prova oficial da OAB'
    },
    {
      id: 2,
      titulo: 'Simulado Direito Constitucional',
      tipo: 'Customizado',
      questoes: 20,
      tempo: 60,
      disciplinas: ['Direito Constitucional'],
      participantes: 1523,
      dificuldade: 'Média',
      status: 'Disponível',
      descricao: 'Foco em princípios constitucionais e direitos fundamentais'
    },
    {
      id: 3,
      titulo: 'Simulado 2ª Fase - Penal',
      tipo: 'Discursiva',
      questoes: 4,
      tempo: 300,
      disciplinas: ['Direito Penal', 'Processo Penal'],
      participantes: 892,
      dificuldade: 'Difícil',
      status: 'Disponível',
      descricao: 'Peças processuais e questões discursivas de direito penal'
    }
  ];

  const simuladosRealizados = [
    {
      id: 1,
      titulo: 'Simulado OAB XXXVI - 1ª Fase',
      dataRealizacao: '2024-01-15',
      nota: 68,
      acertos: 54,
      total: 80,
      tempo: 245,
      posicao: 127,
      totalParticipantes: 2156
    },
    {
      id: 2,
      titulo: 'Simulado Direito Civil',
      dataRealizacao: '2024-01-10',
      nota: 85,
      acertos: 17,
      total: 20,
      tempo: 45,
      posicao: 23,
      totalParticipantes: 1834
    }
  ];

  const getDifficultyColor = (dificuldade: string) => {
    switch (dificuldade) {
      case 'Oficial':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Fácil':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Média':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Difícil':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'Prova Real':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Customizado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Discursiva':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Simulados</h1>
              <p className="text-gray-600">Pratique com simulados reais e customizados para 1ª e 2ª fase</p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Simulados Realizados</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
                <p className="text-xs text-gray-500 mt-1">Este mês: 4</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Melhor Nota</p>
                <p className="text-3xl font-bold text-gray-900">85</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <p className="text-xs text-green-600">+12 pontos</p>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Trophy className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Média Geral</p>
                <p className="text-3xl font-bold text-gray-900">72</p>
                <div className="flex items-center mt-1">
                  <Target className="w-3 h-3 text-yellow-500 mr-1" />
                  <p className="text-xs text-yellow-600">Meta: 75</p>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Ranking Atual</p>
                <p className="text-3xl font-bold text-gray-900">#127</p>
                <div className="flex items-center mt-1">
                  <Award className="w-3 h-3 text-purple-500 mr-1" />
                  <p className="text-xs text-purple-600">Top 15%</p>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('disponivel')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'disponivel'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Simulados Disponíveis
              </button>
              <button
                onClick={() => setActiveTab('realizados')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'realizados'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Simulados Realizados
              </button>
              <button
                onClick={() => setActiveTab('criar')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === 'criar'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Criar Simulado
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'disponivel' && (
              <div className="space-y-6">
                {simuladosDisponiveis.map((simulado) => (
                  <div key={simulado.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{simulado.titulo}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(simulado.tipo)}`}>
                            {simulado.tipo}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(simulado.dificuldade)}`}>
                            {simulado.dificuldade}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{simulado.descricao}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTime(simulado.tempo)}
                          </span>
                          <span className="flex items-center">
                            <Target className="w-4 h-4 mr-1" />
                            {simulado.questoes} questões
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {simulado.participantes.toLocaleString()} participantes
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Disciplinas:</p>
                      <div className="flex flex-wrap gap-2">
                        {simulado.disciplinas.map((disc, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                            {disc}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        <button className="text-gray-600 hover:text-gray-800 flex items-center transition-colors">
                          <Settings className="w-4 h-4 mr-1" />
                          Configurar
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 flex items-center transition-colors">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Estatísticas
                        </button>
                      </div>
                      <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl">
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar Simulado
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'realizados' && (
              <div className="space-y-6">
                {simuladosRealizados.map((simulado) => (
                  <div key={simulado.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{simulado.titulo}</h3>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(simulado.dataRealizacao).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTime(simulado.tempo)}
                          </span>
                          <span className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {simulado.acertos}/{simulado.total} acertos
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-gray-900 mb-1">{simulado.nota}</div>
                        <div className="text-sm font-medium text-gray-600">Nota Final</div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                        <div className="text-sm font-medium text-blue-700 mb-1">Taxa de Acerto</div>
                        <div className="text-2xl font-bold text-blue-900">
                          {Math.round((simulado.acertos / simulado.total) * 100)}%
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                        <div className="text-sm font-medium text-green-700 mb-1">Posição no Ranking</div>
                        <div className="text-2xl font-bold text-green-900">
                          #{simulado.posicao}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                        <div className="text-sm font-medium text-purple-700 mb-1">Total de Participantes</div>
                        <div className="text-2xl font-bold text-purple-900">
                          {simulado.totalParticipantes.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Progresso</span>
                          <span className="text-sm font-bold text-gray-900">
                            {Math.round((simulado.acertos / simulado.total) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300" 
                            style={{ width: `${(simulado.acertos / simulado.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                        Ver Relatório Detalhado
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'criar' && (
              <div className="max-w-3xl">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Criar Simulado Personalizado</h3>
                  <p className="text-gray-600">Configure seu simulado de acordo com suas necessidades de estudo</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Simulado</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        placeholder="Ex: Meu Simulado de Direito Civil"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Número de Questões</label>
                        <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                          <option value="10">10 questões</option>
                          <option value="20">20 questões</option>
                          <option value="40">40 questões</option>
                          <option value="80">80 questões (Prova Completa)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tempo Limite</label>
                        <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                          <option value="30">30 minutos</option>
                          <option value="60">1 hora</option>
                          <option value="120">2 horas</option>
                          <option value="300">5 horas (Prova Completa)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Disciplinas</label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {['Direito Constitucional', 'Direito Civil', 'Direito Penal', 'Direito Processual Civil', 'Direito Processual Penal', 'Direito Administrativo'].map((disc) => (
                          <label key={disc} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3" />
                            <span className="text-sm font-medium text-gray-700">{disc}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Dificuldade</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Fácil', 'Média', 'Difícil', 'Mista'].map((diff) => (
                          <label key={diff} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                            <input type="radio" name="dificuldade" className="text-blue-600 focus:ring-blue-500 mr-3" />
                            <span className="text-sm font-medium text-gray-700">{diff}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-4 pt-4">
                      <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                        Criar Simulado
                      </button>
                      <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulados;