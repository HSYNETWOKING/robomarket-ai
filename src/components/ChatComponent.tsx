import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, User, RefreshCw, Layers } from 'lucide-react';
import { ChatThread } from '../types';

interface ChatComponentProps {
  currentUserId: string | null;
  currentUsername: string;
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
}

export default function ChatComponent({
  currentUserId,
  currentUsername,
  activeThreadId,
  setActiveThreadId
}: ChatComponentProps) {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find(t => t.id === activeThreadId);

  const fetchThreads = async () => {
    if (!currentUserId) return;
    setLoadingThreads(true);
    try {
      const token = localStorage.getItem('robo_token');
      const response = await fetch(`/api/chats?userId=${currentUserId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (response.ok) {
        const data = await response.json();
        setThreads(data);
      }
    } catch (err) {
      console.error("Error loading chat threads:", err);
    } finally {
      setLoadingThreads(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [currentUserId, activeThreadId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeThreadId || !currentUserId) return;

    const body = {
      content: messageInput
    };

    try {
      const token = localStorage.getItem('robo_token');
      const response = await fetch(`/api/chats/${activeThreadId}/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setMessageInput('');
        const updatedThread = await response.json();
        
        // Update thread local state
        setThreads(prev => prev.map(t => t.id === activeThreadId ? updatedThread : t));

        // SIMULATE SELLER AUTOMATED REPLY
        setTimeout(async () => {
          const automatedReplies = [
            "Hi! Thanks for reaching out. Yes, the unit is fully operational and currently located in our laboratory. We can arrange freight shipment within 48 hours of purchase approval.",
            "Hello there. The specifications listed are 100% accurate. The battery holds a full charge and our robotics engineer just re-calibrated the rotational joints. Let me know if you would like me to adjust the asking price slightly.",
            "Thank you for your interest. The gross weight is indeed as specified, and it will require a custom freight pallet. We provide full setup support and documentation with the delivery.",
            "Understood. The operating OS is fully updated and we are happy to bundle some optional Python scripts for custom automation triggers if you buy this week!"
          ];

          const randomReply = automatedReplies[Math.floor(Math.random() * automatedReplies.length)];

          const replyBody = {
            content: randomReply
          };

          try {
            const replyRes = await fetch(`/api/chats/${activeThreadId}/messages`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
              },
              body: JSON.stringify(replyBody)
            });
            if (replyRes.ok) {
              const reUpdatedThread = await replyRes.json();
              setThreads(prev => prev.map(t => t.id === activeThreadId ? reUpdatedThread : t));
            }
          } catch (err) {
            console.error("Auto reply failed", err);
          }
        }, 2000);
      }
    } catch (err) {
      console.error("Message send failure:", err);
    }
  };

  if (!currentUserId) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center" id="chat-unauthorized">
        <h2 className="text-xl font-black text-slate-900">Inbox Locked</h2>
        <p className="text-xs text-slate-500 mt-2">Connect an account profile from the header to view direct seller chats.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8" id="chat-viewport">
      
      {/* Splitscreen messenger structure */}
      <div className="grid grid-cols-1 md:grid-cols-3 bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xs h-[calc(100vh-12rem)] min-h-[400px]">
        
        {/* Left Side: Threads list */}
        <div className="border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
            <h2 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center space-x-1.5">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              <span>Inbox Threads</span>
            </h2>
            <button onClick={fetchThreads} className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingThreads ? (
              <p className="p-4 text-xs text-slate-400 italic">Syncing chats...</p>
            ) : threads.length > 0 ? (
              threads.map((thread) => {
                const isSeller = thread.sellerId === currentUserId;
                const opponentName = isSeller ? thread.buyerName : thread.sellerName;
                const lastMsg = thread.messages[thread.messages.length - 1]?.content || 'Empty thread';

                return (
                  <button
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`w-full text-left p-4 transition-colors flex flex-col space-y-1 cursor-pointer min-h-[44px] ${
                      activeThreadId === thread.id ? 'bg-white border-l-4 border-emerald-600 shadow-2xs' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center space-x-1">
                        <User className="h-3 w-3 text-slate-400" />
                        <span>{opponentName}</span>
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {new Date(thread.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-mono tracking-wider truncate block font-bold">
                      {thread.robotName}
                    </span>
                    <p className="text-[11px] text-slate-500 line-clamp-1 truncate block">
                      {lastMsg}
                    </p>
                  </button>
                );
              })
            ) : (
              <div className="p-6 text-center">
                <p className="text-xs text-slate-500 italic font-semibold">No active threads.</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] mx-auto leading-relaxed">
                  Go to Marketplace details, select a listed system, and click <strong>"Inquire with Seller"</strong> to chat.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Message Feed */}
        <div className="col-span-2 flex flex-col h-full bg-white">
          {activeThread ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <span>Chat with {activeThread.sellerId === currentUserId ? activeThread.buyerName : activeThread.sellerName}</span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    Product Subject: <span className="text-emerald-700 font-bold">{activeThread.robotName}</span>
                  </span>
                </div>
              </div>

              {/* Message timeline list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 animate-fade-in">
                {activeThread.messages.map((msg, idx) => {
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div
                      key={msg.id || idx}
                      className={`flex space-x-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMe && (
                        <div className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 text-xs shadow-2xs">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs shadow-2xs ${
                          isMe
                            ? 'bg-emerald-600 text-white rounded-tr-none font-medium'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        <span className={`block text-[8px] text-right mt-1.5 font-mono ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
                          {msg.senderName} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Message submission form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-slate-50 flex space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Propose prices, inquire about firmware versions or shipping..."
                  required
                  className="flex-1 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs rounded-xl px-4 py-3 focus:border-emerald-500 focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-3 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-40 shadow-2xs"
                  id="chat-message-send"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 text-slate-400">
              <MessageSquare className="h-10 w-10 text-slate-300 mb-2 animate-bounce" />
              <p className="text-xs text-slate-600 font-semibold">Select an active message thread to view discussions.</p>
              <div className="p-4 bg-white border border-slate-200 rounded-2xl mt-4 max-w-sm shadow-2xs">
                <h4 className="text-[10px] font-bold font-mono text-slate-900 uppercase flex items-center space-x-1.5 mb-1">
                  <Layers className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Automated Replies</span>
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed text-left">
                  When you send a message to a seller, an automated merchant reply will trigger to simulate real buyer-seller interaction.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
