import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  MessageCircle,
  Minimize2,
  Maximize2,
  ChevronRight,
  BookOpen,
  Award,
  CreditCard,
  Phone,
  FileText,
  HelpCircle,
  RefreshCw,
  Zap,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCollegeData } from '../../context/CollegeDataContext';
import { PRINCIPAL_DETAILS } from '../../data/mockData';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  suggestions?: string[];
  actionLink?: { label: string; view: string };
}

interface AICampusAssistantProps {
  onNavigate?: (view: string) => void;
}

export const AICampusAssistant: React.FC<AICampusAssistantProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { courses, notices, fees } = useCollegeData();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const INITIAL_MESSAGES: Message[] = [
    {
      id: 'msg-1',
      sender: 'bot',
      text: `नमस्ते! 🙏 मैं राजकीय पॉलिटेक्निक (Government Polytechnic) का AI कैंपस असिस्टेंट हूँ।\n\nमैं आपकी एडमिशन, डिप्लोमा कोर्सेस, BTEUP परीक्षा, फीस, स्कॉलरशिप, हॉस्टल और प्लेसमेंट में कैसे मदद कर सकता हूँ?`,
      timestamp: 'Just now',
      suggestions: [
        '📋 डिप्लोमा कोर्सेस और सीटें',
        '💰 वार्षिक फीस विवरण',
        '🏢 ट्रेनिंग एवं प्लेसमेंट सेल',
        '👨‍🏫 प्राचार्य सर से संपर्क',
        '📚 डिजिटल ई-लाइब्रेरी बुक्स'
      ]
    }
  ];

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const generateAIResponse = (userQuery: string) => {
    const q = userQuery.toLowerCase();

    if (q.includes('course') || q.includes('branch') || q.includes('seat') || q.includes('कोर्स') || q.includes('ब्रांच')) {
      return {
        text: `🏛️ राजकीय पॉलिटेक्निक में 6 प्रमुख 3-वर्षीय AICTE अनुमोदित डिप्लोमा कोर्सेस संचालित हैं:\n\n1. Computer Science & Engineering (60 सीटें)\n2. Mechanical Engineering - Production (60 सीटें)\n3. Civil Engineering (60 सीटें)\n4. Electrical Engineering (60 सीटें)\n5. Electronics Engineering (60 सीटें)\n6. Information Technology (60 सीटें)\n\nसभी पाठ्यक्रम BTEUP लखनऊ से संबद्ध हैं।`,
        suggestions: ['💰 वार्षिक फीस विवरण', '📝 एडमिशन प्रक्रिया', '🏢 प्लेसमेंट रिकॉर्ड्स'],
        actionLink: { label: 'Explore All Courses', view: 'courses' }
      };
    }

    if (q.includes('fee') || q.includes('फीस') || q.includes('paisa') || q.includes('payment')) {
      return {
        text: `💰 राजकीय पॉलिटेक्निक में यूपी शासन द्वारा निर्धारित वार्षिक शुल्क संरचना:\n\n• General / OBC छात्र: ₹12,450 / वर्ष (ट्यूशन + परीक्षा शुल्क)\n• SC / ST छात्र: ₹2,450 / वर्ष (ट्यूशन शुल्क छूट)\n• हॉस्टल एवं मेस शुल्क: ₹4,800 / वर्ष अतिरिक्त\n\nऑनलाइन फीस रसीद और डिजिटल भुगतान पोर्टल पर उपलब्ध है।`,
        suggestions: ['🎓 स्कॉलरशिप जानकारी', '📋 ऑनलाइन फीस पोर्टल', '📝 एडमिशन प्रक्रिया'],
        actionLink: { label: 'View Fee Structure', view: 'fees' }
      };
    }

    if (q.includes('principal') || q.includes('प्रिंसिपल') || q.includes('head') || q.includes('rc srivastava') || q.includes('प्राचार्य')) {
      return {
        text: `👨‍🏫 हमारे संस्थान के प्राचार्य:\n\n• नाम: ${PRINCIPAL_DETAILS.name}\n• पद: ${PRINCIPAL_DETAILS.designation}\n• योग्यता: ${PRINCIPAL_DETAILS.qualification}\n• अनुभव: ${PRINCIPAL_DETAILS.experienceYears}+ वर्ष (प्राविधिक शिक्षा विभाग, उप्र)\n• ईमेल: ${PRINCIPAL_DETAILS.email}\n• फोन: ${PRINCIPAL_DETAILS.mobile}\n• चैंबर: प्रशासनिक ब्लॉक, बांसडीह।`,
        suggestions: ['📋 फैकल्टी सूची', '🏢 कॉलेज लोकेशन', '📢 हालिया सूचनाएं'],
        actionLink: { label: 'View Principal Dossier', view: 'faculty' }
      };
    }

    if (q.includes('placement') || q.includes('job') || q.includes('salary') || q.includes('नौकरी') || q.includes('tpo') || q.includes('कंपनी')) {
      return {
        text: `🏢 ट्रेनिंग एवं प्लेसमेंट सेल (TPO Portal):\n\n• 2025-26 प्लेसमेंट दर: 88.5%\n• प्रमुख रिक्रूटर्स: Tata Motors, L&T, BHEL, Infosys, Tech Mahindra, Motherson Sumi, Maruti Suzuki\n• उच्चतम पैकेज: ₹4.80 LPA | औसत: ₹2.85 LPA\n• नेशनल अप्रेंटिसशिप ट्रेनिंग स्कीम (NATS) 100% सहयोग।`,
        suggestions: ['📋 प्लेसमेंट ड्राइव्स देखें', '📄 रिज्यूमे बिल्डर', '🏛️ कोर्सेस विवरण'],
        actionLink: { label: 'Open Placement Cell', view: 'placements' }
      };
    }

    if (q.includes('library') || q.includes('book') || q.includes('किताब') || q.includes('लाइब्रेरी') || q.includes('notes')) {
      return {
        text: `📚 सेंट्रल डिजिटल ई-लाइब्रेरी एवं बुक बैंक:\n\n• कुल बुक्स: 15,000+ तकनीकी एवं इंजीनियरिंग ग्रंथ\n• नेशनल डिजिटल लाइब्रेरी (NDLI) सब्सक्रिप्शन उपलब्ध\n• SC/ST बुक बैंक योजना के तहत हर सेमेस्टर में फ्री बुक्स सेट\n• BTEUP मॉडल पेपर्स और डिजिटल PDF नोट्स 24/7 डाउनलोड हेतु उपलब्ध।`,
        suggestions: ['📖 बुक्स सर्च करें', '📄 BTEUP सिलेबस', '💰 फीस विवरण'],
        actionLink: { label: 'Open Digital Library', view: 'library' }
      };
    }

    if (q.includes('exam') || q.includes('result') || q.includes('admit') || q.includes('परीक्षा') || q.includes('रिजल्ट')) {
      return {
        text: `📝 BTEUP परीक्षा एवं परिणाम सत्र 2025-2026:\n\n• इवन सेमेस्टर थ्योरी परीक्षाएं 15 मई 2026 से प्रारंभ होंगी।\n• प्रैक्टिकल एवं वायवा 1 मई 2026 से।\n• डिजिटल एडमिट कार्ड (Hall Ticket with QR Code) और मार्कशीट छात्र पोर्टल से डाउनलोड कर सकते हैं।`,
        suggestions: ['📋 एडमिट कार्ड डाउनलोड', '📝 टाइमटेबल देखें', '🎓 परीक्षा फॉर्म'],
        actionLink: { label: 'View Exam Schedule', view: 'examinations' }
      };
    }

    if (q.includes('hostel') || q.includes('हॉस्टल') || q.includes('facility') || q.includes('suvidha') || q.includes('mess')) {
      return {
        text: `🏨 कॉलेज परिसर सुविधाएं (Campus Facilities):\n\n• 120 सीटर बॉयज हॉस्टल एवं 60 सीटर गर्ल्स हॉस्टल (24/7 वाई-फाई, शुद्ध पेयजल, मेस)\n• आधुनिक CNC वर्कशॉप एवं 4 हाई-टेक कंप्यूटर लैब्स (120+ Core-i7 सिस्टम्स)\n• वॉलीबॉल, क्रिकेट, बैडमिंटन स्पोर्ट्स ग्राउंड एवं 50 kW सोलर पावर प्लांट।`,
        suggestions: ['📍 कॉलेज लोकेशन व मैप', '💰 हॉस्टल फीस', '👨‍🏫 फैकल्टी डायरेक्टरी'],
        actionLink: { label: 'Explore Facilities', view: 'facilities' }
      };
    }

    if (q.includes('admission') || q.includes('jeecup') || q.includes('प्रवेश') || q.includes('eligibility')) {
      return {
        text: `🎯 एडमिशन प्रक्रिया (JEECUP 2026):\n\n• प्रवेश परीक्षा: संयुक्त प्रवेश परीक्षा परिषद, उत्तर प्रदेश (JEECUP - Group A)\n• न्यूनतम योग्यता: 10वीं पास (गणित एवं विज्ञान सहित न्यूनतम 35% अंक)\n• लेटरल एंट्री (2nd Year Direct): 12th PCM / ITI पास (Group K)।\n• BTEUP कॉलेज कोड: 4412`,
        suggestions: ['🏛️ कोर्सेस और सीटें', '💰 फीस विवरण', '📞 एडमिशन हेल्पलाइन'],
        actionLink: { label: 'Admission Guidelines', view: 'about' }
      };
    }

    // Default intelligent fallback
    return {
      text: `धन्यवाद आपके प्रश्न के लिए! राजकीय पॉलिटेक्निक से संबंधित यह विवरण हमारी आधिकारिक डायरेक्टरी में दर्ज है। क्या आप नीचे दिए गए विकल्पों में से कुछ देखना चाहेंगे?`,
      suggestions: [
        '📋 सभी 6 डिप्लोमा कोर्सेस',
        '💰 फीस एवं स्कॉलरशिप',
        '🏢 प्लेसमेंट रिकॉर्ड्स',
        '👨‍🏫 प्राचार्य सर प्रोफाइल',
        '📚 डिजिटल ई-लाइब्रेरी'
      ]
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(text);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: response.suggestions,
        actionLink: response.actionLink
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Toggle Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          aria-label="Open AI Campus Assistant"
          className="fixed bottom-6 right-6 z-50 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 border border-white/30 group animate-bounce-subtle"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[11px] font-black uppercase tracking-wider text-amber-300">AI Campus Bot</div>
            <div className="text-[10px] text-white/90 font-medium">24/7 हेल्पडेस्क (हिंदी/EN)</div>
          </div>
        </button>
      )}

      {/* Floating AI Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[420px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-polytechnic-950 via-slate-900 to-polytechnic-900 text-white flex items-center justify-between border-b border-white/10 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-md relative">
                <Bot className="w-5 h-5 text-white" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-polytechnic-950 absolute -bottom-0.5 -right-0.5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white">Antigravity Campus AI</h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                    LIVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">Govt. Polytechnic Bansdeeh Helpdesk</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message History Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/40 text-xs">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-md'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.text}

                      {/* Action Link Button if available */}
                      {msg.actionLink && onNavigate && (
                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                          <button
                            onClick={() => onNavigate(msg.actionLink!.view)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-bold text-[11px] transition-all"
                          >
                            <span>{msg.actionLink.label}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-400 px-1">{msg.timestamp}</span>

                    {/* Interactive Suggestion Chips */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1.5 max-w-[95%]">
                        {msg.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(sug)}
                            className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 shadow-2xs transition-all flex items-center gap-1 text-left"
                          >
                            <span>{sug}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs italic p-2 bg-white dark:bg-slate-800 rounded-xl w-fit border border-slate-200 dark:border-slate-700">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span>AI Assistant typing response...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Category Bar */}
              <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-[11px]">
                <button
                  onClick={() => handleSendMessage('डिप्लोमा कोर्सेस और सीटें')}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap hover:text-blue-600 flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                >
                  <BookOpen className="w-3 h-3 text-blue-500" /> कोर्सेस
                </button>
                <button
                  onClick={() => handleSendMessage('वार्षिक फीस विवरण')}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap hover:text-blue-600 flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                >
                  <CreditCard className="w-3 h-3 text-emerald-500" /> फीस
                </button>
                <button
                  onClick={() => handleSendMessage('ट्रेनिंग एवं प्लेसमेंट सेल')}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap hover:text-blue-600 flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                >
                  <Award className="w-3 h-3 text-amber-500" /> प्लेसमेंट
                </button>
                <button
                  onClick={() => handleSendMessage('प्राचार्य सर से संपर्क')}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap hover:text-blue-600 flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                >
                  <Phone className="w-3 h-3 text-purple-500" /> प्रिंसिपल
                </button>
              </div>

              {/* Input Footer */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask any question in Hindi or English..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md disabled:opacity-50 transition-all flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
