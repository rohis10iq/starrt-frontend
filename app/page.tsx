import Link from 'next/link';
import { Sparkles, Brain, Compass, Users } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              STARRT.ai
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-6 py-2 text-purple-200 hover:text-purple-100 transition">
              Login
            </Link>
            <Link href="/register" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">AI-Powered Career Guidance</span>
          </div>
          
          <h1 className="text-6xl font-bold text-white leading-tight">
            Discover Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"> Perfect Career Path</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Let AI analyze your skills, interests, and goals to recommend the best career trajectory and learning roadmap for you.
          </p>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <Link href="/register" className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition">
            Start Free
          </Link>
          <Link href="/login" className="px-8 py-3 bg-white/10 text-white border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition">
            Login
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white/5 backdrop-blur border border-purple-500/20 rounded-lg p-6 hover:bg-white/10 transition">
          <Brain className="w-12 h-12 text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">AI Analysis</h3>
          <p className="text-gray-400">Advanced ML algorithms analyze your profile to match expertise.</p>
        </div>

        <div className="bg-white/5 backdrop-blur border border-purple-500/20 rounded-lg p-6 hover:bg-white/10 transition">
          <Compass className="w-12 h-12 text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Roadmaps</h3>
          <p className="text-gray-400">Get personalized learning paths and skill development roadmaps.</p>
        </div>

        <div className="bg-white/5 backdrop-blur border border-purple-500/20 rounded-lg p-6 hover:bg-white/10 transition">
          <Users className="w-12 h-12 text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Expert Matching</h3>
          <p className="text-gray-400">Connect with industry experts in your chosen field.</p>
        </div>
      </div>
    </main>
  );
}