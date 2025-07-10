import React, { useState } from 'react'
import { X, Scale } from 'lucide-react'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'signup'
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              SIMULAI OAB
            </span>
          </div>

          {mode === 'login' ? (
            <LoginForm onToggleMode={() => setMode('signup')} />
          ) : (
            <SignUpForm onToggleMode={() => setMode('login')} />
          )}
        </div>
      </div>
    </div>
  )
}