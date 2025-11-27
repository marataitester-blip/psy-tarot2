import React, { useEffect, useState } from 'react';

const messages = [
  "Связь с бессознательным...",
  "Тасование колоды судьбы...",
  "Поиск архетипа...",
  "Генерация образа...",
  "Интерпретация символов..."
];

export const LoadingOverlay: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 bg-opacity-95 backdrop-blur-sm text-center px-4">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-amber-900/30 rounded-full animate-ping"></div>
        <div className="absolute inset-0 border-4 border-amber-500/50 rounded-full animate-spin border-t-transparent"></div>
        <div className="absolute inset-4 bg-amber-600/20 rounded-full blur-xl animate-pulse"></div>
      </div>
      <h2 className="text-xl md:text-2xl font-serif text-amber-100 animate-pulse">
        {messages[msgIndex]}
      </h2>
      <p className="mt-2 text-amber-500/60 text-sm">Пожалуйста, ожидайте...</p>
    </div>
  );
};
