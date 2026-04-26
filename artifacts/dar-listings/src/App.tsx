import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Pages
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import ListingDetail from "@/pages/ListingDetail";
import PublishListing from "@/pages/PublishListing";
import Cities from "@/pages/Cities";
import About from "@/pages/About";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  }
});

function Router() {
  return (
    <div className="min-h-[100dvh] flex flex-col w-full">
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/recherche" component={Search} />
        <Route path="/annonce/:id" component={ListingDetail} />
        <Route path="/publier" component={PublishListing} />
        <Route path="/villes" component={Cities} />
        <Route path="/a-propos" component={About} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
