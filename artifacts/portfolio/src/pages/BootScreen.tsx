import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function BootScreen() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center z-10"
      >
        <h1 className="text-4xl md:text-6xl font-pixel text-primary crt-glow mb-4" data-testid="text-title">
          Salvador Felipe 
        </h1>
        <div className="flex items-center justify-center gap-2 text-secondary mb-16 font-mono text-sm tracking-widest">
          <span>v2.0.24</span>
          <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
          <span>SYSTEM ONLINE</span>
        </div>
      </motion.div>

      {showPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-32 z-10"
        >
          <Link href="/select" className="group flex flex-col items-center gap-4 cursor-pointer outline-none" data-testid="link-start">
            <span className="font-pixel text-xl text-white group-hover:text-primary transition-colors crt-flicker">
              PRESS START
            </span>
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-primary animate-bounce mt-2" />
          </Link>
        </motion.div>
      )}

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 border border-primary/30 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-20 right-20 w-64 h-64 border border-secondary/20 rounded-full animate-ping" style={{ animationDuration: '5s' }} />
      </div>
    </div>
  );
}
