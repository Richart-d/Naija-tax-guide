import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/Home";
import Classifier from "@/pages/Classifier";
import Assessment from "@/pages/Assessment";
import Learn from "@/pages/Learn";
import Checklist from "@/pages/Checklist";
import NotFound from "@/pages/not-found";
import { Navigation } from "@/components/Navigation";
import { TaxBot } from "@/components/TaxBot";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/classifier" component={Classifier} />
      <Route path="/assessment" component={Assessment} />
      <Route path="/learn" component={Learn} />
      <Route path="/checklist" component={Checklist} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex min-h-screen flex-col font-sans">
          <Navigation />
          <main className="flex-1">
            <Router />
          </main>
          <TaxBot />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
