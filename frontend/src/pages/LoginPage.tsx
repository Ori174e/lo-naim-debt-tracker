import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { LogIn, UserPlus, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
    const navigate = useNavigate()
    const { login, signup, error, clearError } = useAuthStore()
    const [isSignup, setIsSignup] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        clearError()

        try {
            if (isSignup) {
                await signup(formData)
            } else {
                await login({ email: formData.email, password: formData.password })
            }
            navigate('/dashboard')
        } catch (error) {
            console.error('Auth error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="card space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="flex items-center justify-center mb-4">
                            <div className="glass p-3 rounded-2xl">
                                <Sparkles className="w-8 h-8 text-primary-400" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold font-display text-gradient">
                            {isSignup ? 'Join Lo Naim' : 'Welcome Back'}
                        </h1>
                        <p className="text-slate-400">
                            {isSignup
                                ? 'Track debts with friends, the friendly way'
                                : 'Continue managing your debts'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isSignup && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required={isSignup}
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="John Doe"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="input"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="input"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>

                        {isSignup && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Phone (Optional)
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-danger-500/10 border border-danger-500/30 rounded-xl p-3 text-danger-300 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    {isSignup ? (
                                        <>
                                            <UserPlus className="w-5 h-5" />
                                            Create Account
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="w-5 h-5" />
                                            Sign In
                                        </>
                                    )}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="text-center">
                        <button
                            onClick={() => {
                                setIsSignup(!isSignup)
                                clearError()
                            }}
                            className="text-sm text-slate-400 hover:text-primary-400 transition-colors"
                        >
                            {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-slate-500 mt-6">
                    By continuing, you agree to polite automated reminders 😊
                </p>
            </motion.div>
        </div>
    )
}
