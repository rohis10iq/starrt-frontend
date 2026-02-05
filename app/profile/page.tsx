'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { profileAPI } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, Save, Loader } from 'lucide-react';

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    highest_education_level: 'Bachelor',
    short_term_goal: '',
    programming_languages: '',
    technical_domains: '',
    preferred_domains: '',
  });

  // Load profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await profileAPI.get();
        const data = res.data;
        setFormData({
          name: data.name || '',
          highest_education_level: data.highest_education_level || 'Bachelor',
          short_term_goal: data.short_term_goal || '',
          programming_languages: Array.isArray(data.programming_languages)
            ? data.programming_languages.join(', ')
            : '',
          technical_domains: Array.isArray(data.technical_domains)
            ? data.technical_domains.join(', ')
            : '',
          preferred_domains: Array.isArray(data.preferred_domains)
            ? data.preferred_domains.join(', ')
            : '',
        });
      } catch (err: any) {
        // Profile doesn't exist yet, which is fine
        console.log('No profile yet');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        programming_languages: formData.programming_languages.split(',').map(s => s.trim()).filter(Boolean),
        technical_domains: formData.technical_domains.split(',').map(s => s.trim()).filter(Boolean),
        preferred_domains: formData.preferred_domains.split(',').map(s => s.trim()).filter(Boolean),
      };
      
      await profileAPI.create(payload);
      setSuccess('Profile saved successfully!');
      
      // Store user name in localStorage - FIX: Store actual name, not first skill
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.setItem('userName', formData.name || 'there');
      }
      
      // Redirect to recommend after 2 seconds
      setTimeout(() => {
        router.push('/recommend');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader className="w-6 h-6 text-purple-400 animate-spin" />
          <span className="text-white">Loading profile...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/40 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Your Profile</h1>
            <p className="text-gray-400">Help us understand your skills and career goals</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-200 p-4 rounded-lg">
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/20 transition text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Education Level</label>
              <select
                name="highest_education_level"
                value={formData.highest_education_level}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/20 transition"
              >
                <option value="High School" className="text-gray-900">High School</option>
                <option value="Bachelor" className="text-gray-900">Bachelor</option>
                <option value="Master" className="text-gray-900">Master</option>
                <option value="PhD" className="text-gray-900">PhD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Short-term Goal</label>
              <textarea
                name="short_term_goal"
                value={formData.short_term_goal}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/20 transition resize-none text-gray-900"
                rows={3}
                placeholder="e.g., Get a backend engineering internship"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Programming Languages (comma-separated)</label>
              <input
                type="text"
                name="programming_languages"
                value={formData.programming_languages}
                onChange={handleChange}
                placeholder="Python, JavaScript, Java"
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/20 transition text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Technical Domains (comma-separated)</label>
              <input
                type="text"
                name="technical_domains"
                value={formData.technical_domains}
                onChange={handleChange}
                placeholder="Backend, DevOps, Machine Learning"
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/20 transition text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Domains (comma-separated)</label>
              <input
                type="text"
                name="preferred_domains"
                value={formData.preferred_domains}
                onChange={handleChange}
                placeholder="Cloud, Security, Data Science"
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/20 transition text-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Profile
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}