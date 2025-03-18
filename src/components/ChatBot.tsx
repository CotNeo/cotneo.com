'use client';
/* eslint-disable react/no-unescaped-entities */
import { useState, useCallback, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hi! 👋 I'm Furkan's AI assistant. I can tell you all about his skills, projects, experience, and more. What would you like to know?"
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

  const getUserMessageCount = () => {
    return messages.filter(msg => msg.role === 'user').length;
  };

  const handleSuggestionClick = (question: string) => {
    if (getUserMessageCount() >= 3) return;
    setInput(question);
    handleSubmit(null, question);
  };

  const handleSubmit = async (e: React.FormEvent | null, suggestedQuestion?: string) => {
    if (e) e.preventDefault();
    const messageToSend = suggestedQuestion || input;
    if ((!messageToSend.trim() && !suggestedQuestion) || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred while processing your request');
      }

      if (!data.response) {
        throw new Error('No response received from server');
      }

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.response
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
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: error instanceof Error ? error.message : 'An error occurred while processing your request. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
    setSuggestions(SUGGESTION_QUESTIONS.sort(() => Math.random() - 0.5).slice(0, 3));
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const remainingQuestions = 3 - getUserMessageCount();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 h-[500px] bg-gray-900 rounded-lg shadow-2xl border border-gray-800 flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 flex justify-between items-center">
            <div>
              <h3 className="text-white font-semibold">Chat with Furkan's AI Assistant</h3>
              <p className="text-white/80 text-sm mt-1">Ask me anything about Furkan!</p>
            </div>
            <button
              onClick={handleReset}
              className="text-white/80 hover:text-white transition-colors"
              title="Reset conversation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-200'
                  } shadow-md`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-gray-800 text-gray-200 p-3 rounded-lg shadow-md">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            {/* Önerilen Sorular */}
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">You might want to ask:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSubmit(null, question)}
                      className="text-sm bg-gray-800 text-gray-300 px-3 py-1 rounded-full hover:bg-gray-700 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
                placeholder="Ask me anything about Furkan..."
                className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Send'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot; 