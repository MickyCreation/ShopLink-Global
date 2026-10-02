import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { chatService } from '../../services/mock/MockServices';
import { ChatMessage } from '../../types';
import {
  Send,
  Image,
  X,
  ShieldCheck,
  CheckCheck,
  Clock,
  Phone
} from 'lucide-react';

export const InAppChatModal: React.FC = () => {
  const {
    isChatOpen,
    chatTarget,
    closeChat,
    currentUser,
    userRole,
    showSnackbar
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    if (!currentUser || !chatTarget) return;
    const msgs = await chatService.getMessages(currentUser.id, chatTarget.id, chatTarget.requestId);
    setMessages(msgs);
  };

  useEffect(() => {
    if (isChatOpen && chatTarget && currentUser) {
      loadMessages();
      const unsubscribe = chatService.subscribeToChat(currentUser.id, () => {
        loadMessages();
      });
      return () => unsubscribe();
    }
  }, [isChatOpen, chatTarget, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isChatOpen || !chatTarget || !currentUser) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const content = textToSend || inputText;
    if (!content.trim()) return;

    try {
      await chatService.sendMessage({
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: userRole,
        receiverId: chatTarget.id,
        content: content.trim(),
        relatedRequestId: chatTarget.requestId
      });
      setInputText('');
      await loadMessages();
    } catch {
      showSnackbar('Failed to send message');
    }
  };

  const quickReplies = [
    'I am inside the market now',
    'Item found, proceeding to pay',
    'They only have the 5kg size, is that fine?',
    'Please call when you reach the gate'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-sm h-[580px] bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Chat Header */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">
              {chatTarget.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold truncate max-w-[150px]">
                  {chatTarget.name}
                </h3>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-[10px] text-emerald-300 block">
                {chatTarget.role.replace('_', ' ')} · ShopLink In-App
              </span>
            </div>
          </div>

          <button
            onClick={closeChat}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Request Context Bar if related */}
        {chatTarget.requestId && (
          <div className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 border-b border-emerald-100 dark:border-emerald-900 flex justify-between">
            <span>Linked to Request: {chatTarget.requestId}</span>
            <span>Live Encryption</span>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/30 no-scrollbar">
          {messages.map(msg => {
            const isMe = msg.senderId === currentUser.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                {!isMe && (
                  <span className="text-[9px] font-bold text-slate-400 mb-0.5 ml-2">
                    {msg.senderName}
                  </span>
                )}
                <div
                  className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs shadow-xs leading-relaxed ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-br-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/80 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.content}</p>
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                      isMe ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-emerald-300" />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-1.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
          {quickReplies.map((qr, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(qr)}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-[10px] font-medium text-slate-600 dark:text-slate-300 rounded-full whitespace-nowrap transition active:scale-95"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button
            onClick={() => showSnackbar('Simulating receipt / photo attachment...')}
            className="p-2 text-slate-400 hover:text-emerald-600 transition"
            title="Attach photo"
          >
            <Image className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type message to helper..."
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />

          <button
            onClick={() => handleSendMessage()}
            className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
