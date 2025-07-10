import React, { useState } from 'react';
import { useEffect } from 'react';
import { Search, Filter, BookOpen, Clock, CheckCircle, XCircle, Star, ArrowRight, Eye, Target, Award, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../lib/supabase';

type Question = Database['public']['Tables']['questoes']['Row'];
type UserAnswer = Database['public']['Tables']['user_answers']['Row'];

const QuestionsBank = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    disciplina: '',
    ano: '',
    dificuldade: '',
    status: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  const disciplinas = [
    'Direito Constitucional', 'Direito Civil', 'Direito Penal', 'Direito Processual Civil',
    'Direito Processual Penal', 'Direito Administrativo', 'Direito Tributário', 'Direito do Trabalho',
    'Direito Empresarial', 'Ética Profissional'
  ];

  useEffect(() => {
    if (user) {
      loadQuestions();
      loadUserAnswers();
    }
  }, [user]);

  const loadQuestions = async () => {
    try {
      let query = supabase.from('questoes').select('*');
      
      if (selectedFilters.disciplina) {
        query = query.eq('subject', selectedFilters.disciplina);
      }
      if (selectedFilters.ano) {
        query = query.eq('year', parseInt(selectedFilters.ano));
      }
      if (selectedFilters.dificuldade) {
        query = query.eq('difficulty', selectedFilters.dificuldade.toUpperCase());
      }
      if (searchTerm) {
        query = query.ilike('statement', `%${searchTerm}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false }).limit(50);
      
      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Erro ao carregar questões:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserAnswers = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_answers')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setUserAnswers(data || []);
    } catch (error) {
      console.error('Erro ao carregar respostas:', error);
    }
  };

  const handleAnswerQuestion = async (questionId: string, selectedAnswer: string) => {
    if (!user) return;
    
    setAnswering(questionId);
    
    try {
      const question = questions.find(q => q.id === questionId);
      if (!question) return;
      
      const isCorrect = selectedAnswer === question.correct_answer;
      
      const { error } = await supabase
        .from('user_answers')
        .upsert({
          user_id: user.id,
          question_id: questionId,
          selected_answer: selectedAnswer,
          is_correct: isCorrect,
        });
      
      if (error) throw error;
      
      // Reload user answers
      await loadUserAnswers();
    } catch (error) {
      console.error('Erro ao salvar resposta:', error);
    } finally {
      setAnswering(null);
    }
  };

  useEffect(() => {
    if (user) {
      loadQuestions();
    }
  }, [selectedFilters, searchTerm]);

  const getUserAnswerForQuestion = (questionId: string) => {
    return userAnswers.find(answer => answer.question_id === questionId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'acertou':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'errou':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getDifficultyColor = (dificuldade: string) => {
    switch (dificuldade) {
      case 'EASY':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'HARD':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'Fácil';
      case 'MEDIUM':
        return 'Média';
      case 'HARD':
        return 'Difícil';
      default:
        return difficulty;
    }
  };

  const getQuestionStatus = (questionId: string) => {
    const userAnswer = getUserAnswerForQuestion(questionId);
    if (!userAnswer) return 'nao_respondida';
    return userAnswer.is_correct ? 'acertou' : 'errou';
  };

  const filteredQuestions = questions.filter(question => {
    if (selectedFilters.status) {
      const status = getQuestionStatus(question.id);
      if (selectedFilters.status !== status) return false;
    }
    return true;
  });

  // Calculate stats
  const totalQuestions = questions.length;
  const answeredQuestions = userAnswers.length;
  const correctAnswers = userAnswers.filter(a => a.is_correct).length;
  const accuracyRate = answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando questões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Banco de Questões</h1>
              <p className="text-gray-600">Mais de 15.000 questões da FGV e inéditas para sua preparação</p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total de Questões</p>
                <p className="text-3xl font-bold text-gray-900">{totalQuestions.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Disponíveis para estudo</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Respondidas</p>
                <p className="text-3xl font-bold text-gray-900">{answeredQuestions.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0}% do total
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Taxa de Acerto</p>
                <p className="text-3xl font-bold text-gray-900">{accuracyRate}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <p className="text-xs text-green-600">+5% esta semana</p>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <Target className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Ranking</p>
                <p className="text-3xl font-bold text-gray-900">#127</p>
                <div className="flex items-center mt-1">
                  <Award className="w-3 h-3 text-purple-500 mr-1" />
                  <p className="text-xs text-purple-600">Top 15%</p>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="grid md:grid-cols-5 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Disciplina</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={selectedFilters.disciplina}
                onChange={(e) => setSelectedFilters({...selectedFilters, disciplina: e.target.value})}
              >
                <option value="">Todas as disciplinas</option>
                {disciplinas.map(disc => (
                  <option key={disc} value={disc}>{disc}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ano</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={selectedFilters.ano}
                onChange={(e) => setSelectedFilters({...selectedFilters, ano: e.target.value})}
              >
                <option value="">Todos os anos</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Dificuldade</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={selectedFilters.dificuldade}
                onChange={(e) => setSelectedFilters({...selectedFilters, dificuldade: e.target.value})}
              >
                <option value="">Todas</option>
                <option value="EASY">Fácil</option>
                <option value="MEDIUM">Média</option>
                <option value="HARD">Difícil</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={selectedFilters.status}
                onChange={(e) => setSelectedFilters({...selectedFilters, status: e.target.value})}
              >
                <option value="">Todos</option>
                <option value="acertou">✓ Acertadas</option>
                <option value="errou">✗ Erradas</option>
                <option value="nao_respondida">⏱ Não Respondidas</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar questões..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                Mostrando <span className="text-blue-600 font-bold">{filteredQuestions.length}</span> de <span className="font-bold">{questions.length}</span> questões
              </span>
              {filteredQuestions.length !== questions.length && (
                <button 
                  onClick={() => {
                    setSelectedFilters({ disciplina: '', ano: '', dificuldade: '', status: '' });
                    setSearchTerm('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Limpar filtros
                </button>
              )}
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center shadow-lg">
              <Filter className="w-4 h-4 mr-2" />
              Filtros Avançados
            </button>
          </div>
        </div>

        {/* Enhanced Questions List */}
        <div className="space-y-6">
          {filteredQuestions.map((question, index) => {
            const userAnswer = getUserAnswerForQuestion(question.id);
            const status = getQuestionStatus(question.id);
            const isAnswering = answering === question.id;
            
            return (
              <div key={question.id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Question Header */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm">
                          {getStatusIcon(status)}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 text-lg">Questão #{index + 1}</span>
                          <p className="text-sm text-gray-600">ID: {question.id.slice(0, 8)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {question.subject}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(question.difficulty)}`}>
                          {getDifficultyLabel(question.difficulty)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-600">{question.year || 'N/A'}</span>
                      {userAnswer && (
                        <div className={`text-sm font-bold mt-1 ${userAnswer.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                          {userAnswer.is_correct ? '✓ Correto' : '✗ Incorreto'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Question Content */}
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Enunciado:</h3>
                    <p className="text-gray-800 leading-relaxed text-base">{question.statement}</p>
                  </div>
                  
                  {/* Answer Options */}
                  <div className="space-y-3 mb-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Alternativas:</h4>
                    {[
                      { key: 'A', text: question.option_a },
                      { key: 'B', text: question.option_b },
                      { key: 'C', text: question.option_c },
                      { key: 'D', text: question.option_d }
                    ].map((option) => {
                      const isSelected = userAnswer?.selected_answer === option.key;
                      const isCorrect = question.correct_answer === option.key;
                      const showResult = userAnswer !== undefined;
                      
                      let bgColor = 'border-gray-200 hover:bg-gray-50 hover:border-gray-300';
                      let textColor = 'text-gray-800';
                      
                      if (showResult) {
                        if (isSelected && isCorrect) {
                          bgColor = 'border-green-400 bg-green-50 shadow-sm';
                          textColor = 'text-green-900';
                        } else if (isSelected && !isCorrect) {
                          bgColor = 'border-red-400 bg-red-50 shadow-sm';
                          textColor = 'text-red-900';
                        } else if (isCorrect) {
                          bgColor = 'border-green-300 bg-green-50 shadow-sm';
                          textColor = 'text-green-800';
                        }
                      }
                      
                      return (
                        <button
                          key={option.key}
                          onClick={() => !userAnswer && !isAnswering && handleAnswerQuestion(question.id, option.key)}
                          disabled={!!userAnswer || isAnswering}
                          className={`w-full p-4 border-2 rounded-xl text-left transition-all duration-200 ${bgColor} ${
                            !userAnswer && !isAnswering ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                              showResult && isSelected 
                                ? isCorrect 
                                  ? 'bg-green-500 border-green-500 text-white' 
                                  : 'bg-red-500 border-red-500 text-white'
                                : showResult && isCorrect
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300 bg-white text-gray-700'
                            }`}>
                              {option.key}
                            </div>
                            <span className={`flex-1 ${textColor} font-medium`}>
                              {option.text}
                            </span>
                            {showResult && isSelected && (
                              <div className={`text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                {isCorrect ? '✓' : '✗'}
                              </div>
                            )}
                            {showResult && !isSelected && isCorrect && (
                              <div className="text-lg font-bold text-green-600">✓</div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Explanation */}
                  <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-900 mb-2">Explicação:</h4>
                        <p className="text-blue-800 leading-relaxed">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Question Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>Gabarito: <span className="font-bold text-gray-900">{question.correct_answer}</span></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4" />
                        <span>Dificuldade: <span className="font-medium">{getDifficultyLabel(question.difficulty)}</span></span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {!userAnswer && (
                        <div className="text-sm text-gray-600 flex items-center space-x-2">
                          {isAnswering ? (
                            <>
                              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                              <span>Salvando...</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4" />
                              <span>Clique em uma alternativa para responder</span>
                            </>
                          )}
                        </div>
                      )}
                      
                      {userAnswer && (
                        <div className="flex items-center space-x-2">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            userAnswer.is_correct 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {userAnswer.is_correct ? '✓ Respondido corretamente' : '✗ Respondido incorretamente'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredQuestions.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma questão encontrada</h3>
            <p className="text-gray-600 mb-6">Tente ajustar os filtros ou termos de busca para encontrar questões.</p>
            <button 
              onClick={() => {
                setSelectedFilters({ disciplina: '', ano: '', dificuldade: '', status: '' });
                setSearchTerm('');
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsBank;