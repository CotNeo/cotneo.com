'use client';
/* eslint-disable react/no-unescaped-entities */
import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaRedo, FaPaperPlane, FaCopy, FaCheck } from 'react-icons/fa';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const INITIAL_MESSAGE: Message = {
  id: 'initial-' + Date.now(),
  role: 'assistant',
  content: "Hi! 👋 I'm Furkan's AI assistant. I can tell you all about his skills, projects, experience, and more. What would you like to know?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

/**
 * Generates a unique ID for messages
 */
const generateMessageId = (): string => {
  return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Formats timestamp for display
 */
const formatTimestamp = (): string => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const SUGGESTION_QUESTIONS = [
  "Tell me about your frontend development skills",
  "What projects have you worked on?",
  "What's your professional background?",
  "What technologies do you use the most?",
  "What are your main interests in tech?",
  "Can you tell me about your experience?",
  "What databases do you work with?",
  "Tell me about your cloud expertise"
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(() => 
    [...SUGGESTION_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 3)
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string>(() => 
    Math.random().toString(36).substring(2, 15)
  );

  // Keep messagesRef in sync with messages state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  /**
   * Scrolls to bottom of messages container
   */
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  /**
   * Handles opening/closing chat and focus management
   */
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen, scrollToBottom]);

  /**
   * Auto-scroll when new messages arrive
   */
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom]);

  /**
   * Keyboard shortcuts (ESC to close)
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  /**
   * Typing indicator animation
   */
  useEffect(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        setTypingIndicator(prev => {
          if (prev.length >= 3) return '';
          return prev + '.';
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setTypingIndicator('');
    }
  }, [isTyping]);

  /**
   * Gets count of user messages
   */
  const getUserMessageCount = useCallback(() => {
    return messages.filter(msg => msg.role === 'user').length;
  }, [messages]);

  /**
   * Copies message content to clipboard
   */
  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('[ChatBot] Failed to copy message:', error);
    }
  };

  /**
   * Handles form submission and API call
   */
  const handleSubmit = useCallback(async (e: React.FormEvent | null, suggestedQuestion?: string) => {
    if (e) e.preventDefault();
    const messageToSend = suggestedQuestion || input;
    if ((!messageToSend.trim() && !suggestedQuestion) || isLoading) return;

    const userMessage: Message = { 
      id: generateMessageId(),
      role: 'user', 
      content: messageToSend.trim(),
      timestamp: formatTimestamp()
    };
    
    // Update messages state and ref
    setMessages(prev => {
      const updated = [...prev, userMessage];
      messagesRef.current = updated;
      return updated;
    });
    
    // Clear input if not a suggestion
    if (!suggestedQuestion) {
      setInput('');
    }
    
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Use ref to get current messages for API call
      const currentMessages = messagesRef.current;
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          message: messageToSend.trim(),
          conversationId,
          previousMessages: currentMessages.slice(-4).map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (parseError) {
          console.error('[ChatBot] JSON parse error:', parseError);
          throw new Error('Failed to parse server response');
        }
      } else {
        // HTML veya başka bir format geldiğinde fallback kullan
        console.error('[ChatBot] Invalid content type:', contentType);
        throw new Error('Server returned an invalid response format');
      }

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status} ${response.statusText}`);
      }

      if (!data.response) {
        throw new Error('No response received from server');
      }

      const assistantMessage: Message = { 
        id: generateMessageId(),
        role: 'assistant', 
        content: data.response,
        timestamp: formatTimestamp()
      };
      
      setMessages(prev => {
        const updated = [...prev, assistantMessage];
        messagesRef.current = updated;
        return updated;
      });

      // Update suggestions based on context
      setSuggestions(prev => {
        const remainingSuggestions = SUGGESTION_QUESTIONS.filter(q => 
          q !== suggestedQuestion && 
          !currentMessages.some(m => m.role === 'user' && m.content === q)
        );
        const shuffled = [...remainingSuggestions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
      });
    } catch (error) {
      console.error('[ChatBot] Error in handleSubmit:', error);
      
      // Kullanıcı dostu hata mesajı
      let errorMessage = 'I apologize, but I encountered an error processing your request. ';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage += 'It seems there\'s a network issue. Please check your connection and try again.';
        } else if (error.message.includes('Invalid response format') || error.message.includes('parse')) {
          errorMessage += 'The server returned an unexpected response. Please try again in a moment.';
        } else if (error.message.includes('Server error')) {
          errorMessage += 'The server is experiencing issues. Please try again later.';
        } else {
          errorMessage += 'Please try again or rephrase your question.';
        }
      } else {
        errorMessage += 'Please try again or rephrase your question.';
      }
      
      const errorResponse: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: errorMessage,
        timestamp: formatTimestamp()
      };
      setMessages(prev => {
        const updated = [...prev, errorResponse];
        messagesRef.current = updated;
        return updated;
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [input, isLoading, conversationId]);

  /**
   * Handles suggestion click
   */
  const handleSuggestionClick = useCallback((question: string) => {
    handleSubmit(null, question);
  }, [handleSubmit]);

  /**
   * Resets the conversation
   */
  const handleReset = () => {
    const resetMessages = [INITIAL_MESSAGE];
    setMessages(resetMessages);
    messagesRef.current = resetMessages;
    setSuggestions([...SUGGESTION_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 3));
    setInput('');
    setConversationId(Math.random().toString(36).substring(2, 15));
    setIsTyping(false);
    setTypingIndicator('');
    setIsLoading(false);
  };

  /**
   * Handles keyboard input
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="relative">
      {/* Main chat button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold 
                 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 overflow-hidden group
                 backdrop-blur-sm bg-opacity-90 border border-white/10 z-50"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 
                      group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
        
        {/* Button content */}
        <div className="relative z-10 flex items-center space-x-2">
          <FaRobot className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Chat with AI</span>
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 
                     bg-gray-900/95 backdrop-blur-md rounded-lg shadow-2xl border border-white/10 
                     flex flex-col overflow-hidden z-50 max-h-[calc(100vh-6rem)]"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <FaRobot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Chat with Furkan's AI</h3>
                  <p className="text-white/80 text-sm">Ask me anything!</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleReset}
                  className="p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
                  title="Reset conversation"
                  aria-label="Reset conversation"
                >
                  <FaRedo className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
                  title="Close chat"
                  aria-label="Close chat"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500/90 text-white'
                        : 'bg-gray-800/90 text-gray-200'
                    } shadow-md relative group backdrop-blur-sm break-words`}
                  >
                    <p className="text-sm sm:text-base whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center justify-end gap-2 mt-2">
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => handleCopyMessage(message.content, message.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                          title="Copy message"
                          aria-label="Copy message"
                        >
                          {copiedMessageId === message.id ? (
                            <FaCheck className="w-3 h-3 text-green-400" />
                          ) : (
                            <FaCopy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                      <span className="text-xs opacity-50 group-hover:opacity-100 transition-opacity">
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-800/90 text-gray-200 p-3 rounded-lg shadow-md backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      <span className="text-sm text-gray-400">Typing{typingIndicator}</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-4 bg-gray-800/50 border-t border-white/10">
                <div className="grid grid-cols-1 gap-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-left p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm text-gray-200 transition-colors backdrop-blur-sm"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-gray-900/50">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isLoading ? "AI is thinking..." : "Type your message..."}
                  className="flex-1 bg-gray-800/90 text-white rounded-lg px-4 py-2 text-sm sm:text-base
                           focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm 
                           border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                  maxLength={500}
                />
                <motion.button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-600 
                           text-white rounded-lg hover:opacity-90 transition-opacity 
                           disabled:opacity-50 disabled:cursor-not-allowed 
                           flex items-center justify-center min-w-[44px]"
                  title="Send message"
                  aria-label="Send message"
                >
                  <FaPaperPlane className="w-4 h-4" />
                </motion.button>
              </div>
              {input.length > 400 && (
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {input.length}/500
                </p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot; 