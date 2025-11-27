import React, { useState, useEffect, ReactNode, ErrorInfo } from 'react';
import { AppState, TarotAnalysisResult } from './types';
import { analyzeSituation, generateTarotImage } from './services/geminiService';
import { LoadingOverlay } from './components/LoadingOverlay';

// Inline Icons to avoid dependency issues
const Sparkles = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"/>
  </svg>
);

const Share2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/>
    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
  </svg>
);

const RotateCw = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
  </svg>
);

const Feather = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
    <line x1="16" x2="2" y1="8" y2="22"/>
    <line x1="17.5" x2="9" y1="15" y2="15"/>
  </svg>
);

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary to catch crashes
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-center">
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 max-w-md">
            <h2 className="text-xl text-red-400 font-serif mb-2">Произошла ошибка</h2>
            <p className="text-slate-400 text-sm mb-4">Приложение столкнулось с неожиданной проблемой.</p>
            <pre className="text-xs text-red-300/50 overflow-auto text-left bg-black/30 p-2 rounded mb-4">
              {this.state.error?.message}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-900/50 hover:bg-red-800 text-red-200 rounded transition"
            >
              Перезагрузить
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: 'input',
    userInput: '',
    analysis: null,
    generatedImageUrl: null,
    error: null,
  });

  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }
  }, []);

  const handleInstall = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setInstallPrompt(null);
        }
      });
    }
  };

  const handleAnalyze = async () => {
    if (!state.userInput.trim()) return;

    setState(prev => ({ ...prev, step: 'processing', error: null }));

    try {
      // 1. Text Analysis (finds the card and interpretation)
      const analysis = await analyzeSituation(state.userInput);
      
      // 2. Image Generation (creates the unique personal card)
      const imageUrl = await generateTarotImage(analysis.imagePrompt);

      setState(prev => ({
        ...prev,
        step: 'result',
        analysis,
        generatedImageUrl: imageUrl
      }));
    } catch (err: any) {
      console.error(err);
      setState(prev => ({
        ...prev,
        step: 'input',
        error: "Духи молчат. Попробуйте сформулировать запрос иначе или повторить попытку позже. " + (err.message || "")
      }));
    }
  };

  const reset = () => {
    setState({
      step: 'input',
      userInput: '',
      analysis: null,
      generatedImageUrl: null,
      error: null
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-900 selection:text-white overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto min-h-screen flex flex-col p-4 md:p-8">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-purple-800 rounded-lg flex items-center justify-center shadow-lg shadow-amber-900/20">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-amber-400 tracking-wide">
              SoulTarot
            </h1>
          </div>
          {installPrompt && (
            <button 
              onClick={handleInstall}
              className="px-4 py-2 text-sm bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-full transition-colors text-slate-300 flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Установить
            </button>
          )}
        </header>

        {/* Content */}
        <main className="flex-grow flex flex-col justify-center">
          
          {state.step === 'processing' && <LoadingOverlay />}

          {state.step === 'input' && (
            <div className="animate-fade-in-up max-w-2xl mx-auto w-full">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-serif text-slate-100 mb-4 leading-tight">
                  Поговори со своим <br/>
                  <span className="text-amber-500">бессознательным</span>
                </h2>
                <p className="text-slate-400 text-lg">
                  Опиши ситуацию, свое состояние или просто поток мыслей. 
                  Колода подберет карту из "Колоды Героя" и создаст уникальный образ вашего внутреннего состояния.
                </p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/50">
                <textarea
                  value={state.userInput}
                  onChange={(e) => setState(prev => ({ ...prev, userInput: e.target.value }))}
                  placeholder="Меня беспокоит неопределенность в..."
                  className="w-full h-40 bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all resize-none text-lg mb-6"
                />
                
                {state.error && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200 text-sm">
                    {state.error}
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={!state.userInput.trim()}
                  className="w-full py-4 bg-gradient-to-r from-amber-700 to-purple-900 hover:from-amber-600 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-serif text-xl tracking-wider shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
                >
                  <Feather className="w-5 h-5" />
                  Получить ответ
                </button>
              </div>
            </div>
          )}

          {state.step === 'result' && state.analysis && (
            <div className="animate-fade-in flex flex-col xl:flex-row gap-8 xl:gap-12 items-start pb-12">
              
              {/* Visuals Column */}
              <div className="w-full xl:w-5/12 grid grid-cols-2 gap-4 sticky top-8">
                
                {/* 1. Deck Card */}
                <div className="flex flex-col gap-2">
                   <div className="text-center text-xs text-amber-500/80 uppercase tracking-widest font-serif mb-1">Архетип Колоды</div>
                   <div className="relative group w-full aspect-[2/3] perspective-1000">
                      <div className="w-full h-full relative border-[4px] border-amber-900/40 rounded-xl shadow-2xl bg-slate-900 overflow-hidden">
                        <img 
                           src={state.analysis.deckImageUrl} 
                           alt={state.analysis.cardName}
                           className="w-full h-full object-cover animate-reveal"
                         />
                      </div>
                   </div>
                </div>

                {/* 2. Generated Card */}
                <div className="flex flex-col gap-2">
                   <div className="text-center text-xs text-purple-400/80 uppercase tracking-widest font-serif mb-1">Ваша проекция</div>
                   <div className="relative group w-full aspect-[2/3] perspective-1000">
                      <div className="w-full h-full relative border-[4px] border-purple-900/40 rounded-xl shadow-2xl bg-slate-900 overflow-hidden">
                        {state.generatedImageUrl ? (
                           <img 
                             src={state.generatedImageUrl} 
                             alt="AI Generated Vision"
                             className="w-full h-full object-cover animate-reveal delay-300 fill-mode-forwards opacity-0"
                           />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600">
                             ...
                           </div>
                         )}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                      </div>
                   </div>
                </div>

                <div className="col-span-2 mt-4">
                  <button onClick={reset} className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors flex items-center justify-center gap-2 text-sm border border-slate-700">
                    <RotateCw className="w-4 h-4" /> Новый вопрос
                  </button>
                </div>
              </div>

              {/* Interpretation Column */}
              <div className="w-full xl:w-7/12 space-y-8">
                <div className="border-b border-slate-800 pb-6">
                  <h3 className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-2">Выпавшая карта</h3>
                  <p className="text-3xl md:text-4xl font-serif text-white">{state.analysis.cardName}</p>
                  <p className="text-lg text-slate-400 mt-1 font-serif italic">{state.analysis.archetype}</p>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
                  <h3 className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-4">Психологический портрет</h3>
                  <div className="prose prose-invert prose-p:text-slate-300 prose-p:leading-relaxed max-w-none text-lg">
                    <p className="whitespace-pre-wrap">{state.analysis.interpretation}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-900/20 to-purple-900/20 border border-amber-500/20 p-6 rounded-2xl">
                  <h3 className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Совет Оракула
                  </h3>
                  <p className="text-xl text-amber-100 italic font-serif">
                    "{state.analysis.advice}"
                  </p>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
      
      <style>{`
        @keyframes reveal {
          from { opacity: 0; transform: scale(1.05); filter: blur(5px); }
          to { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        .animate-reveal {
          animation: reveal 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        .fill-mode-forwards {
          animation-fill-mode: forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => (
  <ErrorBoundary>
    <AppContent />
  </ErrorBoundary>
);

export default App;