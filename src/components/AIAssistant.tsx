import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, AlertCircle, RefreshCw, Cpu, BookOpen, Layers } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface AIAssistantProps {
  onViewRobot: (id: string) => void;
}

const QUICK_PROMPTS = [
  {
    title: "Office Cleaning",
    text: "Recommend a robot to sweep and scrub a 2-story office building. My budget is under $6,000.",
  },
  {
    title: "Educational STEM",
    text: "I want an emotional companion dog or a programmable STEM arm for teaching Python. What models do you suggest?",
  },
  {
    title: "Factory Assembly",
    text: "Compare a bipedal humanoid with a 6-axis industrial arm for physical warehouse restocking. Which is more durable?",
  },
  {
    title: "Medical Delivery",
    text: "What security features and certifications does the MedBot Care-Plus offer for clinical workflows?",
  }
];

export default function AIAssistant({ onViewRobot }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: `Hello! I am your **RoboMarket AI Advisor**. 🤖\n\nI can help you analyze technical specifications, recommend robots based on budget/purpose, compare humanoid vs. industrial models, or verify listing documentation quality.\n\nHow can I assist your robotics procurement today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error('Advisor link failed. Please check network.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'model', content: data.content || 'I could not synthesize a response.' }]);
    } catch (err: any) {
      setError(err.message || 'Communication interruption with core neural net.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseMessageText = (text: string) => {
    // Look for robot IDs in format like [r1], [r2], etc. and replace with custom link buttons
    const regex = /\[r([1-9][0-9]*)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const matchIndex = match.index;
      const robotId = 'r' + match[1];

      // Add text before match
      if (matchIndex > lastIndex) {
        parts.push(<span key={lastIndex}>{text.substring(lastIndex, matchIndex)}</span>);
      }

      // Add custom clickable element
      parts.push(
        <button
          key={matchIndex}
          onClick={() => onViewRobot(robotId)}
          className="inline-flex items-center space-x-1 mx-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer min-h-[32px]"
        >
          <Cpu className="h-3 w-3" />
          <span>View Listing {robotId}</span>
        </button>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(<span key={lastIndex}>{text.substring(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : text;
  };

  // Convert custom markdown line breaks and bold characters basic styling
  const renderFormattedContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      let element = line;
      
      // Check for headings
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-semibold text-zinc-900 dark:text-white mt-3 mb-1">{parseMessageText(line.replace('### ', ''))}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-base font-bold text-blue-700 dark:text-blue-400 mt-4 mb-2">{parseMessageText(line.replace('## ', ''))}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} className="text-lg font-extrabold text-blue-850 dark:text-blue-300 mt-4 mb-2">{parseMessageText(line.replace('# ', ''))}</h2>;
      }

      // Check for bullet list
      const isBullet = line.startsWith('- ') || line.startsWith('* ');
      const cleanLine = isBullet ? line.substring(2) : line;

      // Simple Bold markdown handling: **bold text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parsedLine = cleanLine.split(boldRegex).map((part, index) => {
        if (index % 2 === 1) {
          return <strong key={index} className="text-blue-700 dark:text-blue-400 font-bold">{part}</strong>;
        }
        return parseMessageText(part);
      });

      if (isBullet) {
        return (
          <li key={idx} className="ml-4 list-disc text-zinc-650 dark:text-zinc-350 text-sm leading-relaxed mb-1">
            {parsedLine}
          </li>
        );
      }

      return (
        <p key={idx} className="text-zinc-650 dark:text-zinc-350 text-sm leading-relaxed mb-2 min-h-[1rem]">
          {parsedLine}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto px-4 py-6" id="ai-advisor-panel">
      {/* Advisor Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-150 dark:border-blue-900/60 text-blue-600 dark:text-blue-400">
            <Bot className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center space-x-1.5">
              <span>Technical AI Advisor</span>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/20 text-blue-750 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                Active
              </span>
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-450">Consult on custom robotic specifications, price checks, and warning signs</p>
          </div>
        </div>
        <button
          onClick={() => setMessages([{
            role: 'model',
            content: `Feed re-initialized. I am ready to advise on your robotics marketplace purchases or compare equipment specs.`
          }])}
          className="flex items-center space-x-1.5 text-xs text-zinc-600 dark:text-zinc-300 hover:text-zinc-850 dark:hover:text-white px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors cursor-pointer shadow-sm min-h-[38px]"
          title="Clear Conversation"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Feed</span>
        </button>
      </div>

      {/* Chat workspace container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        
        {/* Messages feed */}
        <div className="lg:col-span-3 flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className="space-y-4">
                <div
                  className={`flex space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role !== 'user' && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-150 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 self-start">
                      <Bot className="h-5 w-5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-zinc-900 dark:bg-zinc-800 text-white dark:text-zinc-100 rounded-tr-none'
                        : 'bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <div>{renderFormattedContent(msg.content)}</div>
                    )}
                    <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 text-right mt-1.5">
                      {msg.role === 'user' ? 'You' : 'System Agent'}
                    </span>
                  </div>
                </div>

                {/* Interactive suggestion chips rendered underneath the welcome message */}
                {i === 0 && messages.length === 1 && (
                  <div className="pl-11 flex flex-col space-y-2 animate-fade-in" id="first-load-suggestion-chips">
                    <span className="text-[10px] font-bold font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Quick Action Prompts</span>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_PROMPTS.map((qp, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(qp.text)}
                          className="px-3 py-1.5 text-xs bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-zinc-750 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-750 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl transition-all duration-200 cursor-pointer min-h-[38px] flex items-center shadow-sm"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-blue-550 dark:text-blue-400 mr-1.5 shrink-0" />
                          <span>{qp.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex space-x-3 justify-start">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-150 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 self-start">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="max-w-[80%] rounded-2xl rounded-tl-none px-4 py-3 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-sm shadow-sm flex items-center space-x-2">
                  <Cpu className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-450" />
                  <span className="font-mono text-xs tracking-wider animate-pulse">Analyzing specs & listings...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center space-x-2 p-3.5 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-750 dark:text-red-400 text-xs">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div ref={feedEndRef} />
          </div>

          {/* Form input */}
          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask advice on specs (e.g. Hume bipedal biped carry specs)..."
                className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-750 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm rounded-lg px-4 py-2.5 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors min-h-[44px]"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer min-h-[44px] min-w-[44px]"
                id="send-message-btn"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Quick Help & Guidelines Column */}
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
            <h2 className="text-xs font-bold font-mono tracking-wider text-blue-700 dark:text-blue-400 uppercase flex items-center space-x-1.5 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span>Sandbox Fast Queries</span>
            </h2>
            <div className="space-y-2">
              {QUICK_PROMPTS.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(qp.text)}
                  className="w-full text-left p-2.5 rounded-lg bg-zinc-50/80 dark:bg-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-500 text-xs transition-all duration-200 cursor-pointer group min-h-[44px]"
                >
                  <p className="font-semibold text-zinc-850 dark:text-zinc-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{qp.title}</p>
                  <p className="text-zinc-550 dark:text-zinc-450 line-clamp-2 mt-0.5">{qp.text}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2.5 shadow-sm">
            <h3 className="text-xs font-semibold text-zinc-850 dark:text-zinc-200 flex items-center space-x-1.5">
              <BookOpen className="h-3.5 w-3.5 text-blue-605 dark:text-blue-400" />
              <span>Safety Enforcement</span>
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-450 leading-relaxed">
              Our AI Assistant utilizes a restrictive system prompt. It is trained strictly on commercial robotics, safety procedures, and marketplace transactions. Unrelated system queries (such as philosophy, web coding, or pop music) will be politely rejected.
            </p>
            <div className="h-px bg-zinc-250 dark:bg-zinc-800" />
            <h3 className="text-xs font-semibold text-zinc-850 dark:text-zinc-200 flex items-center space-x-1.5">
              <Layers className="h-3.5 w-3.5 text-blue-605 dark:text-blue-400" />
              <span>Specification Linking</span>
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-450 leading-relaxed">
              When recommending specific machines, look out for clickable robot tags in the response feed. Click on them to directly open that robotic system profile and initiate checkout.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
