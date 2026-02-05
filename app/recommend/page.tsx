'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { profileAPI, recommendAPI } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, Send, Loader, Zap, Settings, Mic, UploadCloud } from 'lucide-react';

export default function Recommend() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [inputText, setInputText] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [simTranscript, setSimTranscript] = useState('');
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  const [lastMessageIsVoice, setLastMessageIsVoice] = useState(false);
  const [userName, setUserName] = useState('');

  // Check if profile is setup
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        await profileAPI.get();
        const name = localStorage.getItem('userName');
        setUserName(name || 'there');
      } catch (err: any) {
        // Profile not setup, redirect
        router.push('/profile');
      } finally {
        setCheckingProfile(false);
      }
    };

    checkProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      // Only send text field to backend. Do NOT upload audio files from the client.
      formData.append('text', inputText);

      // Add timeout of 2 minutes for processing
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes

      const res = await recommendAPI.get(formData, { signal: controller.signal });
      clearTimeout(timeoutId);

      setLastUserMessage(inputText);
      setLastMessageIsVoice(false);
      setResult(res.data);
      setInputText('');
      setAudioFile(null);
    } catch (err: any) {
      const isCanceled = err?.name === 'CanceledError' || err?.message === 'canceled';
      if (isCanceled) {
        setError('Request timeout. Backend is still processing. Try again in a moment.');
      } else {
        setError(err.response?.data?.detail || err.message || 'Failed to get recommendation');
      }
    } finally {
      setLoading(false);
    }
  };

  // Simulate transcription and then call backend with transcript text
  const handleTranscribeAndAnalyze = async () => {
    if (!simTranscript && !audioFile) {
      setError('Please record or upload audio to simulate transcription');
      return;
    }

    // If user hasn't edited transcript, generate a mock transcript
    const transcript = simTranscript || generateMockTranscript(audioFile);

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('text', transcript);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const res = await recommendAPI.get(formData, { signal: controller.signal });
      clearTimeout(timeoutId);

      setLastUserMessage(transcript);
      setLastMessageIsVoice(true);
      setResult(res.data);
      setSimTranscript('');
      setAudioFile(null);
    } catch (err: any) {
      const isCanceled = err?.name === 'CanceledError' || err?.message === 'canceled';
      if (isCanceled) {
        setError('Request timeout. Backend is still processing. Try again in a moment.');
      } else {
        setError(err.response?.data?.detail || err.message || 'Failed to get recommendation');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateMockTranscript = (file: File | null) => {
    const samples = [
      'I am interested in backend development, APIs, databases, and scalable systems.',
      'I want to build data pipelines, analytics, and work with machine learning models.',
      'I love building mobile apps and improving user experience and performance.',
      'I am keen on cloud engineering, DevOps, and scalable infrastructure.',
    ];
    if (file && file.name) {
      // Create a simple transcript hinting at filename
      return `Simulated from ${file.name}: ${samples[Math.floor(Math.random() * samples.length)]}`;
    }
    return samples[Math.floor(Math.random() * samples.length)];
  };

  if (checkingProfile) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader className="w-6 h-6 text-purple-400 animate-spin" />
          <span className="text-white">Checking profile...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="bg-black/40 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <Link href="/profile" className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition">
            <Settings className="w-4 h-4" />
            Edit Profile
          </Link>
        </div>
      </nav>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 flex flex-col">
        {/* Welcome Message */}
        {!result && (
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl font-bold text-white">
              Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{userName}</span> 🎯
            </h1>
            <p className="text-xl text-gray-400">
              Tell me about your interests, and I'll recommend the perfect career path for you.
            </p>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 space-y-6 mb-6">
          {result && (
            <div className="space-y-6">
              {/* Conversation: user bubble then assistant bubble */}
              <div className="flex justify-end">
                <div className="max-w-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-2xl rounded-br-none">
                  <div className="font-semibold">{lastMessageIsVoice ? '🎙️ Voice input' : 'You'}</div>
                  <div className="mt-2 whitespace-pre-wrap">{lastUserMessage}</div>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="max-w-xl bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-lg font-bold text-white">Career recommendation</h2>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">Recommended Field</p>
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      {result.expertise_field}
                    </h3>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">Confidence</p>
                    <p className="text-white font-semibold">{(result.confidence * 100).toFixed(1)}%</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">Learning Roadmap</p>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-white whitespace-pre-wrap">{result.roadmap}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-1">Why this path?</p>
                    <p className="text-white italic">{result.explanation}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-300">Reasoned using Azure OpenAI (GPT-4.1)</span>
                    <button
                      onClick={() => setResult(null)}
                      className="py-1 px-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition text-sm"
                    >
                      New Recommendation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form - Only show when NO result */}
        {!result && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-4">
            <div className="text-sm text-gray-300">
              Voice-first interaction reduces form fatigue and improves accessibility for students in emerging markets.
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="mt-2">
              <div className="inline-flex rounded-lg bg-black/20 p-1">
                <button
                  onClick={() => setMode('text')}
                  className={`px-4 py-2 rounded-lg ${mode === 'text' ? 'bg-white/10 text-white' : 'text-gray-300'}`}
                >
                  Text Input
                </button>
                <button
                  onClick={() => setMode('voice')}
                  className={`px-4 py-2 rounded-lg ${mode === 'voice' ? 'bg-white/10 text-white' : 'text-gray-300'}`}
                >
                  <Mic className="inline-block mr-2" /> Voice Input (Simulated)
                </button>
              </div>

              {mode === 'text' ? (
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Tell me about your interests, skills, and career goals..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-100 placeholder-gray-100 focus:outline-none focus:border-purple-500/50 focus:bg-white/20 transition resize-none text-gray-900"
                      rows={3}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Get Recommendation
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm text-gray-100 mb-2">Record or upload audio (simulated)</label>
                    <div className="flex gap-2 items-center">
                      <label className="flex items-center gap-2 cursor-pointer px-3 py-2 bg-white/5 rounded-lg border border-white/10 text-sm">
                        <UploadCloud className="w-4 h-4" />
                        <span className="text-gray-200">Choose file</span>
                        <input
                          type="file"
                          accept="audio/mp3,audio/wav,audio/m4a,audio/*"
                          onChange={(e) => {
                            setAudioFile(e.target.files?.[0] || null);
                            setError('');
                          }}
                          className="hidden"
                        />
                      </label>
                      {audioFile ? (
                        <div className="text-sm text-green-300">✅ {audioFile.name} selected</div>
                      ) : (
                        <div className="text-sm text-gray-400">No audio selected</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Transcript (simulated from voice input)</label>
                    <textarea
                      value={simTranscript}
                      onChange={(e) => setSimTranscript(e.target.value)}
                      placeholder="(Editable simulated transcript)"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-100 placeholder-gray-100 focus:outline-none focus:border-purple-500/50 focus:bg-white/20 transition resize-none text-gray-900"
                      rows={3}
                    />
                    <p className="text-xs text-gray-400 mt-1">In production, voice is processed via Azure AI Speech → Azure OpenAI reasoning.</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSimTranscript(generateMockTranscript(audioFile))}
                      className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition"
                    >
                      Generate Transcript
                    </button>
                    <button
                      onClick={handleTranscribeAndAnalyze}
                      disabled={loading}
                      className="ml-auto px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 transition flex items-center gap-2"
                    >
                      {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Transcribe & Analyze'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}