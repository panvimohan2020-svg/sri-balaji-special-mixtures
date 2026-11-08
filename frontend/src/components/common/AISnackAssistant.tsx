import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  User, 
  ShoppingBag, 
  Check, 
  MessageCircle, 
  Star, 
  RotateCcw, 
  ShieldCheck, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { apiService, AIChatResult, AIRecommendationItem } from '../../services/api';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useCartStore } from '../../store/useCartStore';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  recommendations?: AIRecommendationItem[];
  quick_suggestions?: string[];
  contact_action?: string;
  timestamp: string;
}

type ConnectionStatus = 'checking' | 'online' | 'offline';

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'msg-welcome',
  sender: 'assistant',
  text: "Namaste! 🙏 I am Balaji Mitra, your personal snack discovery assistant. Ask me anything about our delicious mixtures, spice levels, evening tea pairings, product availability, order tracking or wholesale enquiries. I'm happy to help!",
  quick_suggestions: [
    "Tell me about Kastha Gatiya.",
    "Which snacks are suitable with evening tea?",
    "Which products are spicy?",
    "How can I track my order?",
    "Do you offer wholesale orders?"
  ],
  timestamp: 'Just now'
};

const DEFAULT_SUGGESTION_BUTTONS = [
  { label: "🌟 Tell me about Kastha Gatiya.", query: "Tell me about Kastha Gatiya." },
  { label: "☕ Which snacks are suitable with evening tea?", query: "Which snacks are suitable with evening tea?" },
  { label: "🌶️ Which products are spicy?", query: "Which products are spicy?" },
  { label: "🔍 How can I track my order?", query: "How can I track my order?" },
  { label: "📦 Do you offer wholesale orders?", query: "Do you offer wholesale orders?" }
];

