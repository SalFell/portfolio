import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { projects } from "../data/projects";

export default function LevelDetail() {
  const [, params] = useRoute("/level/:id");
  const projectId = params?.id ? parseInt(params.id, 10) : 1;
  const project = projects.find(p => p.id === projectId) || projects[0];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="min-h-[100dvh] bg-background text-foreground flex flex-col relative overflow-x-hidden"
    >
      {/* Top HUD */}
      <header className="p-6 md:p-8 flex justify-between items-start border-b-2 border-border/50 relative z-10 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border-2 flex items-center justify-center font-pixel text-xl" style={{ borderColor: project.color, color: project.color }}>
            {project.id}
          </div>
          <div>
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
                data-testid="link-project-url"
              >
                <h1 className="font-pixel text-xl md:text-3xl underline decoration-dotted underline-offset-4" style={{ color: project.color, textShadow: `0 0 10px ${project.color}66` }} data-testid="text-project-title">
                  {project.title}
                </h1>
                <span className="font-mono text-xs opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: project.color }}>↗</span>
              </a>
            ) : (
              <h1 className="font-pixel text-xl md:text-3xl" style={{ color: project.color, textShadow: `0 0 10px ${project.color}66` }} data-testid="text-project-title">
                {project.title}
              </h1>
            )}
            <p className="font-mono text-muted-foreground mt-2 text-sm">{project.subtitle}</p>
          </div>
        </div>
        <div className="text-right hidden md:block font-mono">
          <div className="text-sm text-muted-foreground mb-1">SCORE / COMPLEXITY</div>
          <div className="flex justify-end gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-8 h-3 border ${i < project.difficulty ? 'bg-current' : 'bg-transparent opacity-20'}`} style={{ borderColor: project.color, color: i < project.difficulty ? project.color : 'inherit' }} />
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto p-6 md:p-12 gap-12 relative z-10">
        
        {/* Left Col: Lore & Tech */}
        <div className="w-full md:w-1/2 flex flex-col gap-12">
          <section>
            <h2 className="font-pixel text-sm text-white mb-6 border-b border-border/50 pb-2">MISSION BRIEF</h2>
            <p className="font-sans text-lg leading-relaxed text-gray-300">
              {project.description}
            </p>
          </section>

          <section>
            <h2 className="font-pixel text-sm text-white mb-6 border-b border-border/50 pb-2">ACQUIRED TECH</h2>
            <div className="flex flex-wrap gap-4">
              {project.tech.map(tech => (
                <div key={tech} className="px-4 py-2 border-2 border-dashed flex items-center gap-2 bg-card/50" style={{ borderColor: project.color }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: project.color }} />
                  <span className="font-mono text-sm font-bold text-white tracking-wide">{tech}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Col: Visuals */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h2 className="font-pixel text-sm text-white mb-4 border-b border-border/50 pb-2">VISUAL DATA</h2>
          <div className="relative aspect-video w-full border-4 border-dashed p-2 bg-card/30" style={{ borderColor: `${project.color}44` }}>
            {project.videoId ? (
              <iframe
                className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)]"
                src={`https://www.youtube.com/embed/${project.videoId}`}
                title={`${project.title} video`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                data-testid="video-embed"
              />
            ) : (
              <div className="absolute inset-2 border border-border/50 flex flex-col items-center justify-center text-center overflow-hidden bg-background">
                <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at center, ${project.color} 0%, transparent 70%)` }} />
                <div className="w-32 h-32 border-4 animate-spin-slow" style={{ borderColor: project.color, borderRadius: project.id % 2 === 0 ? '50%' : '0' }} />
                <div className="mt-8 font-mono text-muted-foreground text-xs uppercase tracking-widest relative z-10">
                  VISUAL DATA UNAVAILABLE
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer / Actions */}
      <footer className="p-6 md:p-8 flex justify-center items-center border-t-2 border-border/50 relative z-10 mt-auto">
        <Link href="/select" data-testid="link-stage-clear">
          <button className="px-8 py-4 border-4 font-pixel text-lg transition-all hover:-translate-y-1 active:translate-y-1 crt-glow"
            style={{ 
              borderColor: project.color,
              color: project.color,
              backgroundColor: `${project.color}11`,
              boxShadow: `0 4px 0 ${project.color}66`
            }}
          >
            STAGE CLEAR
          </button>
        </Link>
      </footer>
    </motion.div>
  );
}
