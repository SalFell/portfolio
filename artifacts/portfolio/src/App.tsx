import { Switch, Route, Router as WouterRouter } from "wouter";
import { useState, useEffect, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";
import BootScreen from "./pages/BootScreen";
import LevelSelect from "./pages/LevelSelect";
import LevelDetail from "./pages/LevelDetail";
import Credits from "./pages/Credits";
import { Scanlines } from "./components/Scanlines";

const queryClient = new QueryClient();

function useHashLocation(): [string, (to: string) => void] {
  const [path, setPath] = useState(() => window.location.hash.replace(/^#/, "") || "/");

  useEffect(() => {
    const onChange = () => {
      setPath(window.location.hash.replace(/^#/, "") || "/");
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = useCallback((to: string) => {
    window.location.hash = to;
  }, []);

  return [path, navigate];
}

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={BootScreen} />
        <Route path="/select" component={LevelSelect} />
        <Route path="/level/:id" component={LevelDetail} />
        <Route path="/credits" component={Credits} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter hook={useHashLocation}>
          <Scanlines />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