export const AISnackAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);

  const { language } = useLanguageStore();
  const { addItem } = useCartStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reliable Backend Health Check & Status Determination
  const checkServiceHealth = useCallback(async () => {
    try {
      const res = await apiService.getAIStatus();
      if (res && res.operational === true) {
        setConnectionStatus('online');
      } else {
        setConnectionStatus('offline');
      }
    } catch {
      setConnectionStatus('offline');
    }
  }, []);

  // Poll status every 30 seconds and check immediately on mount
  useEffect(() => {
    checkServiceHealth();
    const interval = setInterval(checkServiceHealth, 30000);
    return () => clearInterval(interval);
  }, [checkServiceHealth]);

  // Re-check status whenever chat drawer opens
  useEffect(() => {
    if (isOpen) {
      checkServiceHealth();
    }
  }, [isOpen, checkServiceHealth]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: timeStr
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res: AIChatResult = await apiService.aiChat(text, language);
      // If call succeeds, ensure status is marked online
      setConnectionStatus('online');

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        recommendations: res.recommendations,
        quick_suggestions: res.quick_suggestions && res.quick_suggestions.length > 0 
          ? res.quick_suggestions 
          : DEFAULT_SUGGESTION_BUTTONS.map((s) => s.label),
        contact_action: res.contact_action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      // Mark connection status offline if network or server error
      setConnectionStatus('offline');
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'assistant',
          text: "I am temporarily having trouble reaching our snack archives. Our master craftsmen are available right now to assist you directly on WhatsApp: +91 98617 89602.",
          contact_action: "https://wa.me/919861789602?text=Namaste%20Sri%20Balaji,%20I%20have%20an%20enquiry",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (messages.length <= 1 || window.confirm("Clear this conversation and start fresh with Balaji Mitra?")) {
      setMessages([{
        ...INITIAL_WELCOME_MESSAGE,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const handleQuickAdd = async (rec: AIRecommendationItem) => {
    try {
      const allProducts = await apiService.getProducts();
      const matched = allProducts.find((p) => p.id === rec.id || p.name.toLowerCase() === rec.name.toLowerCase());
      if (matched && matched.variants.length > 0) {
        addItem(matched, matched.variants[0], 1);
        setAddedItemIds((prev) => ({ ...prev, [rec.id]: true }));
        setTimeout(() => {
          setAddedItemIds((prev) => ({ ...prev, [rec.id]: false }));
        }, 3000);
      }
    } catch (e) {
      console.error('Quick add error:', e);
    }
  };

  const generateWhatsAppHandoffUrl = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.sender === 'user')?.text || 'product enquiry';
    const msg = `Namaste Sri Balaji Team, I was chatting with Balaji Mitra regarding: "${lastUserMessage}". Please assist me directly.`;
    return `https://wa.me/919861789602?text=${encodeURIComponent(msg)}`;
  };

  return (
    <>
      {/* Floating Pill Trigger */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#28143F] via-[#392052] to-[#190D2B] text-[#F4C45E] border-2 border-[#F4C45E] shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Open Balaji Mitra AI Assistant"
          title="Chat with Balaji Mitra – Sri Balaji AI Assistant"
        >
          {/* Avatar Icon */}
          <div className="relative w-8 h-8 rounded-full bg-[#F4C45E]/20 border border-[#F4C45E] flex items-center justify-center text-[#F4C45E] shadow-inner shrink-0">
            <Sparkles className="w-4 h-4 animate-pulse text-[#F4C45E]" />
            {connectionStatus === 'online' && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#28143F]" />
            )}
            {connectionStatus === 'checking' && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-400 animate-ping border-2 border-[#28143F]" />
            )}
            {connectionStatus === 'offline' && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-rose-500 border-2 border-[#28143F]" />
            )}
          </div>

          <div className="text-left hidden sm:block">
            <span className="text-xs font-black tracking-wide text-white block">
              Balaji Mitra
            </span>
            <span className="text-[10px] text-[#F4C45E] font-semibold block -mt-0.5">
              AI Snack Guide
            </span>
          </div>

          {connectionStatus === 'online' && (
            <span className="w-2 h-2 rounded-full bg-[#F4C45E] animate-ping opacity-75 hidden sm:inline" />
          )}
        </button>
      </div>

      {/* Solid Backdrop: Blocks underlying content and guarantees zero transparency bleedthrough on both Desktop and Mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 z-50 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Slide-over Chat Window: 100% Solid Warm Ivory Background (#FFF8EB) */}
      {isOpen && (
        <aside 
          aria-label="Balaji Mitra AI Chat Window"
          className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-[#FFF8EB] shadow-2xl z-50 flex flex-col border-l-2 border-[#F4C45E] animate-slideLeft"
        >
          {/* Header: Solid Deep Imperial Purple */}
          <div className="p-4 bg-gradient-to-r from-[#28143F] via-[#392052] to-[#190D2B] text-white flex items-center justify-between border-b-2 border-[#F4C45E] shadow-md shrink-0">
            <div className="flex items-center gap-3">
              {/* Balaji Mitra Avatar Squircle */}
              <div className="relative w-11 h-11 rounded-2xl bg-[#392052] border-2 border-[#F4C45E] flex items-center justify-center text-[#F4C45E] shadow-royal shrink-0">
                <span className="font-serif font-black text-lg text-[#F4C45E]">BM</span>
                {connectionStatus === 'online' && (
                  <span 
                    className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#190D2B]" 
                    title="Online: Service Operational"
                  />
                )}
                {connectionStatus === 'checking' && (
                  <span 
                    className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-[#190D2B] animate-pulse" 
                    title="Connecting to AI Service"
                  />
                )}
                {connectionStatus === 'offline' && (
                  <span 
                    className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-[#190D2B]" 
                    title="Offline: Service Unavailable"
                  />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-black text-base text-[#F4C45E] tracking-tight">
                    Balaji Mitra
                  </h3>
                  
                  {/* Status Indicator Pill */}
                  {connectionStatus === 'online' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0B4433] text-[#86EFC1] border border-[#126044] text-[10px] font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Online</span>
                    </span>
                  )}

                  {connectionStatus === 'checking' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#42255F] text-[#FFE7A3] border border-[#F4C45E]/40 text-[10px] font-bold">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span>Connecting...</span>
                    </span>
                  )}

                  {connectionStatus === 'offline' && (
                    <button
                      type="button"
                      onClick={checkServiceHealth}
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950/90 text-rose-300 border border-rose-800 hover:bg-rose-900 text-[10px] font-bold transition-all cursor-pointer"
                      title="Click to retry connection"
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>Offline (Retry)</span>
                      <RefreshCw className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-[#FFF8EB]/90 font-medium">
                  Sri Balaji Crisp &amp; Flavour Assistant
                </p>
              </div>
            </div>

            {/* Actions: Clear Chat & Close */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF8EB]/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Restart conversation"
                aria-label="Restart conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF8EB] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Offline Notice Banner (If service is not reachable) */}
          {connectionStatus === 'offline' && (
            <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 flex items-start justify-between gap-3 shrink-0">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-rose-900 leading-tight">
                  <span className="font-bold">Balaji Mitra is currently offline.</span> You can reach our master craftsmen directly on WhatsApp for instant assistance:
                </p>
              </div>
              <a
                href="https://wa.me/919861789602?text=Namaste%20Sri%20Balaji,%20I%20have%20an%20enquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-[#126044] hover:bg-[#0B4433] text-white rounded-lg text-[10px] font-bold shrink-0 transition-colors"
              >
                WhatsApp Desk
              </a>
            </div>
          )}

          {/* Messages Scroll Area: 100% Solid Warm Ivory Background (#FFF8EB) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFF8EB]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 animate-fadeIn ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Assistant Avatar */}
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-[#28143F] text-[#F4C45E] border-2 border-[#F4C45E]/50 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-1.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  {/* Message Bubble: Solid High Contrast */}
                  <div
                    className={`p-4 rounded-3xl text-xs sm:text-[13px] leading-relaxed shadow-sm whitespace-pre-line font-medium ${
                      msg.sender === 'user'
                        ? 'bg-[#28143F] text-[#FFF8EB] border border-[#F4C45E]/40 rounded-tr-xs'
                        : 'bg-white border-2 border-[#28143F]/15 text-[#28143F] rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Timestamp */}
                  <div className={`text-[10px] px-1 font-medium ${msg.sender === 'user' ? 'text-[#865C0F] text-right' : 'text-[#68544E] text-left'}`}>
                    {msg.timestamp}
                  </div>

                  {/* Product Recommendation Cards (Solid White Cards) */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="space-y-2 pt-2 w-full">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#A97819] uppercase tracking-wider">
                        <Star className="w-3.5 h-3.5 text-[#A97819] fill-[#A97819]" />
                        <span>Recommended by Sri Balaji:</span>
                      </div>
                      
                      {msg.recommendations.map((rec) => (
                        <div
                          key={rec.id}
                          className="p-3.5 rounded-2xl bg-white border-2 border-[#F4C45E]/40 shadow-sm flex items-center justify-between gap-3 hover:border-[#F4C45E] transition-colors"
                        >
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-black text-[#28143F] text-xs sm:text-sm truncate block">
                                {rec.name}
                              </span>
                              {rec.spice_level && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF8EB] border border-[#F4C45E] text-[#28143F] font-bold shrink-0">
                                  {rec.spice_level}
                                </span>
                              )}
                            </div>
                            {rec.pairing_notes && (
                              <p className="text-[11px] text-[#68544E] line-clamp-2 leading-tight">
                                {rec.pairing_notes}
                              </p>
                            )}
                            <div className="text-xs font-mono font-bold text-[#A97819] flex items-center gap-2">
                              <span>₹{rec.price}</span>
                              <span className="text-[10px] text-[#68544E] font-sans font-normal">
                                ({rec.weight_label})
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleQuickAdd(rec)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-xs ${
                              addedItemIds[rec.id]
                                ? 'bg-[#126044] text-white'
                                : 'bg-[#28143F] hover:bg-[#392052] text-[#F4C45E] border border-[#F4C45E]/50'
                            }`}
                          >
                            {addedItemIds[rec.id] ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Add</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Contextual WhatsApp Action Button */}
                  {msg.contact_action && (
                    <div className="pt-1">
                      <a
                        href={msg.contact_action}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#126044] hover:bg-[#0B4433] text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 text-[#86EFC1]" />
                        <span>Connect on WhatsApp Desk (+91 98617 89602)</span>
                      </a>
                    </div>
                  )}

                  {/* Dynamic Follow-Up Suggestion Pills */}
                  {msg.quick_suggestions && msg.quick_suggestions.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {msg.quick_suggestions.map((sug, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSend(sug)}
                          className="px-3 py-1 rounded-xl bg-white hover:bg-[#FFE7A3] border border-[#EEDDC4] hover:border-[#F4C45E] text-xs font-semibold text-[#28143F] transition-all text-left shadow-2xs cursor-pointer"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                </div>

                {/* User Avatar */}
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-[#F4C45E] text-[#28143F] flex items-center justify-center shrink-0 mt-1 shadow-xs font-bold text-xs border border-[#A97819]/40">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Animated Typing Indicator */}
            {loading && (
              <div className="flex gap-2.5 items-center justify-start animate-fadeIn">
                <div className="w-8 h-8 rounded-xl bg-[#28143F] text-[#F4C45E] border-2 border-[#F4C45E]/50 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-white border-2 border-[#28143F]/15 shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F4C45E] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#F4C45E] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#F4C45E] animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-xs text-[#68544E] font-medium ml-1.5">Balaji Mitra is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK SUGGESTION BUTTONS DOCK (Solid Cream #F5EBD8) */}
          <div className="px-3 pt-2.5 pb-2 bg-[#F5EBD8] border-t-2 border-[#EEDDC4] space-y-1.5 shrink-0">
            <span className="text-[10px] font-bold text-[#68544E] uppercase tracking-wider block px-1">
              Quick Suggestions:
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {DEFAULT_SUGGESTION_BUTTONS.map((btn, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(btn.query)}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-[#FFE7A3] active:scale-95 border border-[#EEDDC4] hover:border-[#F4C45E] text-xs font-semibold text-[#28143F] whitespace-nowrap transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar & Footer (Solid White Background) */}
          <div className="p-3 sm:p-4 bg-white border-t-2 border-[#EEDDC4] space-y-2 shrink-0">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }} 
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask Balaji Mitra about snacks, PIN codes, spice..."
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-2xl bg-[#FFF8EB] border-2 border-[#EEDDC4] focus:border-[#F4C45E] focus:bg-white text-xs sm:text-sm text-[#28143F] placeholder-[#68544E]/60 font-medium outline-none transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="w-11 h-11 rounded-2xl bg-[#28143F] hover:bg-[#392052] text-[#F4C45E] border-2 border-[#F4C45E]/40 flex items-center justify-center transition-all disabled:opacity-40 shadow-royal cursor-pointer shrink-0"
                aria-label="Send message"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Bottom Support Callout */}
            <div className="flex items-center justify-between text-[10px] text-[#68544E] pt-1 px-1">
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#126044]" />
                <span>30-Year Authentic Heritage</span>
              </span>

              <a
                href={generateWhatsAppHandoffUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#126044] hover:text-[#0B4433] font-bold flex items-center gap-1 transition-colors"
                title="Handoff to live customer desk"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#126044]" />
                <span>WhatsApp Live Desk</span>
              </a>
            </div>

          </div>

        </aside>
      )}
    </>
  );
};
