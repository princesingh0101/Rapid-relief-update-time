import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { sendMessageToHealthAssistant } from '../services/geminiService';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hello! I'm RapidRelief's Health Assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { text: userMsg, isUser: true }]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => (m.isUser ? `User: ${m.text}` : `AI: ${m.text}`));
      const response = await sendMessageToHealthAssistant(userMsg, history);
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    } catch (e) {
      setMessages(prev => [...prev, { text: "Sorry, something went wrong.", isUser: false }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 bg-white w-80 md:w-96 rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-medical-500 to-medical-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Health Assistant</h3>
                <p className="text-xs opacity-80">Powered by Gemini AI</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 bg-slate-50 space-y-3" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                  msg.isUser 
                    ? 'bg-medical-500 text-white rounded-br-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
               <div className="flex justify-start">
               <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl rounded-bl-none shadow-sm flex gap-1 items-center">
                 <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                 <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                 <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
               </div>
             </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about medicines..."
              className="flex-grow text-sm px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-medical-500 focus:ring-1 focus:ring-medical-500"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-medical-500 text-white p-2 rounded-lg hover:bg-medical-600 disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-medical-500 to-medical-600 text-white p-4 rounded-full shadow-lg hover:shadow-medical-500/40 hover:scale-105 transition-all duration-300"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default ChatAssistant;