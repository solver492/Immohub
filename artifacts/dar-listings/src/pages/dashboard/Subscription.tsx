import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, Building2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "starter",
    name: "Starter",
    icon: Sparkles,
    price: 0,
    description: "Pour les particuliers qui débutent",
    features: ["3 annonces actives", "Statistiques basiques", "Support par email"],
  },
  {
    id: "pro",
    name: "Pro",
    icon: Crown,
    price: 499,
    description: "Pour les agents indépendants",
    features: ["50 annonces actives", "Annonces en vedette", "Stories illimitées", "Support prioritaire"],
    recommended: true,
  },
  {
    id: "agence",
    name: "Agence",
    icon: Building2,
    price: 1499,
    description: "Pour les agences immobilières",
    features: ["Annonces illimitées", "5 utilisateurs", "Rapport avancé", "Account manager dédié"],
  },
];

export default function Subscription() {
  const [current, setCurrent] = useState("pro");
  const { toast } = useToast();

  return (
    <DashboardLayout title="Mon abonnement" description="Choisissez la formule qui vous convient.">
      <Card className="mb-8 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
        <CardContent className="pt-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm uppercase tracking-wider opacity-80">Formule actuelle</p>
            <p className="text-3xl font-serif font-bold">Pro</p>
            <p className="text-sm opacity-80 mt-1">Renouvellement automatique le 15 mai 2026</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">499 MAD</p>
            <p className="text-sm opacity-80">par mois</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => {
          const Icon = p.icon;
          const isCurrent = p.id === current;
          return (
            <Card
              key={p.id}
              className={cn(
                "relative",
                p.recommended && "border-secondary border-2",
                isCurrent && "ring-2 ring-primary"
              )}
            >
              {p.recommended && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground">
                  Recommandé
                </Badge>
              )}
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center mb-2">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="font-serif text-2xl">{p.name}</CardTitle>
                <CardDescription>{p.description}</CardDescription>
                <div className="pt-2">
                  <span className="text-4xl font-bold text-primary">{p.price}</span>
                  <span className="text-muted-foreground"> MAD/mois</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  disabled={isCurrent}
                  variant={p.recommended ? "default" : "outline"}
                  onClick={() => {
                    setCurrent(p.id);
                    toast({ title: "Formule modifiée", description: `Vous êtes désormais sur la formule ${p.name}.` });
                  }}
                >
                  {isCurrent ? "Formule actuelle" : "Choisir"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
