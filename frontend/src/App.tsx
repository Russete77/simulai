import { useState } from 'react';
import { BookOpen, Clock, BarChart3, FileText } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import AIFeatures from './components/AIFeatures';
import Pricing from './components/Pricing';
import Community from './components/Community';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import QuestionsBank from './pages/QuestionsBank';
import Simulados from './pages/Simulados';
import Analytics from './pages/Analytics';
import Resources from './pages/Resources';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, loading } = useAuth();
  const [userStats, setUserStats] = useState({
    questionsAnswered: 0,
    accuracyRate: 0,
    simuladosCompleted: 0,
    ranking: 0
  });

  useEffect(() => {
    const loadUserStats = async () => {
      if (!user) return;
      
      try {
        const { data: userAnswers } = await supabase
          .from('user_answers')
          .select('*')
          .eq('user_id', user.id);

        const questionsAnswered = userAnswers?.length || 0;
        const correctAnswers = userAnswers?.filter(a => a.is_correct).length || 0;
        const accuracyRate = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;

        setUserStats({
          questionsAnswered,
          accuracyRate,
          simuladosCompleted: 12, // Mock data
          ranking: 127 // Mock data
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    };
    
    if (user) {
      loadUserStats();
    }
  }, [user]);
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Add demo section to show internal pages
  const showDemo = window.location.hash === '#demo';

  const renderPage = () => {
    if (showDemo && currentPage === 'home') {
      setCurrentPage('questions');
      window.location.hash = '';
    }
    
    switch (currentPage) {
      case 'questions':
        return <QuestionsBank />;
      case 'simulados':
        return <Simulados />;
      case 'analytics':
        return <Analytics />;
      case 'resources':
        return <Resources />;
      default:
        return (
          <>
            <Hero />
            {/* Quick Access Demo Section */}
            {!user && (
              <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Explore a Plataforma
                    </h2>
                    <p className="text-xl text-gray-600">
                      Acesse as principais funcionalidades da nossa plataforma
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <button
                      onClick={() => setCurrentPage('questions')}
                      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 group"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Banco de Questões</h3>
                      <p className="text-gray-600 text-sm">15K+ questões com filtros avançados</p>
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage('simulados')}
                      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 group"
                    >
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                        <Clock className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Simulados</h3>
                      <p className="text-gray-600 text-sm">Simulados reais e personalizados</p>
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage('analytics')}
                      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 group"
                    >
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                        <BarChart3 className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Análise de Desempenho</h3>
                      <p className="text-gray-600 text-sm">Relatórios detalhados e insights</p>
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage('resources')}
                      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 group"
                    >
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                        <FileText className="w-6 h-6 text-yellow-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Recursos</h3>
                      <p className="text-gray-600 text-sm">Resumos, vídeos e jurisprudências</p>
                    </button>
                  </div>
                </div>
              </section>
            )}
            
            {/* Dashboard for logged users */}
            {user && (
              <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Bem-vindo de volta, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
                    </h2>
                    <p className="text-xl text-gray-600">
                      Continue sua jornada rumo à aprovação na OAB
                    </p>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Questões Respondidas</p>
                          <p className="text-2xl font-bold text-gray-900">{userStats.questionsAnswered}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Taxa de Acerto</p>
                          <p className="text-2xl font-bold text-gray-900">{userStats.accuracyRate}%</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Simulados</p>
                          <p className="text-2xl font-bold text-gray-900">{userStats.simuladosCompleted}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Ranking</p>
                          <p className="text-2xl font-bold text-gray-900">#{userStats.ranking}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <button
                      onClick={() => setCurrentPage('questions')}
                      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 group"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Continuar Estudando</h3>
                      <p className="text-gray-600 text-sm">Responder mais questões</p>
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage('simulados')}
                      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-300 group"
                    >
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                        <Clock className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Fazer Simulado</h3>
                      <p className="text-gray-600 text-sm">Testar conhecimentos</p>
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage('analytics')}
                      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300 group"
                    >
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                        <BarChart3 className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Ver Progresso</h3>
                      <p className="text-gray-600 text-sm">Analisar desempenho</p>
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage('resources')}
                      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-yellow-300 group"
                    >
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                        <FileText className="w-6 h-6 text-yellow-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Estudar Conteúdo</h3>
                      <p className="text-gray-600 text-sm">Acessar materiais</p>
                    </button>
                  </div>
                </div>
              </section>
            )}
            
            {!user && (
              <>
                <Features />
                <AIFeatures />
                <Pricing />
                <Community />
              </>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {(currentPage !== 'home' || user) && (
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      )}
      {renderPage()}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;