import React from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Gratuito",
      price: "0",
      period: "sempre",
      description: "Perfeito para começar sua preparação",
      features: [
        "100 questões por mês",
        "1 simulado básico",
        "Relatórios simples",
        "Acesso à comunidade"
      ],
      cta: "Começar Grátis",
      popular: false,
      color: "gray"
    },
    {
      name: "Essencial",
      price: "97",
      period: "mês",
      description: "Para estudantes focados na aprovação",
      features: [
        "Questões ilimitadas",
        "Simulados completos",
        "Análise de desempenho avançada",
        "Plano de estudos IA básico",
        "Vade Mecum interativo",
        "Suporte por chat"
      ],
      cta: "Assinar Agora",
      popular: true,
      color: "blue"
    },
    {
      name: "Premium",
      price: "147",
      period: "mês",
      description: "Máximo desempenho com IA completa",
      features: [
        "Tudo do plano Essencial",
        "Correção IA de peças ilimitada",
        "Gerador de peças guiado",
        "Plano adaptativo avançado",
        "Conteúdo multimídia exclusivo",
        "Gamificação personalizada",
        "Suporte prioritário"
      ],
      cta: "Assinar Premium",
      popular: false,
      color: "purple"
    }
  ];

  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Planos que Se Adaptam ao Seu Orçamento
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Escolha o plano ideal para sua preparação. Todos com garantia de 30 dias.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-white rounded-2xl border-2 ${
              plan.popular 
                ? 'border-blue-500 shadow-2xl transform scale-105' 
                : 'border-gray-200 shadow-lg'
            } p-8 hover:shadow-xl transition-all duration-300`}>
              
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Mais Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">R${plan.price}</span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <Check className={`w-5 h-5 mt-0.5 ${
                      plan.popular ? 'text-blue-500' : 'text-green-500'
                    }`} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-200 ${
                plan.popular
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                  : plan.color === 'purple'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}>
                {plan.cta}
              </button>

              {plan.popular && (
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-600">
                    💳 Sem compromisso • Cancele quando quiser
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Options */}
        <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Planos Especiais
            </h3>
            <p className="text-gray-600">
              Economize com planos de longo prazo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Plano Trimestral
              </h4>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                R$267
              </div>
              <div className="text-sm text-gray-600 mb-4">
                R$89/mês • Economize 8%
              </div>
              <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
                Escolher Plano
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Plano Semestral
              </h4>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                R$498
              </div>
              <div className="text-sm text-gray-600 mb-4">
                R$83/mês • Economize 15%
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Escolher Plano
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Plano Anual
              </h4>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                R$876
              </div>
              <div className="text-sm text-gray-600 mb-4">
                R$73/mês • Economize 25%
              </div>
              <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors">
                Escolher Plano
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;