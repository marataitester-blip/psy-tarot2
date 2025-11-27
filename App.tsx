import React, { useState, useEffect } from 'react';
import { AppState, TarotAnalysisResult } from './types';
import { analyzeSituation, generateTarotImage } from './services/geminiService';
import { LoadingOverlay } from './components/LoadingOverlay';
import { LucideSparkles, LucideShare2, LucideRotateCw, LucideFeather } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: 'input',
    userInput: '',
    analysis: null,
    generatedImageUrl: null,
    error: null,
  });

  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });
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
      // 1. Text Analysis
      const analysis = await analyzeSituation(state.userInput);
      
      // 2. Image Generation (Parallelizing slightly if needed, but sequential is safer for logic flow)
      const imageUrl = await generateTarotImage(analysis.imagePrompt);

      setState(prev => ({
        ...prev,
        step: 'result',
        analysis,
        generatedImageUrl: imageUrl
      }));
    } catch (err) {
      console.error(err);
      setState(prev => ({
        ...prev,
        step: 'input',
        error: "Духи молчат. Попробуйте сформулировать запрос иначе или повторить попытку позже."
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

      <div className="relative z-10 max-w-4xl mx-auto min-h-screen flex flex-col p-4 md:p-8">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-purple-800 rounded-lg flex items-center justify-center shadow-lg shadow-amber-900/20">
              <LucideSparkles className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-amber-400 tracking-wide">
              SoulTarot
            </h1>
          </div>
          {installPrompt && (
            <button 
              onClick={handleInstall}
              className="px-4 py-2 text-sm bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-full transition-colors text-slate-300"
            >
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
                  Колода подберет архетип и покажет твой внутренний путь.
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
                  <LucideFeather className="w-5 h-5" />
                  Получить ответ
                </button>
              </div>
            </div>
          )}

          {state.step === 'result' && state.analysis && (
            <div className="animate-fade-in flex flex-col md:flex-row gap-8 md:gap-12 items-start">
              
              {/* Card Visual */}
              <div className="w-full md:w-1/3 flex flex-col items-center sticky top-8">
                <div className="relative group w-full aspect-[2/3] perspective-1000">
                  <div className="w-full h-full relative preserve-3d transition-transform duration-700">
                    {/* Frame */}
                    <div className="absolute inset-0 border-[8px] border-slate-900 rounded-2xl shadow-2xl bg-slate-800 overflow-hidden">
                       {state.generatedImageUrl ? (
                         <img 
                           src={state.generatedImageUrl} 
                           alt={state.analysis.cardName}
                           className="w-full h-full object-cover animate-reveal"
                         />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600">
                           Загрузка образа...
                         </div>
                       )}
                       
                       {/* Overlay Gradient */}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                       
                       {/* Label */}
                       <div className="absolute bottom-4 left-0 right-0 text-center">
                         <span className="inline-block px-4 py-1 bg-black/60 backdrop-blur border border-amber-500/30 rounded-full text-amber-100 font-serif uppercase tracking-widest text-sm">
                           {state.analysis.cardName}
                         </span>
                       </div>
                    </div>
                  </div>
                  
                  {/* Decorative Glow */}
                  <div className="absolute -inset-4 bg-amber-500/20 blur-2xl rounded-full -z-10 group-hover:bg-amber-500/30 transition-all duration-700"></div>
                </div>

                <div className="mt-6 flex gap-3 w-full">
                  <button onClick={reset} className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors flex items-center justify-center gap-2 text-sm border border-slate-700">
                    <LucideRotateCw className="w-4 h-4" /> Новый вопрос
                  </button>
                </div>
              </div>

              {/* Interpretation */}
              <div className="w-full md:w-2/3 space-y-8 pb-12">
                <div>
                  <h3 className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-2">Архетип</h3>
                  <p className="text-2xl font-serif text-white">{state.analysis.archetype}</p>
                </div>

                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
                  <h3 className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-4">Психологический портрет</h3>
                  <div className="prose prose-invert prose-p:text-slate-300 prose-p:leading-relaxed max-w-none">
                    <p className="whitespace-pre-wrap">{state.analysis.interpretation}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-900/20 to-purple-900/20 border border-amber-500/20 p-6 rounded-2xl">
                  <h3 className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-3 flex items-center gap-2">
                    <LucideSparkles className="w-4 h-4" />
                    Совет карт
                  </h3>
                  <p className="text-lg text-amber-100 italic font-serif">
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
          from { opacity: 0; scale: 1.1; filter: blur(10px); }
          to { opacity: 1; scale: 1; filter: blur(0); }
        }
        .animate-reveal {
          animation: reveal 1.5s ease-out forwards;
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

export default App;
