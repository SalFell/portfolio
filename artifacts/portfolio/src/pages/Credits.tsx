import { Link } from "wouter";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export default function Credits() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[100dvh] bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      <div className="absolute top-8 left-8 z-20">
        <Link href="/select" className="font-pixel text-xs text-muted-foreground hover:text-white transition-colors" data-testid="link-back">
          ← BACK
        </Link>
      </div>

      {/* Scrolling Container */}
      <div className="w-full max-w-2xl h-[70vh] overflow-hidden relative mask-image-y">
        <motion.div 
          className="flex flex-col items-center text-center gap-24 py-[50vh]"
          animate={{ y: ["0%", "-100%"] }}
          transition={{ ease: "linear", duration: 20, repeat: Infinity }}
        >
          
          <div className="space-y-4">
            <h2 className="font-pixel text-3xl text-primary crt-glow" data-testid="text-credits-title">DIRECTOR</h2>
            <p className="font-mono text-xl text-gray-300">YOUR NAME HERE</p>
          </div>

          <div className="space-y-4">
            <h2 className="font-pixel text-2xl text-secondary">LEAD PROGRAMMER</h2>
            <p className="font-mono text-xl text-gray-300">YOUR NAME HERE</p>
          </div>

          <div className="space-y-8 w-full">
            <h2 className="font-pixel text-2xl text-green-400">SKILLS ACQUIRED</h2>
            <div className="grid grid-cols-2 gap-4 font-mono text-lg text-gray-400">
              <span>TypeScript</span>
              <span>React</span>
              <span>Node.js</span>
              <span>PostgreSQL</span>
              <span>UI/UX Design</span>
              <span>System Arch</span>
            </div>
          </div>

          <div className="space-y-8 max-w-xl mx-auto">
            <h2 className="font-pixel text-2xl text-yellow-400">ABOUT THE DEVELOPER</h2>
            <p className="font-sans text-lg leading-relaxed text-gray-300">
              Forged in the fires of late-night debugging sessions and fueled by endless caffeine. Dedicated to crafting interfaces that feel alive. The journey continues, always seeking the next level.
            </p>
          </div>

          <div className="space-y-8">
            <h2 className="font-pixel text-2xl text-primary">COMMUNICATION LINKS</h2>
            <div className="flex justify-center gap-8">
              <a href="#" className="p-4 border-2 border-border hover:border-primary hover:text-primary transition-colors bg-card"><Github size={32} /></a>
              <a href="#" className="p-4 border-2 border-border hover:border-secondary hover:text-secondary transition-colors bg-card"><Linkedin size={32} /></a>
              <a href="#" className="p-4 border-2 border-border hover:border-green-400 hover:text-green-400 transition-colors bg-card"><Twitter size={32} /></a>
              <a href="#" className="p-4 border-2 border-border hover:border-yellow-400 hover:text-yellow-400 transition-colors bg-card"><Mail size={32} /></a>
            </div>
          </div>

          <div className="pt-24 space-y-4">
            <h2 className="font-pixel text-4xl text-white crt-glow">THANK YOU</h2>
            <p className="font-pixel text-xl text-primary">FOR PLAYING</p>
          </div>

        </motion.div>
      </div>

      <style>{`
        .mask-image-y {
          mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
        }
      `}</style>
    </motion.div>
  );
}
