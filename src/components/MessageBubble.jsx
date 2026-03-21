import React from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, Bot, User, RefreshCw } from 'lucide-react';

const MessageBubble = ({ message, onRegenerate }) => {
    const [copied, setCopied] = React.useState(false);
    const isUser = message.role === 'user';

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`flex gap-4 w-full ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-6`}
        >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${isUser ? 'bg-gradient-to-tr from-indigo-500 to-purple-500' : 'bg-slate-800 border border-slate-700'}`}>
                {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-blue-400" />}
            </div>

            {/* Message Content */}
            <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
                <div
                    className={`relative px-5 py-3.5 shadow-sm rounded-2xl text-[15px] leading-relaxed ${isUser
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm'
                            : 'bg-slate-800/80 backdrop-blur-md border border-slate-700 text-slate-200 rounded-tl-sm'
                        }`}
                >
                    {message.content}
                </div>

                {/* Actions (Copy & Regenerate for Bot) */}
                {!isUser && (
                    <div className="flex gap-2 mt-2 opacity-50 hover:opacity-100 transition-opacity">
                        <button
                            onClick={handleCopy}
                            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                            title="Copy to clipboard"
                        >
                            {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                        {onRegenerate && (
                            <button
                                onClick={onRegenerate}
                                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                                title="Regenerate response"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MessageBubble;
