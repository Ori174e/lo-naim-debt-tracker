import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/auth.service'
import { User as UserIcon, Mail, Lock, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function ProfilePage() {
    const navigate = useNavigate()
    const { user, initializeAuth } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [emailData, setEmailData] = useState({
        email: user?.email || ''
    })

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' })
            return
        }

        try {
            setIsLoading(true)
            setMessage(null)
            await authService.updatePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            })
            setMessage({ type: 'success', text: 'Password updated successfully' })
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleEmailUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            setMessage(null)
            await authService.updateEmail({ email: emailData.email })
            setMessage({ type: 'success', text: 'Email updated successfully' })
            await initializeAuth() // Refresh user data
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update email' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 pb-20">
            {/* Header / Banner */}
            <div className="bg-slate-900/50 border-b border-slate-800 pb-8 pt-20 px-4 relative">
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-6 left-4 z-10 text-slate-300 hover:text-white hover:bg-slate-800/50 flex items-center gap-2 transition-all"
                    onClick={() => navigate('/dashboard')}
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </Button>
                <div className="max-w-xl mx-auto flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-4 ring-4 ring-slate-800 shadow-xl">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full" />
                        ) : (
                            <UserIcon className="w-10 h-10 text-slate-400" />
                        )}
                    </div>
                    <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                    <p className="text-slate-400">{user?.email}</p>
                    <p className="text-xs text-slate-600 mt-1">Member since {new Date(user?.createdAt || '').toLocaleDateString()}</p>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-4 mt-8 space-y-6">

                {message && (
                    <div className={`p-4 rounded-xl flex items-start gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                        <p className="text-sm font-medium">{message.text}</p>
                    </div>
                )}

                {/* Change Email Section */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Email Address</h2>
                            <p className="text-sm text-slate-400">Update your contact email</p>
                        </div>
                    </div>

                    <form onSubmit={handleEmailUpdate} className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            value={emailData.email}
                            onChange={(e) => setEmailData({ email: e.target.value })}
                            placeholder="Enter new email"
                        />
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={isLoading}
                                disabled={isLoading || emailData.email === user?.email}
                            >
                                Update Email
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Change Password Section */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Security</h2>
                            <p className="text-sm text-slate-400">Change your password</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <Input
                            label="Current Password"
                            type="password"
                            value={passwordData.oldPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                            placeholder="Enter current password"
                        />
                        <Input
                            label="New Password"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            placeholder="Enter new password (min 6 chars)"
                        />
                        <Input
                            label="Confirm New Password"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            placeholder="Confirm new password"
                        />
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                variant="secondary"
                                isLoading={isLoading}
                                disabled={isLoading || !passwordData.oldPassword || !passwordData.newPassword}
                            >
                                Change Password
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
