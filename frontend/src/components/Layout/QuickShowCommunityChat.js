import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { BACKEND_BASE_URL } from '../../config/api';

let socketInstance = null;

const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(BACKEND_BASE_URL, {
      transports: ['websocket'],
    });
  }
  return socketInstance;
};

const QuickShowCommunityChat = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  const storedUser = !user && typeof window !== 'undefined'
    ? (() => {
        try {
          const raw = localStorage.getItem('user');
          return raw ? JSON.parse(raw) : null;
        } catch {
          return null;
        }
      })()
    : user;

  const effectiveUser = user || storedUser;
  const displayName = effectiveUser?.name || 'Guest';

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    const socket = getSocket();

    const handleCommunityMessage = (msg) => {
      setMessages((prev) => [...prev.slice(-99), msg]);
    };

    socket.on('community-message', handleCommunityMessage);
    socket.on('community-system', handleCommunityMessage);

    if (!hasJoinedRef.current) {
      socket.emit('join-community', {
        name: displayName,
      });
      hasJoinedRef.current = true;
    }

    return () => {
      socket.off('community-message', handleCommunityMessage);
      socket.off('community-system', handleCommunityMessage);
    };
  }, [displayName]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, open]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const socket = getSocket();
    const message = {
      name: displayName,
      text,
      createdAt: new Date().toISOString(),
    };
    socket.emit('community-message', message);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center space-x-3 px-4 py-3 rounded-full shadow-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white hover:shadow-2xl transition-all"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/20">
            <span className="text-lg">💬</span>
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-xs uppercase tracking-widest opacity-80">QuickShow</span>
            <span className="text-sm font-semibold">Community Chat</span>
          </div>
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="w-80 sm:w-96 h-96 rounded-2xl shadow-2xl bg-slate-900/95 border border-slate-800 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg">
                🎬
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-white">QuickShow Community</span>
                <span className="text-xs text-slate-300">Chat live about movies</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-slate-300 hover:text-white text-lg leading-none"
            >
              ×
            </button>
          </div>

          <div className="flex-1 px-3 py-2 overflow-y-auto space-y-2 text-sm bg-slate-950/60">
            {messages.length === 0 && (
              <div className="text-center text-xs text-slate-400 mt-4">
                No messages yet. Say hi to the QuickShow community!
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className="flex flex-col px-2 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-sky-300">{msg.name || 'User'}</span>
                  {msg.createdAt && (
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-100 whitespace-pre-wrap break-words">{msg.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-3 py-2 border-t border-slate-800 bg-slate-900/90">
            <div className="text-[10px] text-slate-400 mb-1 flex justify-between">
              <span>Chatting as <span className="font-semibold">{displayName}</span></span>
              {!isAuthenticated && <span>Login to show your name</span>}
            </div>
            <div className="flex items-center space-x-2">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share your thoughts about movies..."
                className="flex-1 resize-none rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={handleSend}
                className="px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-semibold text-white disabled:opacity-60"
                disabled={!input.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickShowCommunityChat;
