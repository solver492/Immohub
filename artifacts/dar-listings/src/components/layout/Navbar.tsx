import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Acheter", href: "/recherche?transaction=sale" },
    { label: "Louer", href: "/recherche?transaction=rent" },
    { label: "Villes", href: "/villes" },
    { label: "À propos", href: "/a-propos" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-primary">
              Dar Listings
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
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
        <div className="hidden md:flex items-center gap-4">
          <Link href="/publier">
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">
              Publier une annonce
            </Button>
          </Link>
        </div>
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden border-t p-4 flex flex-col gap-4 bg-background">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium p-2 block",
                location === item.href ? "text-primary font-bold bg-muted" : "text-muted-foreground hover:text-primary"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link href="/publier" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">
                Publier une annonce
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
