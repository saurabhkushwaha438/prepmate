import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const InputBox = ({ onSend, isLoading }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSend(input.trim());
            setInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full relative">
            <div className="relative flex items-end gap-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-2 rounded-2xl shadow-xl transition-all focus-within:bg-slate-800/80 focus-within:border-blue-500/50">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question or practice an answer..."
                    className="flex-1 max-h-32 min-h-[44px] bg-transparent text-slate-100 placeholder-slate-400 resize-none p-3 focus:outline-none text-[15px]"
                    rows={1}
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-3 mb-1 mr-1 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors flex items-center justify-center shadow-lg shadow-blue-500/20"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </motion.button>
            </div>
        </form>
    );
};

export default InputBox;
