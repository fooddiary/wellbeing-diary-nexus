
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { initializeAppState } from "./store/useAppStore";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DiaryPage from "./pages/DiaryPage";
import SharePage from "./pages/SharePage";
import SettingsPage from "./pages/SettingsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotesPage from "./pages/NotesPage";
import AboutPage from "./pages/AboutPage";
import { Layout } from "./components/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { initLogger } from "./lib/errorLogger";
import { AgreementModal } from "./components/AgreementModal";
import TermsPage from "./pages/TermsPage";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const initApp = async () => {
      await initLogger();
      await initializeAppState();
    };
    initApp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AgreementModal />
        <Toaster />
        <Sonner />
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
              <Route element={
                <ErrorBoundary>
                  <Layout />
                </ErrorBoundary>
              }>
                <Route path="/" element={<Index />} />
                <Route path="/diary" element={<DiaryPage />} />
                <Route path="/share" element={<SharePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
