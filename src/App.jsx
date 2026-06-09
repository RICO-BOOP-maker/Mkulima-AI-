import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Sun, Moon, Camera, Leaf, Plus, 
  MessageSquare, Menu, X, User, Loader2 
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';

// --- UPDATED AGRO PROMPT ---
const AGRO_PROMPT = `You are Mkulima AI, a Senior Agronomist and Livestock Expert at Mkulima Studio. 

### YOUR PERSONALITY & RULES:
- **Greeting**: ONLY greet the user (e.g., "Jambo") in the very first message of a session. If the conversation history shows previous messages, jump DIRECTLY to the diagnosis/advice.
- **Style**: Be short, concise, and highly informative. Avoid long paragraphs; use bold headers and bullet points.
- **Tone**: Professional and empathetic. Use relevant emojis .
- **Scope**: East African crops (Maize, Wheat, Tomatoes, Potatoes, Coffee, Sukuma Wiki) AND Livestock (Cattle, Goats, Sheep, Poultry etc).
- **Diseases**: Cover crop pests/diseases and livestock issues like Foot & Mouth, Rift Valley Fever, Lumpy Skin Disease, etc.

### YOUR RESPONSE STRUCTURE:
1. **Quick Diagnosis**: A bold header with the most likely issue.
2. **Detailed Observation**: Technical description of symptoms (especially if an image is provided).
3. **Actionable Solutions**: 
   - *Immediate Fix*: (Organic or chemical treatments).
   - *Long-term Prevention*: (Management practices).
4. **Mkulima Tip**: One "pro-secret" for better results.

### CONSTRAINTS:
- If unsure, recommend a local KALRO extension officer.
- Avoid repetitive phrases and generic "I hope this helps" endings.`;

