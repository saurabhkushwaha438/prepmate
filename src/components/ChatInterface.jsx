import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ParsedBotMessage = ({ content }) => {
    const sections = [];
    const lines = content.split('\n');
    let currentType = 'text';
    let currentContent = [];

    const flush = () => {
        if (currentContent.length > 0) {
            const joined = currentContent.join('\n').trim();
            if (joined) {
                const cleanContent = joined.replace(/^---\n?|\n?---$/g, '').trim();
                if (cleanContent) {
                    sections.push({ type: currentType, content: cleanContent });
                }
            }
            currentContent = [];
        }
    };

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        if (/^(###\s*)?\*\*(Question\s*\d*:?.*)\*\*/i.test(line) || /^###\s+Question/i.test(line)) {
            flush();
            currentType = 'question';
            currentContent.push(line);
        } else if (/^(###\s*)?\*\*(Answer:?.*)\*\*/i.test(line) || /^###\s+Answer/i.test(line)) {
            flush();
            currentType = 'answer';
            currentContent.push(line);
        } else if (/^(###\s*)?\*\*([💡]?\s*Interview Tip:?.*)\*\*/i.test(line) || /^###\s+(💡\s*)?Interview Tip/i.test(line) || /^\*\*(Tip:?.*)\*\*/i.test(line)) {
            flush();
            currentType = 'tip';
            currentContent.push(line);
        } else if (line.trim() === '---') {
            flush();
            currentType = 'text';
        } else {
            currentContent.push(line);
        }
    }
    flush();

    return (
        <div className="space-y-4 w-full text-[14px] leading-relaxed">
            {sections.map((sec, idx) => {
                const mkComponents = {
                    h3: ({ node, ...props }) => <h3 className="text-[15px] font-bold mb-2 mt-1" {...props} />,
                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
                    li: ({ node, ...props }) => <li className="" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                    a: ({ node, ...props }) => <a className="text-primary hover:underline font-medium" {...props} />,
                    code: ({ node, inline, ...props }) => inline
                        ? <code className="bg-black/5 text-pink-600 rounded px-1.5 py-0.5 text-[13px] font-mono" {...props} />
                        : <code className="block bg-surface-dim p-3 rounded-lg text-[13px] font-mono overflow-x-auto my-2" {...props} />
                };

                if (sec.type === 'question') {
                    return (
                        <div key={idx} className="bg-primary/5 border border-primary/20 rounded-xl p-4 shadow-sm">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ ...mkComponents, h3: ({ node, ...props }) => <h3 className="text-primary font-bold text-[15px] mb-2" {...props} />, strong: ({ node, ...props }) => <strong className="font-semibold text-primary" {...props} /> }}>
                                {sec.content}
                            </ReactMarkdown>
                        </div>
                    );
                } else if (sec.type === 'answer') {
                    return (
                        <div key={idx} className="bg-white border border-outline/40 rounded-xl p-5 shadow-sm">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mkComponents}>
                                {sec.content}
                            </ReactMarkdown>
                        </div>
                    );
                } else if (sec.type === 'tip') {
                    const cleanContent = sec.content.replace(/^(###\s*)?\*\*([💡]?\s*Interview Tip:?)\*\*\s*/i, '').replace(/^(###\s*)?\*\*(Tip:?)\*\*\s*/i, '');
                    return (
                        <div key={idx} className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 shadow-[0_2px_10px_-4px_rgba(245,158,11,0.2)]">
                            <span className="text-amber-500 text-[20px] shrink-0 mt-0.5" style={{ fontFamily: 'system-ui' }}>💡</span>
                            <div className="flex-1 text-amber-950">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ ...mkComponents, strong: ({ node, ...props }) => <strong className="font-bold text-amber-950" {...props} /> }}>
                                    {cleanContent}
                                </ReactMarkdown>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div key={idx} className="text-on-surface">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mkComponents}>
                                {sec.content}
                            </ReactMarkdown>
                        </div>
                    );
                }
            })}
        </div>
    );
};

