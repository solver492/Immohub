import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Home as HomeIcon,
  Banknote,
  Building2,
  Info,
  MessageSquare,
  LogOut,
  Globe,
  Bell,
  HelpCircle,
  ShoppingBag,
  ChevronDown,
  BarChart3,
  Settings,
  Users as UsersIcon,
  CreditCard,
  FileText,
  Receipt,
  ImageIcon,
  PlusSquare,
  ListChecks,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type LinkItem = { label: string; href: string; icon?: React.ComponentType<{ className?: string }> };

const groups: { title: string; icon: React.ComponentType<{ className?: string }>; items: LinkItem[] }[] = [
  {
    title: "Mes annonces",
    icon: ListChecks,
    items: [
      { label: "Gestion annonce", href: "/tableau-de-bord/annonces", icon: ListChecks },
      { label: "Créer annonce", href: "/publier", icon: PlusSquare },
      { label: "Gestion des Stories", href: "/tableau-de-bord/stories", icon: ImageIcon },
    ],
  },
  {
    title: "Mon compte",
    icon: Settings,
    items: [
      { label: "Paramètres", href: "/tableau-de-bord/parametres", icon: Settings },
      { label: "Gestion utilisateurs", href: "/tableau-de-bord/utilisateurs", icon: UsersIcon },
      { label: "Mon abonnement", href: "/tableau-de-bord/abonnement", icon: CreditCard },
      { label: "Mes documents", href: "/tableau-de-bord/documents", icon: FileText },
      { label: "Historique d'achat", href: "/tableau-de-bord/historique", icon: Receipt },
    ],
  },
  {
    title: "Dar Store",
    icon: ShoppingBag,
    items: [{ label: "Acheter des produits", href: "/store", icon: ShoppingBag }],
  },
];

const flatLinks: LinkItem[] = [
  { label: "Rapport de performance", href: "/tableau-de-bord/rapport", icon: BarChart3 },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Aide", href: "/aide", icon: HelpCircle },
];

const bottomLinks: LinkItem[] = [
  { label: "Page d'accueil", href: "/", icon: HomeIcon },
  { label: "Estimer votre bien", href: "/estimer", icon: Banknote },
  { label: "Immobilier neuf", href: "/immobilier-neuf", icon: Building2 },
  { label: "À propos de Immo-hub", href: "/a-propos", icon: Info },
  { label: "Contactez-nous", href: "/contact", icon: MessageSquare },
];

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const desktopNav = [
    { label: "Acheter", href: "/recherche?transaction=sale" },
    { label: "Louer", href: "/recherche?transaction=rent" },
    { label: "Immobilier neuf", href: "/immobilier-neuf" },
    { label: "Villes", href: "/villes" },
    { label: "Estimer", href: "/estimer" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-primary">
              Immo-hub
            </span>
          </Link>
          <nav className="hidden lg:flex gap-6">
            {desktopNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === item.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/publier" className="hidden sm:inline-block">
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">
              Publier une annonce
            </Button>
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Ouvrir le menu"
                className="p-2 rounded-md text-foreground hover:bg-muted transition-colors"
              >
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
              <SheetHeader className="bg-secondary text-secondary-foreground p-6 border-b">
                <SheetTitle className="font-serif text-2xl text-secondary-foreground text-left">
                  Bienvenue
                </SheetTitle>
                <p className="text-sm text-secondary-foreground/90 text-left">
                  Gérez vos annonces et votre compte
                </p>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-2">
                <SheetClose asChild>
                  <Link
                    href="/tableau-de-bord/rapport"
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold transition-colors",
                      location === "/tableau-de-bord/rapport"
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <BarChart3 className="h-4 w-4 shrink-0" />
                    Rapport de performance
                  </Link>
                </SheetClose>

                <Accordion type="multiple" defaultValue={["Mes annonces"]} className="w-full">
                  {groups.map((group) => {
                    const GroupIcon = group.icon;
                    return (
                      <AccordionItem key={group.title} value={group.title} className="border-b-0">
                        <AccordionTrigger className="px-4 py-3 text-sm font-semibold text-primary hover:no-underline rounded-md hover:bg-muted">
                          <span className="flex items-center gap-3">
                            <GroupIcon className="h-4 w-4" /> {group.title}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-1">
                          <div className="ml-4 border-l border-border pl-3 space-y-1">
                            {group.items.map((item) => {
                              const Icon = item.icon ?? ChevronDown;
                              const active = location === item.href;
                              return (
                                <SheetClose asChild key={item.href}>
                                  <Link
                                    href={item.href}
                                    className={cn(
                                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                                      active
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:text-primary hover:bg-muted"
                                    )}
                                  >
                                    <Icon className="h-3.5 w-3.5 shrink-0" />
                                    {item.label}
                                  </Link>
                                </SheetClose>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>

                <div className="mt-1">
                  {flatLinks.map((item) => {
                    const Icon = item.icon ?? ChevronDown;
                    const active = location === item.href;
                    return (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold transition-colors",
                            active
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-muted"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {item.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </div>

                <div className="mt-3 pt-3 border-t border-border">
                  {bottomLinks.map((item) => {
                    const Icon = item.icon ?? ChevronDown;
                    const active = location === item.href;
                    return (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-colors",
                            active
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-muted"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0 text-secondary" />
                          {item.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </div>

                <div className="mt-3 pt-3 border-t border-border">
                  <SheetClose asChild>
                    <Link
                      href="/deconnexion"
                      className="flex items-center gap-3 px-4 py-3 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      Déconnexion
                    </Link>
                  </SheetClose>

                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-3 rounded-md text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => {
                      // Display-only language toggle
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <Globe className="h-4 w-4 shrink-0 text-secondary" />
                      Français
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
