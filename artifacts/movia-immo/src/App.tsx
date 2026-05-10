import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/Home";
import CataloguePage from "@/pages/Catalogue";
import BienDetailPage from "@/pages/BienDetail";
import PublierPage from "@/pages/Publier";
import VillesPage from "@/pages/Villes";
import InvestissementPage from "@/pages/Investissement";
import ProjetsPage from "@/pages/Projets";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/biens" component={CataloguePage} />
        <Route path="/bien/:id" component={BienDetailPage} />
        <Route path="/publier" component={PublierPage} />
        <Route path="/villes" component={VillesPage} />
        <Route path="/investissement" component={InvestissementPage} />
        <Route path="/projets" component={ProjetsPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <I18nProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </I18nProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
