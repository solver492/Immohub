import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Samsar } from "@/components/Samsar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Pages
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import ListingDetail from "@/pages/ListingDetail";
import PublishListing from "@/pages/PublishListing";
import Cities from "@/pages/Cities";
import About from "@/pages/About";
import Estimate from "@/pages/Estimate";
import NewProperties from "@/pages/NewProperties";
import Contact from "@/pages/Contact";
import Help from "@/pages/Help";
import Notifications from "@/pages/Notifications";
import Store from "@/pages/Store";
import Logout from "@/pages/Logout";
import Performance from "@/pages/dashboard/Performance";
import MyListings from "@/pages/dashboard/MyListings";
import Stories from "@/pages/dashboard/Stories";
import Settings from "@/pages/dashboard/Settings";
import UsersManagement from "@/pages/dashboard/UsersManagement";
import Subscription from "@/pages/dashboard/Subscription";
import Documents from "@/pages/dashboard/Documents";
import PurchaseHistory from "@/pages/dashboard/PurchaseHistory";
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
      <div className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/recherche" component={Search} />
          <Route path="/annonce/:id" component={ListingDetail} />
          <Route path="/publier" component={PublishListing} />
          <Route path="/villes" component={Cities} />
          <Route path="/a-propos" component={About} />
          <Route path="/estimer" component={Estimate} />
          <Route path="/immobilier-neuf" component={NewProperties} />
          <Route path="/contact" component={Contact} />
          <Route path="/aide" component={Help} />
          <Route path="/notifications" component={Notifications} />
          <Route path="/store" component={Store} />
          <Route path="/deconnexion" component={Logout} />
          <Route path="/tableau-de-bord/rapport" component={Performance} />
          <Route path="/tableau-de-bord/annonces" component={MyListings} />
          <Route path="/tableau-de-bord/stories" component={Stories} />
          <Route path="/tableau-de-bord/parametres" component={Settings} />
          <Route path="/tableau-de-bord/utilisateurs" component={UsersManagement} />
          <Route path="/tableau-de-bord/abonnement" component={Subscription} />
          <Route path="/tableau-de-bord/documents" component={Documents} />
          <Route path="/tableau-de-bord/historique" component={PurchaseHistory} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
      <Samsar />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={(import.meta.env.BASE_URL ?? "/").replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
