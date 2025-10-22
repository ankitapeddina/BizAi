import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Upload } from 'lucide-react';

interface Message {
  text: string;
  isBot: boolean;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello! I\'m your Business AI Assistant. How can I help you today?', isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInput('');
    setIsLoading(true);

    try {
      if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API key not found. Please check your .env file.');
      }

      // Add delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an expert business analyst assistant. Provide concise, actionable business advice.
              Focus on practical insights for business growth, data analysis, and strategic recommendations.
              Keep responses clear and under 200 words. Be helpful and specific.`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit: Please wait 20 seconds and try again. New keys have temporary limits.');
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      setMessages(prev => [...prev, {
        text: aiResponse,
        isBot: true
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('429')) {
          errorMessage = '⏳ New API key rate limit. Wait 20 seconds then try again - this will resolve soon.';
        } else if (error.message.includes('401')) {
          errorMessage = '🔑 API key invalid. Please check your new API key in the .env file.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setMessages(prev => [...prev, {
        text: errorMessage,
        isBot: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setInput(`I've uploaded a file: ${file.name}. Can you analyze this data?`);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        aria-label="Open chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h3 className="font-semibold">Business AI Assistant</h3>
            <p className="text-xs opacity-90">
              {OPENAI_API_KEY ? '✅ New API Key Loaded • GPT-3.5-turbo' : '❌ Add API Key to .env'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="p-3 bg-blue-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">Quick actions:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleQuickAction('Give me 3 practical business growth recommendations')}
                className="px-3 py-1 bg-white dark:bg-gray-600 text-xs rounded-full border border-blue-200 dark:border-gray-500 hover:bg-blue-100 dark:hover:bg-gray-500 transition-colors"
                disabled={!OPENAI_API_KEY}
              >
                💡 Growth Tips
              </button>
              <button
                onClick={() => handleQuickAction('How can I improve customer satisfaction?')}
                className="px-3 py-1 bg-white dark:bg-gray-600 text-xs rounded-full border border-blue-200 dark:border-gray-500 hover:bg-blue-100 dark:hover:bg-gray-500 transition-colors"
                disabled={!OPENAI_API_KEY}
              >
                😊 Customer Help
              </button>
              <button
                onClick={() => handleQuickAction('Simple inventory management tips')}
                className="px-3 py-1 bg-white dark:bg-gray-600 text-xs rounded-full border border-blue-200 dark:border-gray-500 hover:bg-blue-100 dark:hover:bg-gray-500 transition-colors"
                disabled={!OPENAI_API_KEY}
              >
                📦 Inventory Tips
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2 rounded-lg ${
                    msg.isBot
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-300">Connecting to AI...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={OPENAI_API_KEY ? "Ask me anything about business..." : "Add new API key to .env file"}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                disabled={isLoading || !OPENAI_API_KEY}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim() || !OPENAI_API_KEY}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            {OPENAI_API_KEY && (
              <p className="text-xs text-green-600 mt-2">
                ✅ New API key detected. Rate limits usually resolve in 10-20 minutes.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}