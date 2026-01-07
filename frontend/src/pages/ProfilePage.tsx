import Header from '../components/layout/Header'
import Navigation from '../components/layout/Navigation'

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <Header />
            <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
                <h1 className="text-2xl font-bold mb-6">Profile</h1>
                <p className="text-slate-400">Profile page coming soon...</p>
            </main>
            <Navigation />
        </div>
    )
}