export default function App() {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('mkulima_studio_v11');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    return localStorage.getItem('mkulima_active_id_v11') || null;
  });

  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const messagesEndRef = useRef(null);

  const currentSession = sessions.find(s => s.id === currentSessionId) || { messages: [] };
  const messages = currentSession.messages;

  useEffect(() => {
    localStorage.setItem('mkulima_studio_v11', JSON.stringify(sessions));
    if (currentSessionId) localStorage.setItem('mkulima_active_id_v11', currentSessionId);
  }, [sessions, currentSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fileToGenPart = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({
        inlineData: { data: reader.result.split(',')[1], mimeType: file.type }
      });
      reader.readAsDataURL(file);
    });
  };

  const createNewChat = () => {
    const newId = Date.now().toString();
    const newSession = {
      id: newId,
      title: "New Diagnosis",
      messages: [{ id: `bot-${Date.now()}`, text: "### Jambo! 🌾\nReady for a farm checkup? Upload a photo or describe the issue.", role: 'bot' }],
      date: new Date().toLocaleDateString()
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newId);
    if (window.innerWidth < 768) setIsSidebarOpen(false); 
  };

  // --- UPDATED SEND HANDLER WITH HISTORY ---
  const handleSend = async (e) => {
    e?.preventDefault();
    if ((!input.trim() && !selectedFile) || isLoading) return;

    let activeId = currentSessionId;
    if (!activeId) {
      activeId = Date.now().toString();
      const firstSession = { id: activeId, title: "New Diagnosis", messages: [], date: new Date().toLocaleDateString() };
      setSessions([firstSession]);
      setCurrentSessionId(activeId);
    }

    const currentInput = input;
    const currentFile = selectedFile;
    const userMsg = { 
      id: `user-${Date.now()}`, 
      text: currentInput, 
      role: 'user', 
      userImage: currentFile ? URL.createObjectURL(currentFile) : null 
    };

    // 1. Capture conversation history (last 4 messages) to prevent repeat greetings
    const historyContext = messages
      .slice(-4)
      .map(m => `${m.role === 'user' ? 'User' : 'Mkulima AI'}: ${m.text}`)
      .join('\n');

    setSessions(prev => prev.map(s => s.id === activeId ? { 
      ...s, 
      messages: [...s.messages, userMsg], 
      title: s.title === "New Diagnosis" ? (currentInput.substring(0, 20) || "Farm Check") : s.title 
    } : s));
    
    setInput(''); 
    setSelectedFile(null); 
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: import.meta.env.VITE_API_MODEL }); 
      
      // 2. Wrap prompt with History and specific instruction
      const finalPrompt = `
        ${AGRO_PROMPT}

        HISTORY:
        ${historyContext}

        NEW REQUEST:
        ${currentInput || "Analyze this image."}

        (CRITICAL: Do not greet if History exists. Be concise.)
      `;

      let aiResponseText = "";
      if (currentFile) {
        const imagePart = await fileToGenPart(currentFile);
        const result = await model.generateContent([finalPrompt, imagePart]);
        aiResponseText = result.response.text();
      } else {
        const result = await model.generateContent(finalPrompt);
        aiResponseText = result.response.text();
      }

      const botMsg = { id: `bot-${Date.now()}`, text: aiResponseText, role: 'bot' };
      setSessions(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages, botMsg] } : s));
    } catch (err) {
      const errorMsg = { 
        id: `err-${Date.now()}`, 
        text: "⚠️ **Mkulima AI is taking a quick break.** Please wait 60 seconds (Rate limit hit).", 
        role: 'bot' 
      };
      setSessions(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages, errorMsg] } : s));
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden font-sans tracking-tight ${isDarkMode ? 'bg-[#050505] text-[#e0e0e0]' : 'bg-[#fcfcfc] text-[#1a1a1a]'}`}>
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-500 ease-in-out bg-[#0a0a0a] border-r border-white/5 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 md:p-8 flex flex-col items-start gap-4">
          <a href="https://mkulimaai.web.app/" target="_blank" rel="noopener noreferrer" className="block no-underline group">
            <div className="flex flex-col items-start gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <img src="/logo.png" alt="Mkulima AI" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold tracking-tighter uppercase italic text-white">
                  Mkulima <span className="text-emerald-500 underline decoration-1 underline-offset-4 ml-1">AI</span>
                </h1>
                <p className="text-[8px] md:text-[9px] text-gray-500 font-medium tracking-[0.2em] uppercase mt-1">Agronomy AI</p>
              </div>
            </div>
          </a>
        </div>

        <button onClick={createNewChat} className="mx-6 mb-8 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-widest active:scale-95 transition-all w-[calc(100%-3rem)] text-white">
          <Plus size={14}/> New consultation
        </button>

        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          {sessions.map(s => (
            <div key={s.id} onClick={() => { setCurrentSessionId(s.id); if(window.innerWidth < 768) setIsSidebarOpen(false); }} className={`p-4 rounded-2xl cursor-pointer flex items-center justify-between transition-all ${currentSessionId === s.id ? 'bg-emerald-500/10 border border-emerald-500/20' : 'hover:bg-white/5'}`}>
              <div className="flex items-center gap-3 truncate">
                <MessageSquare size={14} className={currentSessionId === s.id ? 'text-emerald-500' : 'text-gray-500'}/>
                <span className="truncate text-[10px] md:text-xs font-bold uppercase tracking-wide text-white">{s.title}</span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* --- MAIN CHAT --- */}
      <div className="flex-1 flex flex-col relative w-full overflow-hidden">
        <header className="p-4 md:p-6 flex justify-between items-center z-30 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-white/5 rounded-full border border-white/10 text-white">
            {isSidebarOpen ? <X size={18}/> : <Menu size={18}/>}
          </button>
          <div className="md:hidden font-black text-[10px] tracking-[0.3em] uppercase text-emerald-500">Mkulima AI</div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-3 bg-white/5 rounded-full border border-white/10 text-white">
            {isDarkMode ? <Sun size={18}/> : <Moon size={18}/>}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto pt-4 pb-44 px-4 md:px-12">
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.map(m => (
              <div key={m.id} className={`flex gap-3 md:gap-6 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 border ${m.role === 'user' ? 'bg-emerald-500 border-emerald-400' : 'bg-white/5 border-white/10'}`}>
                  {m.role === 'user' ? <User size={14} className="text-black"/> : <Leaf size={14} className="text-emerald-500"/>}
                </div>
                <div className={`max-w-[85%] space-y-3 ${m.role === 'user' ? 'text-right' : ''}`}>
                  {m.userImage && <img src={m.userImage} alt="Crop" className="rounded-2xl border border-white/10 max-h-60 w-auto shadow-xl ml-auto" />}
                  <div className={`p-4 md:p-6 rounded-2xl md:rounded-[2rem] text-sm md:text-base ${m.role === 'user' ? 'bg-emerald-500 text-black font-bold' : 'bg-white/5 border border-white/10 shadow-xl'}`}>
                    <div className="prose prose-invert prose-emerald max-w-none prose-sm md:prose-base">
                      <ReactMarkdown>{m.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && <div className="text-center py-4 animate-pulse text-[10px] tracking-[0.3em] text-emerald-500 font-bold uppercase">Field Analysis in progress...</div>}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* --- FOOTER --- */}
        <footer className="fixed md:absolute bottom-0 left-0 w-full p-4 md:p-8 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent z-40">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-2 bg-[#111] p-2 rounded-[2rem] border border-white/10 shadow-2xl items-center">
            <label className="p-2 md:p-3 cursor-pointer text-gray-500 hover:text-emerald-500 shrink-0">
              <Camera size={20}/>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />
            </label>
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              className="flex-1 bg-transparent outline-none px-2 text-sm text-white placeholder:text-gray-700" 
              placeholder="Ask the studio..." 
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading} className="p-2 md:p-3 bg-emerald-500 rounded-full hover:bg-emerald-400 disabled:opacity-20 shrink-0 transition-all">
              {isLoading ? <Loader2 size={18} className="text-black animate-spin"/> : <Send size={18} className="text-black"/>}
            </button>
          </form>
          <p className="text-center text-[7px] md:text-[8px] text-gray-700 font-bold uppercase tracking-[0.4em] mt-3"> •  ©Made by Ric Creative Studio</p>
        </footer>
      </div>
    </div>
  );
}