const ChatInterface = ({ messages, isLoading, error, onSendMessage, onBack, onRegenerate, isMockMode, onNewChat }) => {
    const messagesEndRef = useRef(null);
    const [inputVal, setInputVal] = useState("");
    
    // Voice Agent States
    const [botVoiceEnabled, setBotVoiceEnabled] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const lastSpokenMessageId = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-IN'; // Optimizes for Indian accents, improving accuracy
            
            recognition.onresult = (event) => {
                let currentTranscript = "";
                for (let i = 0; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setInputVal(currentTranscript);
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };
            
            recognitionRef.current = recognition;
        }
    }, []);

    // Text to Speech
    useEffect(() => {
        if (messages.length > 0 && botVoiceEnabled) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role !== 'user' && lastMessage.id !== lastSpokenMessageId.current) {
                lastSpokenMessageId.current = lastMessage.id;
                window.speechSynthesis.cancel();
                
                const textToSpeak = lastMessage.content
                    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Strip bold
                    .replace(/(\*|_)(.*?)\1/g, '$2') // Strip italic
                    .replace(/###/g, '')
                    .replace(/##/g, '')
                    .replace(/#/g, '')
                    .replace(/`/g, '')
                    .replace(/---/g, '')
                    .replace(/💡/g, '')
                    .replace(/Question:/gi, '')
                    .replace(/Answer:/gi, '')
                    .replace(/Interview Tip:/gi, '')
                    .trim();
                    
                const utterance = new SpeechSynthesisUtterance(textToSpeak);
                
                // Find a more natural voice (Google or Microsoft Natural)
                const voices = window.speechSynthesis.getVoices();
                const naturalVoice = voices.find(v => 
                    (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium')) && v.lang.startsWith('en')
                ) || voices.find(v => v.lang.startsWith('en-US') || v.lang.startsWith('en-GB'));
                
                if (naturalVoice) {
                    utterance.voice = naturalVoice;
                }
                
                // Slow down slightly for clarity
                utterance.rate = 1.0;
                utterance.pitch = 1.0;

                window.speechSynthesis.speak(utterance);
            }
        }
    }, [messages, botVoiceEnabled]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setInputVal(""); // Clear before speaking
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const toggleBotVoice = () => {
        setBotVoiceEnabled(prev => {
            const next = !prev;
            if (!next) {
                window.speechSynthesis.cancel();
            } else {
                lastSpokenMessageId.current = null;
            }
            return next;
        });
    };

    const handleSend = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        }
        if (inputVal.trim() && !isLoading) {
            onSendMessage(inputVal.trim());
            setInputVal("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex h-screen w-full bg-surface-dim font-body text-on-surface antialiased overflow-hidden selection:bg-primary/10">

            {/* SideNavBar */}
            <aside className="hidden md:flex flex-col h-screen w-64 bg-surface-dim border-r border-outline/50 p-4 gap-6 shrink-0 relative z-10">
                <div className="flex items-center gap-2.5 px-2 py-2 cursor-pointer" onClick={onBack}>
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-white !text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                    </div>
                    <h1 className="text-sm font-bold tracking-tight text-on-surface hover:text-primary transition-colors">PrepMate</h1>
                </div>

                <button onClick={onNewChat} className="w-full h-10 px-4 bg-white border border-outline text-on-surface rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-surface-dim hover:border-primary/30 active:scale-[0.98] transition-all shadow-sm">
                    <span className="material-symbols-outlined !text-[18px]">add</span>
                    New Chat
                </button>




            </aside>

            {/* Main Content Canvas */}
            <main className="flex-1 flex flex-col bg-white relative">
                {/* Header */}
                <header className="h-14 flex flex-shrink-0 items-center justify-between px-6 border-b border-outline/50 z-20 bg-white">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="md:hidden p-1.5 text-on-surface-variant hover:text-primary">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div className="flex items-center gap-2">
                            <h2 className="text-[13px] font-semibold text-on-surface">
                                {isMockMode ? "Mock Interview Session" : "Concept Session"}
                            </h2>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Active</span>
                        </div>
                    </div>
                    <button 
                        onClick={toggleBotVoice}
                        className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${botVoiceEnabled ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-dim'}`}
                        title={botVoiceEnabled ? "Disable Bot Voice" : "Enable Bot Voice"}
                    >
                        <span className="material-symbols-outlined !text-[20px]">
                            {botVoiceEnabled ? "volume_up" : "volume_off"}
                        </span>
                    </button>
                </header>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto px-4 md:px-12 py-8 space-y-8 scroll-smooth">
                    {messages.length === 0 && !isLoading && (
                        <div className="flex flex-col text-center mt-20 opacity-80">
                            <p className="text-on-surface-variant">Your session has started. Say hello to begin!</p>
                        </div>
                    )}

                    {messages.map((msg, index) => {
                        const isUser = msg.role === 'user';
                        return isUser ? (
                            /* User Message */
                            <div key={index} className="flex gap-4 justify-end max-w-3xl ml-auto chat-bubble-animate" style={{ animationDelay: '0.1s' }}>
                                <div className="bg-primary text-white px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-sm text-[14px] leading-relaxed max-w-[85%] whitespace-pre-wrap">
                                    {msg.content}
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-surface-dim overflow-hidden shrink-0 border border-outline/50 flex flex-col items-center justify-center text-on-surface-variant">
                                    <span className="material-symbols-outlined !text-[18px]">person</span>
                                </div>
                            </div>
                        ) : (
                            /* Bot Message */
                            <div key={index} className="flex gap-4 max-w-3xl chat-bubble-animate" style={{ animationDelay: '0.1s' }}>
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary !text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                                </div>
                                <div className="space-y-4 flex-1 w-full overflow-hidden">
                                    <ParsedBotMessage content={msg.content} />
                                    <div className="flex items-center gap-3 text-on-surface-variant/60">
                                        <button onClick={() => navigator.clipboard.writeText(msg.content)} className="p-1 hover:text-primary transition-colors" title="Copy">
                                            <span className="material-symbols-outlined !text-[16px]">content_copy</span>
                                        </button>
                                        {index === messages.length - 1 && onRegenerate && (
                                            <button onClick={onRegenerate} className="p-1 hover:text-primary transition-colors" title="Regenerate">
                                                <span className="material-symbols-outlined !text-[16px]">refresh</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Typing Indicator */}
                    {isLoading && (
                        <div className="flex gap-4 max-w-3xl opacity-60">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary !text-[18px]">smart_toy</span>
                            </div>
                            <div className="bg-surface-dim px-4 py-2.5 rounded-full flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></div>
                                <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></div>
                                <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="flex gap-4 max-w-3xl p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[14px]">
                            {error}
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-outline/30 bg-white/80 backdrop-blur-sm p-4 md:p-6 shrink-0 z-20">
                    <div className="max-w-3xl mx-auto space-y-4">
                        {messages.length < 2 && (
                            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                                {["What is deadlock?", "Explain normalization", "System Design basics"].map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onSendMessage(s)}
                                        className="shrink-0 px-3 py-1.5 bg-surface-dim border border-outline/50 rounded-full text-[12px] font-medium text-on-surface-variant hover:border-primary/30 hover:bg-white hover:text-primary transition-all active:scale-95"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="relative flex items-end bg-white border border-outline rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all">
                            <button disabled className="p-3.5 text-on-surface-variant opacity-50 cursor-not-allowed">
                                <span className="material-symbols-outlined !text-[20px]">attach_file</span>
                            </button>

                            <textarea
                                value={inputVal}
                                onChange={(e) => setInputVal(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                                className="w-full py-3.5 px-0 bg-transparent border-none focus:outline-none focus:ring-0 text-[14px] resize-none max-h-32 min-h-[48px] leading-relaxed placeholder:text-on-surface-variant/50"
                                placeholder="Message PrepMate..."
                                rows="1"
                            />

                            <div className="flex items-center gap-1 p-2">
                                <button 
                                    onClick={toggleListening}
                                    disabled={isLoading || !recognitionRef.current}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'text-on-surface-variant hover:bg-surface-dim'}`}
                                    title={isListening ? "Stop Recording" : "Start Voice Input"}
                                >
                                    <span className="material-symbols-outlined !text-[18px]">{isListening ? 'stop_circle' : 'mic'}</span>
                                </button>
                                <button
                                    onClick={handleSend}
                                    disabled={!inputVal.trim() || isLoading}
                                    className="w-9 h-9 flex items-center justify-center bg-primary disabled:bg-outline disabled:text-on-surface-variant text-white rounded-lg hover:opacity-90 active:scale-95 shadow-sm transition-all"
                                >
                                    <span className="material-symbols-outlined !text-[18px] !font-bold">arrow_upward</span>
                                </button>
                            </div>
                        </div>
                        <p className="text-[10px] text-center text-on-surface-variant/40 font-medium">
                            PrepMate is an AI assistant and may provide inaccurate information.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChatInterface;
