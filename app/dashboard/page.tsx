'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Brain, MessageSquare, LogOut, Settings } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    if (!token) {
      router.push('/login');
    } else {
      setAuthenticated(true);
      setUserName(name || 'User');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    router.push('/');
  };

  if (!authenticated) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/40 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              STARRT.ai
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition border border-red-500/30"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Hello,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {userName}
            </span>{' '}
            👋
          </h1>
          <p className="text-gray-400 text-lg">
            Let's help you choose your best career path
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <Link href="/profile">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:border-purple-500/50 transition cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <Settings className="w-8 h-8 text-purple-400 group-hover:scale-110 transition" />
                <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                  Setup
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Profile Setup
              </h2>
              <p className="text-gray-400">
                Tell us about your skills, interests, and career goals
              </p>
            </div>
          </Link>

          {/* Recommendation Card */}
          <Link href="/recommend">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:border-pink-500/50 transition cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <MessageSquare className="w-8 h-8 text-pink-400 group-hover:scale-110 transition" />
                <span className="text-sm bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full">
                  Explore
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Get Recommendations
              </h2>
              <p className="text-gray-400">
                Discover the perfect career path tailored for you
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}