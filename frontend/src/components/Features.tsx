import React from 'react';
import { 
  BookOpen, 
  Clock, 
  BarChart3, 
  FileText, 
  Target, 
  Users,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Banco de Questões Exaustivo",
      description: "Milhares de questões da FGV e inéditas com filtros avançados por disciplina, tema, ano e dificuldade.",
      highlights: ["15K+ questões FGV", "Filtros avançados", "Feedback detalhado"]
    },
    {
      icon: Clock,
      title: "Simulados Completos",
      description: "Modos 'Prova Real' cronometrados e simulados customizáveis para 1ª e 2ª fase.",
      highlights: ["Ambiente real de prova", "Cronômetro integrado", "Análise de tempo"]
    },
    {
      icon: BarChart3,
      title: "Análise de Desempenho",
      description: "Relatórios visuais detalhados com estatísticas de evolução e identificação de pontos fracos.",
      highlights: ["Gráficos interativos", "Evolução por disciplina", "Insights personalizados"]
    },
    {
      icon: FileText,
      title: "Recursos Complementares",
      description: "Resumos concisos, mapas mentais, flashcards e sugestões de jurisprudências.",
      highlights: ["Mapas mentais", "Flashcards interativos", "Resumos práticos"]
    }
  ];

  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Funcionalidades Essenciais
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tudo que você precisa para uma preparação completa e eficiente para a OAB
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Stats */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Resultados Comprovados
            </h3>
            <p className="text-gray-600">
              Veja como nossa plataforma impacta o desempenho dos estudantes
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">+47%</div>
              <div className="text-sm text-gray-600">Melhoria média nas notas</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">94%</div>
              <div className="text-sm text-gray-600">Taxa de aprovação</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">-35%</div>
              <div className="text-sm text-gray-600">Tempo de preparação</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">2.5K+</div>
              <div className="text-sm text-gray-600">Estudantes ativos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;