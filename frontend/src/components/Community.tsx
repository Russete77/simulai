import React from 'react';
import { MessageCircle, Users, Trophy, Heart, BookOpen, HelpCircle } from 'lucide-react';

const Community = () => {
  const communityFeatures = [
    {
      icon: MessageCircle,
      title: "Discussões Focadas",
      description: "Participe de discussões sobre questões específicas, jurisprudências e temas da OAB"
    },
    {
      icon: Users,
      title: "Grupos de Estudo",
      description: "Forme ou participe de grupos de estudo organizados por disciplina ou região"
    },
    {
      icon: Trophy,
      title: "Rankings e Competições",
      description: "Compete com outros estudantes em desafios semanais e rankings de desempenho"
    },
    {
      icon: Heart,
      title: "Suporte Mútuo",
      description: "Receba e ofereça apoio emocional durante sua jornada de preparação"
    }
  ];

  const testimonials = [
    {
      name: "Maria Santos",
      role: "Aprovada OAB XXXII",
      content: "A correção por IA das peças foi fundamental para minha aprovação. Recebi feedback detalhado que me ajudou a melhorar drasticamente.",
      rating: 5
    },
    {
      name: "Carlos Oliveira",
      role: "Aprovado OAB XXXIII",
      content: "O plano de estudos adaptativo me permitiu focar exatamente onde eu tinha mais dificuldade. Economizei meses de preparação.",
      rating: 5
    },
    {
      name: "Ana Silva",
      role: "Aprovada OAB XXXIV",
      content: "A comunidade é incrível! Além da tecnologia, ter o suporte de outros estudantes fez toda diferença na minha motivação.",
      rating: 5
    }
  ];

  return (
    <section id="community" className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Comunidade de Estudantes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conecte-se com milhares de estudantes, compartilhe experiências e cresça junto
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {communityFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            O que nossos aprovados dizem
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Stats */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Nossa Comunidade em Números
          </h3>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">2.5K+</div>
              <div className="text-gray-600">Estudantes Ativos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">850+</div>
              <div className="text-gray-600">Aprovados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">15K+</div>
              <div className="text-gray-600">Discussões</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfação</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;