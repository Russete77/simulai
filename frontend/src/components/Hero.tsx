import React from 'react';
import { ArrowRight, Brain, Trophy, Users, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <Brain className="w-4 h-4" />
                <span>Powered by AI</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                Aprove na OAB com
                <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Inteligência Artificial
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                A primeira plataforma com IA que corrige suas peças em tempo real, 
                cria planos de estudo adaptativos e maximiza suas chances de aprovação 
                na 1ª e 2ª fase da OAB.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => window.location.href = '#demo'}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg flex items-center justify-center">
                Começar Grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button 
                onClick={() => window.location.href = '#demo'}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-lg">
                Ver Demonstração
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">15K+</div>
                <div className="text-sm text-gray-600">Questões FGV</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">94%</div>
                <div className="text-sm text-gray-600">Taxa de Aprovação</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">2K+</div>
                <div className="text-sm text-gray-600">Alunos Aprovados</div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Correção por IA</h3>
                    <p className="text-gray-600 text-sm">Feedback instantâneo e detalhado</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Sua Peça Processual</span>
                    <span className="text-sm font-medium text-green-600">85/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full w-5/6"></div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Estrutura bem organizada</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Melhorar fundamentação</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <Trophy className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <div className="text-sm font-medium text-blue-900">Rank #12</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <Zap className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <div className="text-sm font-medium text-green-900">Streak 7d</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-green-200 rounded-2xl transform -rotate-6"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;