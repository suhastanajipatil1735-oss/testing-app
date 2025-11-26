import React, { useState, useCallback } from 'react';
import { Sparkles, FileText, Smile, Briefcase, Wand2, AlertCircle, Loader2 } from 'lucide-react';
import { transformText } from './services/geminiService';
import { TransformationResult } from './types';
import { OutputCard } from './components/OutputCard';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<TransformationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTransform = useCallback(async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await transformText(input);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleTransform();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Wand2 size={18} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Text Magic Lite
            </h1>
          </div>
          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Transform your words <br className="hidden sm:block" />
            <span className="text-indigo-600">instantly</span>.
          </h2>
          <p className="text-slate-500 text-lg">
            Enter any text below to get a smart summary, a fun emoji remix, and a polished formal version.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-1 ring-1 ring-slate-100 max-w-3xl mx-auto">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type or paste your text here..."
              className="w-full min-h-[160px] p-6 text-lg bg-transparent border-0 focus:ring-0 resize-y rounded-xl placeholder:text-slate-300 focus:outline-none"
            />
            <div className="absolute bottom-4 right-4 text-xs text-slate-300 pointer-events-none">
              CMD + Enter to send
            </div>
          </div>
          <div className="border-t border-slate-100 p-3 bg-slate-50/50 rounded-b-xl flex justify-between items-center">
             <div className="text-xs text-slate-400 pl-2">
               {input.length > 0 ? `${input.length} chars` : ''}
             </div>
             <button
              onClick={handleTransform}
              disabled={loading || !input.trim()}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white transition-all duration-200
                ${loading || !input.trim() 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0'}
              `}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Magic happening...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Transform</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Results Grid */}
        {result && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <OutputCard
              title="Summary"
              content={result.summary}
              icon={<FileText size={20} />}
              colorClass="text-blue-600"
              delayIndex={1}
            />
            <OutputCard
              title="Emoji Style"
              content={result.emoji_version}
              icon={<Smile size={20} />}
              colorClass="text-pink-600"
              delayIndex={2}
            />
            <OutputCard
              title="Formal"
              content={result.formal_version}
              icon={<Briefcase size={20} />}
              colorClass="text-emerald-600"
              delayIndex={3}
            />
          </div>
        )}

        {/* Empty State / Placeholder */}
        {!result && !loading && !error && (
          <div className="text-center py-12 opacity-40">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <Sparkles className="text-slate-400" size={32} />
            </div>
            <p className="text-slate-400">Results will appear here</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;