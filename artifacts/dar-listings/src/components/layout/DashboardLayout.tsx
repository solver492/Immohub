import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  ListChecks,
  PlusSquare,
  ImageIcon,
  Settings,
  Users,
  CreditCard,
  FileText,
  Receipt,
} from "lucide-react";

const sections: { heading: string; items: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[] }[] = [
  {
    heading: "Tableau de bord",
    items: [{ label: "Rapport de performance", href: "/tableau-de-bord/rapport", icon: BarChart3 }],
  },
  {
    heading: "Mes annonces",
    items: [
      { label: "Gestion annonce", href: "/tableau-de-bord/annonces", icon: ListChecks },
      { label: "Créer annonce", href: "/publier", icon: PlusSquare },
      { label: "Gestion des Stories", href: "/tableau-de-bord/stories", icon: ImageIcon },
    ],
  },
  {
    heading: "Mon compte",
    items: [
      { label: "Paramètres", href: "/tableau-de-bord/parametres", icon: Settings },
      { label: "Gestion utilisateurs", href: "/tableau-de-bord/utilisateurs", icon: Users },
      { label: "Mon abonnement", href: "/tableau-de-bord/abonnement", icon: CreditCard },
      { label: "Mes documents", href: "/tableau-de-bord/documents", icon: FileText },
      { label: "Historique d'achat", href: "/tableau-de-bord/historique", icon: Receipt },
    ],
  },
];

export function DashboardLayout({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const [location] = useLocation();

  return (
    <main className="container py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside className="hidden lg:block sticky top-24 self-start">
          <nav className="space-y-6">
            {sections.map((section) => (
              <div key={section.heading}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-3">
                  {section.heading}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = location === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                            active
                              ? "bg-primary text-primary-foreground font-semibold"
                              : "text-foreground hover:bg-muted"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <div>
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary">{title}</h1>
              {description && <p className="text-muted-foreground mt-2">{description}</p>}
            </div>
            {actions && <div className="flex gap-2">{actions}</div>}
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
