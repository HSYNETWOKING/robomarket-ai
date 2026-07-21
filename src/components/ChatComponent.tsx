import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Bot, User, RefreshCw, Layers } from 'lucide-react';
import { ChatThread, ChatMessage } from '../types';

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
      const response = await fetch(`/api/chats?userId=${currentUserId}`);
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
      senderId: currentUserId,
      senderName: currentUsername,
      content: messageInput
    };

    try {
      const response = await fetch(`/api/chats/${activeThreadId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setMessageInput('');
        const updatedThread = await response.json();
        
        // Update thread local state
        setThreads(prev => prev.map(t => t.id === activeThreadId ? updatedThread : t));

        // SIMULATE SELLER AUTOMATED SANDBOX REPLY!
        // To make the direct message feature fully alive, let's trigger a realistic merchant response after 2 seconds!
        setTimeout(async () => {
          const automatedReplies = [
            "Hi! Thanks for reaching out. Yes, the unit is fully operational and currently located in our laboratory. We can arrange freight shipment within 48 hours of purchase approval.",
            "Hello there. The specifications listed are 100% accurate. The battery holds a full charge and our robotics engineer just re-calibrated the rotational joints. Let me know if you would like me to adjust the asking price slightly.",
            "Thank you for your interest. The gross weight is indeed as specified, and it will require a custom freight pallet. We provide full setup support and documentation with the delivery.",
            "Understood. The operating OS is fully updated and we are happy to bundle some optional Python scripts for custom automation triggers if you buy this week!"
          ];

          const randomReply = automatedReplies[Math.floor(Math.random() * automatedReplies.length)];
          const opponentId = activeThread.sellerId === currentUserId ? activeThread.buyerId : activeThread.sellerId;
          const opponentName = activeThread.sellerId === currentUserId ? activeThread.buyerName : activeThread.sellerName;

          const replyBody = {
            senderId: opponentId,
            senderName: opponentName,
            content: randomReply
          };

          try {
            const replyRes = await fetch(`/api/chats/${activeThreadId}/messages`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
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
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">Inquire Inbox is Locked</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Connect a sandbox profile from the header to view direct seller chats.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8" id="chat-viewport">
      
      {/* Splitscreen messenger structure */}
      <div className="grid grid-cols-1 md:grid-cols-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm h-[calc(100vh-12rem)] min-h-[400px]">
        
        {/* Left Side: Threads list */}
        <div className="border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-full bg-zinc-50/40 dark:bg-zinc-950/40">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider flex items-center space-x-1.5">
              <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Inbox Threads</span>
            </h2>
            <button onClick={fetchThreads} className="p-1 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer min-h-[32px]">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-zinc-200 dark:divide-zinc-800">
            {loadingThreads ? (
              <p className="p-4 text-xs text-zinc-400 dark:text-zinc-500 italic">Syncing chats...</p>
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
                      activeThreadId === thread.id ? 'bg-white dark:bg-zinc-800 border-l-4 border-zinc-900 dark:border-white shadow-sm' : 'hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center space-x-1">
                        <User className="h-3 w-3 text-zinc-400 dark:text-zinc-500" />
                        <span>{opponentName}</span>
                      </span>
                      <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono">
                        {new Date(thread.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="text-[10px] text-blue-700 dark:text-blue-400 font-mono tracking-wider truncate block font-medium">
                      System: {thread.robotName}
                    </span>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 truncate block">
                      {lastMsg}
                    </p>
                  </button>
                );
              })
            ) : (
              <div className="p-6 text-center">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 italic font-semibold">No message threads recorded yet.</p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 max-w-[200px] mx-auto leading-relaxed">
                  Go to Marketplace details, select a listed system, and click <strong>"Inquire with Seller"</strong> to initiate peer-to-peer discussions.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Message Feed */}
        <div className="col-span-2 flex flex-col h-full bg-white dark:bg-zinc-900">
          {activeThread ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center space-x-1.5">
                    <span>Chatting with {activeThread.sellerId === currentUserId ? activeThread.buyerName : activeThread.sellerName}</span>
                  </h3>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono block">
                    Product Subject: <span className="text-blue-700 dark:text-blue-400 font-bold">{activeThread.robotName}</span>
                  </span>
                </div>
              </div>

              {/* Message timeline list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/20 dark:bg-zinc-950/10 animate-fade-in">
                {activeThread.messages.map((msg, idx) => {
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div
                      key={msg.id || idx}
                      className={`flex space-x-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMe && (
                        <div className="h-7 w-7 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 text-xs shadow-sm">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-xs shadow-sm ${
                          isMe
                            ? 'bg-zinc-900 dark:bg-zinc-800 text-white dark:text-zinc-100 rounded-tr-none'
                            : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-tl-none'
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        <span className={`block text-[8px] text-right mt-1.5 font-mono ${isMe ? 'text-zinc-300 dark:text-zinc-400' : 'text-zinc-400 dark:text-zinc-500'}`}>
                          {msg.senderName} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Message submission form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Propose prices, inquire about firmware versions or shipping..."
                  required
                  className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 text-xs rounded-lg px-3 py-2.5 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all min-h-[44px]"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold px-4 py-2.5 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer disabled:opacity-40 shadow-sm min-h-[44px]"
                  id="chat-message-send"
                >
                  <Send className="h-3 w-3" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-zinc-50/10 dark:bg-zinc-900/10 text-zinc-400 dark:text-zinc-500">
              <MessageSquare className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mb-2 animate-bounce" />
              <p className="text-xs text-zinc-550 dark:text-zinc-400 font-medium">Select an active message thread from the Left Panel to view negotiations.</p>
              <div className="p-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl mt-4 max-w-sm shadow-sm">
                <h4 className="text-[10px] font-bold font-mono text-zinc-800 dark:text-zinc-200 uppercase flex items-center space-x-1.5 mb-1">
                  <Layers className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Sandbox Auto-Replying</span>
                </h4>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed text-left">
                  In this sandbox environment, after sending a message to a seller, our autonomous reply algorithm will trigger a realistic merchant reply to help you audit and test buyer-seller coordinate flows!
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
