import React from 'react';
import { 
  Brain, 
  Bot, 
  Lightbulb, 
  BookOpen, 
  PenTool, 
  Gamepad2,
  MessageCircle,
  Zap,
  ArrowRight
} from 'lucide-react';

const AIFeatures = () => {
  const aiFeatures = [
    {
      icon: Brain,
      title: "Plano de Estudos Adaptativo",
      description: "IA que ajusta seu cronograma em tempo real baseado no seu desempenho e nas estatísticas da OAB.",
      color: "from-blue-500 to-blue-600",
      features: ["Cronograma dinâmico", "Priorização inteligente", "Ajuste automático"]
    },
    {
      icon: BookOpen,
      title: "Vade Mecum Interativo",
      description: "Sugestões contextualizadas de artigos e súmulas relevantes para cada questão específica.",
      color: "from-green-500 to-green-600",
      features: ["Sugestões contextuais", "Artigos relevantes", "Busca inteligente"]
    },
    {
      icon: PenTool,
      title: "Correção de Peças por IA",
      description: "Feedback instantâneo e detalhado sobre estrutura, fundamentação e argumentação das suas peças.",
      color: "from-purple-500 to-purple-600",
      features: ["Correção instantânea", "Feedback detalhado", "Sugestões específicas"]
    },
    {
      icon: Bot,
      title: "Gerador de Peças Guiado",
      description: "Assistente IA que te ajuda a construir peças do zero com estrutura correta e artigos fundamentais.",
      color: "from-orange-500 to-orange-600",
      features: ["Construção guiada", "Estrutura correta", "Artigos sugeridos"]
    },
    {
      icon: Lightbulb,
      title: "Conteúdo Contextualizado",
      description: "Vídeos, áudios e resumos linkados diretamente ao feedback das questões para facilitar o aprendizado.",
      color: "from-teal-500 to-teal-600",
      features: ["Conteúdo sob demanda", "Múltiplos formatos", "Contextualização"]
    },
    {
      icon: Gamepad2,
      title: "Gamificação Inteligente",
      description: "Sistema de pontos, rankings e conquistas com IA sugerindo metas personalizadas para te manter motivado.",
      color: "from-red-500 to-red-600",
      features: ["Metas personalizadas", "Rankings dinâmicos", "Conquistas únicas"]
    }
  ];

  return (
    <section id="ai-features" className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Brain className="w-4 h-4" />
            <span>Powered by AI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Diferenciais com Inteligência Artificial
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tecnologia de ponta que personaliza sua preparação e acelera sua aprovação
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aiFeatures.map((feature, index) => (
            <div key={index} className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="mb-6">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>
              </div>
              
              <div className="space-y-2">
                {feature.features.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Correção de Peças da 2ª Fase
              </h3>
              <p className="text-blue-100 mb-6 leading-relaxed">
                Nosso maior diferencial: IA especializada que corrige suas peças processuais 
                e questões discursivas com feedback instantâneo e detalhado. Supera a limitação 
                dos concorrentes tradicionais.
              </p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center">
                Testar Correção IA
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <PenTool className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">Petição Inicial Analisada</span>
                </div>
                
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Estrutura</span>
                    <span className="text-sm font-medium">Excelente</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 mb-3">
                    <div className="bg-green-400 h-2 rounded-full w-5/6"></div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Qualificação das partes correta</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Incluir mais jurisprudências</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFeatures;