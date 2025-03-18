'use client';
/* eslint-disable react/no-unescaped-entities */
import { useState, useCallback, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hello! I am Furkan's AI assistant. I can answer questions about Furkan, his skills, projects, and experience. What would you like to know? (Note: You can ask up to 3 questions)"
};

const SUGGESTION_QUESTIONS = [
  "What are Furkan's skills in frontend development?",
  "Tell me about Furkan's projects",
  "What is Furkan's background and experience?",
  "What technologies does Furkan work with?",
  "What are Furkan's interests in tech?"
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

    // Kullanıcı mesaj limitini kontrol et
    if (getUserMessageCount() >= 3) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, you've reached the maximum question limit (3). Please refresh the page to ask new questions."
      }]);
      return;
    }

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
      const assistantMessage: Message = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, assistantMessage]);

      // Kullanılan öneriyi kaldır ve yeni öneriler göster
      if (suggestedQuestion) {
        setSuggestions(prev => prev.filter(q => q !== suggestedQuestion));
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, an error occurred. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
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
          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600">
            <h3 className="text-white font-semibold">Chat with Furkan's AI Assistant</h3>
            <p className="text-white/80 text-sm mt-1">
              {remainingQuestions > 0 
                ? `Remaining questions: ${remainingQuestions}`
                : 'Question limit reached. Refresh the page to ask new questions.'}
            </p>
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
            {remainingQuestions > 0 && suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(question)}
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
                onKeyDown={handleKeyDown}
                placeholder={remainingQuestions > 0 
                  ? "Ask me anything about Furkan..."
                  : "Question limit reached"}
                className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading || remainingQuestions === 0}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim() || remainingQuestions === 0}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot; 