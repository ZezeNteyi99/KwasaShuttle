import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Send } from 'lucide-react';
import { generateDailyBriefing, askAiAssistant } from '../services/geminiService';
import { Booking, Vehicle } from '../types';

interface GeminiInsightProps {
  bookings: Booking[];
  vehicles: Vehicle[];
}

const GeminiInsight: React.FC<GeminiInsightProps> = ({ bookings, vehicles }) => {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  useEffect(() => {
    // Auto-generate briefing on mount
    const fetchBriefing = async () => {
      setLoading(true);
      const text = await generateDailyBriefing(bookings, vehicles);
      setBriefing(text);
      setLoading(false);
    };
    fetchBriefing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setIsAsking(true);
    const context = `
      Vehicles: ${JSON.stringify(vehicles)}
      Bookings: ${JSON.stringify(bookings)}
    `;
    const response = await askAiAssistant(question, context);
    setAnswer(response);
    setIsAsking(false);
    setQuestion('');
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-yellow-300 animate-pulse" size={20} />
          <h3 className="font-bold text-lg">AI Fleet Assistant</h3>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-indigo-200 text-sm py-2">
            <Loader2 className="animate-spin" size={16} />
            Generating daily briefing...
          </div>
        ) : (
          <p className="text-indigo-100 text-sm leading-relaxed mb-6 font-light">
            {briefing}
          </p>
        )}

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
           {answer && (
             <div className="mb-4 p-3 bg-indigo-800/50 rounded-lg text-sm text-indigo-50 border border-indigo-700/50">
                <span className="font-semibold text-yellow-300">AI:</span> {answer}
             </div>
           )}
           
           <form onSubmit={handleAsk} className="flex gap-2">
             <input 
               type="text" 
               placeholder="Ask about fleet status..." 
               value={question}
               onChange={(e) => setQuestion(e.target.value)}
               className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
             />
             <button 
                type="submit" 
                disabled={isAsking}
                className="bg-indigo-500 hover:bg-indigo-400 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
             >
               {isAsking ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
             </button>
           </form>
        </div>
      </div>
    </div>
  );
};

export default GeminiInsight;