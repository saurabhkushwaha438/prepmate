import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import ChatInterface from './components/ChatInterface';
import { generateChatResponse } from './services/api';
import { Settings, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Custom Alert state
  const [showAlert, setShowAlert] = useState(false);

  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('prepmate_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSaveKey = (key) => {
    setApiKey(key);
    localStorage.setItem('prepmate_api_key', key);
    setShowSettings(false);
  };

  const handleStart = (initialPrompt, mockMode) => {
    setIsMockMode(mockMode);
    setHasStarted(true);
    setMessages([]);
    setError(null);
    if (initialPrompt) {
      handleSendMessage(initialPrompt, mockMode, []);
    }
  };

  const handleSendMessage = async (content, mockModeOverride = null, currentMessages = messages) => {
    const activeMockMode = mockModeOverride !== null ? mockModeOverride : isMockMode;

    const newUserMessage = { id: Date.now().toString(), role: 'user', content };
    const updatedMessages = [...currentMessages, newUserMessage];

    setMessages(updatedMessages);
    setIsLoading(true);
    setError(null);

    try {
      const responseMessage = await generateChatResponse(updatedMessages, activeMockMode, apiKey);
      setMessages([...updatedMessages, { ...responseMessage, id: (Date.now() + 1).toString() }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (messages.length === 0) return;

    // Find the last user message to regenerate from
    const lastUserIndex = messages.map(m => m.role).lastIndexOf('user');
    if (lastUserIndex === -1) return;

    const messagesUpToLastUser = messages.slice(0, lastUserIndex + 1);
    setMessages(messagesUpToLastUser);

    setIsLoading(true);
    setError(null);

    generateChatResponse(messagesUpToLastUser, isMockMode, apiKey)
      .then(responseMessage => {
        setMessages([...messagesUpToLastUser, { ...responseMessage, id: Date.now().toString() }]);
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  const handleBack = () => {
    setHasStarted(false);
    setMessages([]);
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      setShowAlert(true);
    }
  };

  const confirmNewChat = () => {
    setMessages([]);
    setError(null);
    setShowAlert(false);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-primary/10 bg-surface text-on-surface">
      {/* Custom Alert Modal for New Chat */}
      <AnimatePresence>
        {showAlert && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative text-on-surface"
            >
              <button
                onClick={() => setShowAlert(false)}
                className="absolute top-5 right-5 text-on-surface-variant hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Start New Chat?</h3>
                <p className="text-sm text-on-surface-variant mb-6">
                  Are you sure you want to start a new chat? Your current history will be lost.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowAlert(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-outline-variant/50 font-semibold hover:bg-surface-dim transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmNewChat}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors shadow-md shadow-red-600/20"
                  >
                    Start Fresh
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {!hasStarted ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 overflow-y-auto bg-surface"
            >
              <Landing onSelectMode={handleStart} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 h-screen relative"
            >
              <ChatInterface
                messages={messages}
                isLoading={isLoading}
                error={error}
                onSendMessage={(content) => handleSendMessage(content)}
                onBack={handleBack}
                onNewChat={handleNewChat}
                onRegenerate={handleRegenerate}
                isMockMode={isMockMode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
