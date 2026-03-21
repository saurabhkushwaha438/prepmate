import React from 'react';

const Landing = ({ onSelectMode }) => {
    return (
        <div className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-primary min-h-screen">
            {/* TopNavBar Shell */}
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
                <div className="flex justify-between items-center px-8 py-4 rounded-2xl border border-outline-variant/10 bg-primary/5 backdrop-blur-lg shadow-xl shadow-black/5">

                    {/* Logo */}
                    <div className="text-2xl font-extrabold tracking-tight text-slate-900 font-headline">
                        PrepMate
                    </div>

                    {/* Center Links */}
                    <div className="hidden md:flex items-center gap-10">
                    </div>

                    {/* Button */}
                    <div className="flex items-center">
                        <button
                            className="px-7 py-2.5 rounded-full primary-gradient text-white text-sm font-semibold active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
                            onClick={() =>
                                document.getElementById("forscroll").scrollIntoView({ behavior: "smooth" })
                            }
                        >
                            Get Started
                        </button>
                    </div>

                </div>
            </nav>

            <main className="relative overflow-hidden">
                {/* Hero Background Pattern Overlay */}
                <div className="absolute inset-0 hero-pattern pointer-events-none"></div>

                {/* Hero Section */}
                <section className="relative pt-44 pb-32 max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[11px] font-bold tracking-[0.15em] uppercase mb-10 border border-primary/10">
                        <span className="material-symbols-outlined text-sm" data-icon="auto_awesome">auto_awesome</span>
                        Next-Gen Interview Coach
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-on-surface tracking-tight leading-[1.05] mb-8 font-headline">
                        PrepMate – Crack Your <br />
                        <span className="text-white bg-clip-text primary-gradient">Placement Interviews</span>
                    </h1>
                    <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-14 font-body font-normal leading-relaxed">
                        Practice OS, DBMS, CN, and HR questions with an AI mentor designed to simulate the intensity of real-world technical evaluations.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        <button className="w-full sm:w-auto px-10 py-4 rounded-2xl primary-gradient text-white text-base font-bold shadow-2xl shadow-primary/30 hover:shadow-primary/40 active:scale-95 transition-all"
                            onClick={() =>
                                document.getElementById("forscroll").scrollIntoView({ behavior: "smooth" })
                            }>
                            Get Started
                        </button>
                    </div>
                </section>

                {/* Main Content: Bento-inspired Core Features */}
                <section id='forscroll' className="max-w-7xl mx-auto px-6 py-24">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                        {/* OS Interview Prep Card */}
                        <div
                            onClick={() => onSelectMode('Start an OS interview prep session.', false)}
                            className="md:col-span-8 bg-surface-container-lowest p-10 rounded-3xl flex flex-col justify-between group cursor-pointer transition-all duration-500 hover:-translate-y-2 card-glow border border-transparent hover:border-primary/10"
                        >
                            <div className="flex justify-between items-start mb-16">
                                <div className="p-5 rounded-2xl bg-surface-container-low text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                                    <span className="material-symbols-outlined text-4xl" data-icon="terminal">terminal</span>
                                </div>
                                <div className="text-[10px] font-bold tracking-widest text-outline-variant px-4 py-1.5 border border-outline-variant/20 rounded-full">
                                    MODULE 01
                                </div>
                            </div>
                            <div>
                                <h3 className="text-3xl font-extrabold mb-4 tracking-tight">OS Interview Prep</h3>
                                <p className="text-on-surface-variant leading-relaxed max-w-md text-base">
                                    Master threading, memory management, and process scheduling with real-time feedback on your conceptual clarity.
                                </p>
                            </div>
                            <div className="mt-12 flex items-center gap-3 text-primary font-bold text-sm tracking-wide">
                                EXPLORE TOPICS <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1.5" data-icon="arrow_forward">arrow_forward</span>
                            </div>
                        </div>

                        {/* DBMS Concepts Card */}
                        <div
                            onClick={() => onSelectMode('Start a DBMS concepts review.', false)}
                            className="md:col-span-4 bg-surface-container-low p-10 rounded-3xl flex flex-col group cursor-pointer transition-all duration-500 hover:-translate-y-2 card-glow border border-transparent hover:border-primary/10 hover:bg-surface-container-lowest"
                        >
                            <div className="mb-16">
                                <div className="p-5 rounded-2xl bg-white text-primary inline-block shadow-sm">
                                    <span className="material-symbols-outlined text-4xl" data-icon="database">database</span>
                                </div>
                            </div>
                            <div className="mt-auto">
                                <h3 className="text-2xl font-bold mb-3 tracking-tight">DBMS Concepts</h3>
                                <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
                                    SQL optimization, Normalization, and ACID properties simplified through visual architecture.
                                </p>
                                <div className="h-1.5 w-16 bg-primary/20 rounded-full overflow-hidden">
                                    <div className="h-full w-1/2 bg-primary"></div>
                                </div>
                            </div>
                        </div>

                        {/* HR Questions Card */}
                        <div
                            onClick={() => onSelectMode('Start an HR interview practice session.', false)}
                            className="md:col-span-4 bg-surface-container-low p-10 rounded-3xl flex flex-col group cursor-pointer transition-all duration-500 hover:-translate-y-2 card-glow border border-transparent hover:border-secondary/10 hover:bg-surface-container-lowest"
                        >
                            <div className="mb-16">
                                <div className="p-5 rounded-2xl bg-white text-secondary inline-block shadow-sm">
                                    <span className="material-symbols-outlined text-4xl" data-icon="person_search">person_search</span>
                                </div>
                            </div>
                            <div className="mt-auto">
                                <h3 className="text-2xl font-bold mb-3 tracking-tight">HR Questions</h3>
                                <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
                                    Behavioral frameworks and STAR method coaching for the final hurdle of your placement.
                                </p>
                                <div className="h-1.5 w-16 bg-secondary/20 rounded-full overflow-hidden">
                                    <div className="h-full w-2/3 bg-secondary"></div>
                                </div>
                            </div>
                        </div>

                        {/* Mock Interview Mode Card */}
                        <div
                            onClick={() => onSelectMode('Start a Mock Interview Mode session.', true)}
                            className="md:col-span-8 bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant/10 flex flex-col md:flex-row gap-10 items-center group cursor-pointer transition-all duration-500 hover:-translate-y-2 card-glow hover:border-primary/10"
                        >
                            <div className="flex-1">
                                <div className="inline-block px-3 py-1 rounded-md bg-error-container/50 text-on-error-container text-[10px] font-bold uppercase tracking-wider mb-5">
                                    Live Beta
                                </div>
                                <h3 className="text-3xl font-extrabold mb-4 tracking-tight">Mock Interview Mode</h3>
                                <p className="text-on-surface-variant leading-relaxed text-base">
                                    Simulate a full 45-minute technical round with an AI agent that adapts its difficulty based on your performance.
                                </p>
                                <div className="mt-8 flex items-center gap-6">
                                    <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-lg text-primary" data-icon="timer">timer</span> 45 MINS
                                    </span>
                                    <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-lg text-primary" data-icon="analytics">analytics</span> INSTANT SCORE
                                    </span>
                                </div>
                            </div>
                            <div className="w-full md:w-56 h-40 md:h-56 bg-surface-container-low rounded-2xl flex items-center justify-center overflow-hidden relative shrink-0">
                                <div className="w-24 h-24 rounded-full primary-gradient animate-pulse blur-2xl absolute opacity-20"></div>
                                <span className="material-symbols-outlined text-6xl text-primary relative z-10" data-icon="psychology">psychology</span>
                            </div>
                        </div>

                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="w-full py-16 bg-white border-t border-slate-100">
                <div className="flex flex-col md:flex-row justify-center items-center px-8 max-w-7xl mx-auto gap-3">



                    <a
                        href="https://www.linkedin.com/in/saurabhkushwaha438/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm font-medium hover:underline"
                    >
                        <div className="text-on-surface-variant font-sans text-[10px] font-bold uppercase tracking-[0.2em]">
                            Made By Saurabh
                        </div>
                    </a>

                </div>
            </footer>
        </div>
    );
};

export default Landing;
