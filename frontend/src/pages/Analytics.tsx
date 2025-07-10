import React, { useState } from 'react';
import { useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Target, Clock, BookOpen, Award, Calendar, Filter, Eye, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const Analytics = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [stats, setStats] = useState({
    totalQuestions: 0,
    answeredQuestions: 0,
    correctAnswers: 0,
    accuracyRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user, selectedPeriod]);

  const loadAnalytics = async () => {
    if (!user) return;
    
    try {
      // Get total questions
      const { count: totalQuestions } = await supabase
        .from('questoes')
        .select('*', { count: 'exact', head: true });

      // Get user answers
      const { data: userAnswers, error } = await supabase
        .from('user_answers')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const answeredQuestions = userAnswers?.length || 0;
      const correctAnswers = userAnswers?.filter(a => a.is_correct).length || 0;
      const accuracyRate = answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0;

      setStats({
        totalQuestions: totalQuestions || 0,
        answeredQuestions,
        correctAnswers,
        accuracyRate
      });
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    } finally {
      setLoading(false);
    }
  };
  const performanceData = {
    geral: {
      totalQuestoes: stats.answeredQuestions,
      acertos: stats.correctAnswers,
      taxaAcerto: stats.accuracyRate,
      tempoMedio: 135, // segundos
      evolucao: +12 // percentual de melhoria
    },
    disciplinas: [
      { nome: 'Direito Constitucional', acertos: 85, total: 120, taxa: 71, evolucao: +8 },
      { nome: 'Direito Civil', acertos: 142, total: 180, taxa: 79, evolucao: +15 },
      { nome: 'Direito Penal', acertos: 98, total: 135, taxa: 73, evolucao: +5 },
      { nome: 'Direito Processual Civil', acertos: 76, total: 110, taxa: 69, evolucao: -3 },
      { nome: 'Direito Administrativo', acertos: 89, total: 125, taxa: 71, evolucao: +10 },
      { nome: 'Ética Profissional', acertos: 45, total: 50, taxa: 90, evolucao: +20 }
    ],
    simulados: [
      { nome: 'Simulado OAB XXXVI', data: '2024-01-15', nota: 68, posicao: 127, participantes: 2156 },
      { nome: 'Simulado Direito Civil', data: '2024-01-10', nota: 85, posicao: 23, participantes: 1834 },
      { nome: 'Simulado Constitucional', data: '2024-01-05', nota: 72, posicao: 89, participantes: 1567 },
      { nome: 'Simulado Geral', data: '2023-12-28', nota: 65, posicao: 234, participantes: 2890 }
    ]
  };

  const getEvolutionIcon = (evolucao: number) => {
    if (evolucao > 0) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (evolucao < 0) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <Target className="w-4 h-4 text-gray-500" />;
  };

  const getEvolutionColor = (evolucao: number) => {
    if (evolucao > 0) return 'text-green-600';
    if (evolucao < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const getPerformanceColor = (taxa: number) => {
    if (taxa >= 80) return 'from-green-500 to-green-600';
    if (taxa >= 70) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Análise de Desempenho</h1>
                <p className="text-gray-600">Acompanhe sua evolução e identifique pontos de melhoria</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white font-medium"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
                <option value="1y">Último ano</option>
              </select>
              <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2.5 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center shadow-lg">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Taxa de Acerto Geral</p>
                <p className="text-3xl font-bold text-gray-900">{stats.accuracyRate}%</p>
                <div className="flex items-center mt-1">
                  {getEvolutionIcon(performanceData.geral.evolucao)}
                  <span className={`ml-1 text-xs font-medium ${getEvolutionColor(performanceData.geral.evolucao)}`}>
                    {performanceData.geral.evolucao > 0 ? '+' : ''}{performanceData.geral.evolucao}% vs período anterior
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Target className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Questões Respondidas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.answeredQuestions.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.correctAnswers} acertos de {stats.answeredQuestions}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tempo Médio</p>
                <p className="text-3xl font-bold text-gray-900">{formatTime(performanceData.geral.tempoMedio)}</p>
                <p className="text-xs text-gray-500 mt-1">Por questão respondida</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Ranking Atual</p>
                <p className="text-3xl font-bold text-gray-900">#127</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 font-medium">+23 posições</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Performance by Subject */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Desempenho por Disciplina</h2>
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              Ver Detalhes
            </button>
          </div>
          
          <div className="space-y-4">
            {performanceData.disciplinas.map((disciplina, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getPerformanceColor(disciplina.taxa)} rounded-lg flex items-center justify-center`}>
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{disciplina.nome}</h3>
                      <p className="text-sm text-gray-600">
                        {disciplina.acertos}/{disciplina.total} questões respondidas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      {getEvolutionIcon(disciplina.evolucao)}
                      <span className={`text-sm font-bold ${getEvolutionColor(disciplina.evolucao)}`}>
                        {disciplina.evolucao > 0 ? '+' : ''}{disciplina.evolucao}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Taxa de acerto</span>
                      <span className="text-lg font-bold text-gray-900">{disciplina.taxa}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`bg-gradient-to-r ${getPerformanceColor(disciplina.taxa)} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${disciplina.taxa}%` }}
                      ></div>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    Estudar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Simulados Performance */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Histórico de Simulados</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Simulado</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Data</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Nota</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Posição</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Participantes</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.simulados.map((simulado, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-gray-900">{simulado.nome}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(simulado.data).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-bold text-lg ${
                        simulado.nota >= 80 ? 'text-green-600' : 
                        simulado.nota >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {simulado.nota}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Award className="w-4 h-4 text-purple-500 mr-1" />
                        <span className="font-bold text-gray-900">#{simulado.posicao}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600">{simulado.participantes.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium">
                        Ver Relatório
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Study Recommendations */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Recomendações de Estudo Personalizadas</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-red-200">
              <h3 className="font-bold text-red-900 mb-4 flex items-center">
                <TrendingDown className="w-5 h-5 mr-2" />
                Prioridade Alta - Focar em:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Direito Processual Civil</strong> (69% de acerto)
                  </span>
                </li>
                <li className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Direito Constitucional</strong> (71% de acerto)
                  </span>
                </li>
                <li className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Direito Administrativo</strong> (71% de acerto)
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-green-200">
              <h3 className="font-bold text-green-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Pontos Fortes - Manter:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Ética Profissional</strong> (90% de acerto)
                  </span>
                </li>
                <li className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Direito Civil</strong> (79% de acerto)
                  </span>
                </li>
                <li className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    <strong>Direito Penal</strong> (73% de acerto)
                  </span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
              Gerar Plano de Estudos IA
            </button>
            <button className="bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium">
              Exportar Relatório PDF
            </button>
            <button className="bg-purple-100 text-purple-700 px-6 py-3 rounded-lg hover:bg-purple-200 transition-colors font-medium">
              Agendar Revisão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;