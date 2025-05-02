'use client';
/* eslint-disable react/no-unescaped-entities */
import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaRedo, FaPaperPlane } from 'react-icons/fa';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hi! 👋 I'm Furkan's AI assistant. I can tell you all about his skills, projects, experience, and more. What would you like to know?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
  const [suggestions, setSuggestions] = useState<string[]>(SUGGESTION_QUESTIONS);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState('');
  const [conversationId, setConversationId] = useState<string>(() => 
    Math.random().toString(36).substring(2, 15)
  );

  // Otomatik scroll
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, scrollToBottom]);

  // Typing indicator effect
  useEffect(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        setTypingIndicator(prev => {
          if (prev.length >= 3) return '';
          return prev + '.';
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  const getUserMessageCount = () => {
    return messages.filter(msg => msg.role === 'user').length;
  };

  const handleSuggestionClick = (question: string) => {
    setInput(question);
    handleSubmit(null, question);
  };

  const handleSubmit = async (e: React.FormEvent | null, suggestedQuestion?: string) => {
    if (e) e.preventDefault();
    const messageToSend = suggestedQuestion || input;
    if ((!messageToSend.trim() && !suggestedQuestion) || isLoading) return;

    const userMessage: Message = { 
      role: 'user', 
      content: messageToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          message: messageToSend,
          conversationId,
          previousMessages: messages.slice(-4).map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Invalid response format: ${text.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred while processing your request');
      }

      if (!data.response) {
        throw new Error('No response received from server');
      }

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Update suggestions based on context
      if (suggestedQuestion) {
        const remainingSuggestions = SUGGESTION_QUESTIONS.filter(q => 
          q !== suggestedQuestion && 
          !messages.some(m => m.role === 'user' && m.content === q)
        );
        const shuffled = [...remainingSuggestions].sort(() => Math.random() - 0.5);
        setSuggestions(shuffled.slice(0, 3));
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An error occurred while processing your request. Please try again.';
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${errorMessage}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
    setSuggestions(SUGGESTION_QUESTIONS.sort(() => Math.random() - 0.5).slice(0, 3));
    setInput('');
    setConversationId(Math.random().toString(36).substring(2, 15));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const remainingQuestions = 3 - getUserMessageCount();

  return (
    <div className="relative">
      {/* Main chat button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold 
                 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 overflow-hidden group
                 backdrop-blur-sm bg-opacity-90 border border-white/10 z-50"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 
                      group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
        
        {/* Button content */}
        <div className="relative z-10 flex items-center space-x-2">
          <FaRobot className="w-5 h-5" />
          <span>Chat with AI</span>
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 w-96 bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-2xl border border-white/10 flex flex-col overflow-hidden z-50"
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[60vh]">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500/90 text-white'
                        : 'bg-gray-800/90 text-gray-200'
                    } shadow-md relative group backdrop-blur-sm`}
                  >
                    {message.content}
                    <span className="text-xs opacity-50 absolute bottom-1 right-1 group-hover:opacity-100 transition-opacity">
                      {message.timestamp}
                    </span>
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
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-800/90 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm border border-white/10"
                  disabled={isLoading}
                />
                <motion.button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <FaPaperPlane className="w-4 h-4" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot; 