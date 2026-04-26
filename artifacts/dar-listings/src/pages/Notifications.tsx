import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, MessageSquare, Eye, Crown, AlertCircle, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Notif = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  time: string;
  read: boolean;
  accent: string;
};

const initial: Notif[] = [
  {
    id: "n1",
    icon: MessageSquare,
    title: "Nouveau message",
    description: "Karim T. souhaite visiter votre Villa à Anfa.",
    time: "Il y a 12 min",
    read: false,
    accent: "bg-secondary/10 text-secondary",
  },
  {
    id: "n2",
    icon: Eye,
    title: "Pic de vues",
    description: "Votre Riad à Marrakech a été vu 142 fois aujourd'hui.",
    time: "Il y a 2 h",
    read: false,
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "n3",
    icon: Crown,
    title: "Boost terminé",
    description: "Le boost de votre annonce Studio à Tanger est arrivé à expiration.",
    time: "Hier",
    read: true,
    accent: "bg-amber-100 text-amber-700",
  },
  {
    id: "n4",
    icon: AlertCircle,
    title: "Document à valider",
    description: "Votre mandat de vente est en attente de validation.",
    time: "Il y a 2 j",
    read: true,
    accent: "bg-rose-100 text-rose-700",
  },
  {
    id: "n5",
    icon: MessageSquare,
    title: "Demande de contact",
    description: "Salma I. souhaite plus d'infos sur votre Appartement à Rabat.",
    time: "Il y a 3 j",
    read: true,
    accent: "bg-secondary/10 text-secondary",
  },
];

export default function Notifications() {
  const [notifs, setNotifs] = useState<Notif[]>(initial);
  const unread = notifs.filter((n) => !n.read).length;

  const markAll = () => setNotifs((n) => n.map((x) => ({ ...x, read: true })));
  const toggle = (id: string) => setNotifs((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)));

  return (
    <main className="container max-w-3xl py-8 md:py-12">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary flex items-center gap-3">
            <Bell className="h-8 w-8 text-secondary" /> Notifications
          </h1>
          <p className="text-muted-foreground mt-2">
            {unread > 0 ? `${unread} notification${unread > 1 ? "s" : ""} non lue${unread > 1 ? "s" : ""}` : "Tout est à jour"}
          </p>
        </div>
        {unread > 0 && (
          <Button variant="outline" onClick={markAll}>
            <Check className="h-4 w-4 mr-2" /> Tout marquer comme lu
          </Button>
        )}
      </div>

      <Card className="divide-y">
        {notifs.map((n) => {
          const Icon = n.icon;
          return (
            <button
              key={n.id}
              onClick={() => toggle(n.id)}
              className={cn(
                "w-full text-left flex items-start gap-4 p-4 transition-colors hover:bg-muted",
                !n.read && "bg-secondary/5"
              )}
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", n.accent)}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="font-semibold">{n.title}</p>
                  <span className="text-xs text-muted-foreground">{n.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{n.description}</p>
              </div>
              {!n.read && <Badge className="bg-secondary text-secondary-foreground">Nouveau</Badge>}
            </button>
          );
        })}
      </Card>
    </main>
  );
}
