import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Star,
  Sparkles,
  Image as ImageIcon,
  Megaphone,
  Zap,
  Tablet,
  Wifi,
  Cloud,
  Camera,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const products = [
  {
    id: "boost",
    icon: Zap,
    name: "Boost annonce",
    description: "Mettez votre annonce en haut des résultats pendant 7 jours.",
    price: 150,
    badge: "Populaire",
  },
  {
    id: "featured",
    icon: Star,
    name: "Annonce en vedette",
    description: "Apparaissez sur la page d'accueil pendant 30 jours.",
    price: 350,
    badge: "Best-seller",
  },
  {
    id: "stories-pack",
    icon: ImageIcon,
    name: "Pack 5 Stories",
    description: "Créez des stories visuelles attrayantes pour vos biens.",
    price: 200,
  },
  {
    id: "pro-photos",
    icon: Sparkles,
    name: "Shooting photo Pro",
    description: "Photographe professionnel à domicile, jusqu'à 25 photos HD.",
    price: 1200,
  },
  {
    id: "social-ads",
    icon: Megaphone,
    name: "Campagne sociale",
    description: "Promotion ciblée sur Facebook & Instagram pendant 14 jours.",
    price: 800,
  },
  {
    id: "premium-badge",
    icon: ShoppingBag,
    name: "Badge Vendeur Premium",
    description: "Affichez votre statut de vendeur de confiance pendant 1 an.",
    price: 2500,
  },
];

const tabletFeatures = [
  { icon: Wifi, text: "Mode hors-ligne complet : saisissez vos biens même sans connexion." },
  { icon: Cloud, text: "Synchronisation automatique dès la connexion retrouvée." },
  { icon: Camera, text: "Appareil photo intégré : jusqu'à 30 photos HD par bien." },
  { icon: CheckCircle2, text: "Publication directe vers Immo-hub en un clic (vente ou location)." },
  { icon: Megaphone, text: "Sponsorisation des annonces depuis l'app, en quelques secondes." },
];

export default function Store() {
  const { toast } = useToast();
  const [cart, setCart] = useState<string[]>([]);

  const buy = (id: string, name: string) => {
    setCart((c) => [...c, id]);
    toast({ title: "Ajouté au panier", description: name });
  };

  return (
    <main className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary">Immo-hub Store</h1>
          <p className="text-muted-foreground mt-2">
            Boostez la visibilité de vos annonces et équipez votre agence avec nos solutions dédiées.
          </p>
        </div>
        <Badge variant="outline" className="text-base py-2 px-4 gap-2">
          <ShoppingBag className="h-4 w-4" /> {cart.length} article{cart.length > 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Tablette Pro Agence — Hero card */}
      <Card className="mb-12 overflow-hidden border-secondary/40 shadow-xl">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="bg-gradient-to-br from-primary to-primary/85 text-primary-foreground p-8 md:p-10 flex flex-col justify-between min-h-[420px]">
            <div>
              <Badge className="bg-secondary text-secondary-foreground mb-4 text-sm px-3 py-1">
                Nouveau · Pro Agence
              </Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Tablette Pro Immo-hub
              </h2>
              <p className="text-primary-foreground/80 mb-6 leading-relaxed">
                L'outil tout-en-un pensé pour les agences immobilières marocaines. Stockez,
                gérez et publiez votre portefeuille de biens — en visite, sur le terrain, ou
                même hors ligne — puis publiez directement sur Immo-hub.
              </p>
              <ul className="space-y-3 mb-6">
                {tabletFeatures.map((f) => {
                  const Icon = f.icon;
                  return (
                    <li key={f.text} className="flex items-start gap-3 text-sm">
                      <Icon className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-primary-foreground/90">{f.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-4 pt-4 border-t border-primary-foreground/15">
              <div>
                <p className="text-xs uppercase tracking-wider text-primary-foreground/60 mb-1">
                  À partir de
                </p>
                <p className="text-3xl font-bold">
                  4 990 <span className="text-base font-normal text-primary-foreground/60">MAD</span>
                </p>
                <p className="text-xs text-primary-foreground/60 mt-1">ou 415 MAD/mois sur 12 mois</p>
              </div>
              <Button
                size="lg"
                variant="secondary"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold"
                onClick={() => buy("tablet-pro", "Tablette Pro Immo-hub")}
              >
                Commander la tablette
              </Button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-secondary/15 to-muted p-8 md:p-10 flex flex-col items-center justify-center text-center">
            <div className="w-44 h-60 md:w-52 md:h-72 rounded-2xl bg-foreground/85 shadow-2xl relative flex items-center justify-center mb-6 rotate-3">
              <div className="absolute inset-3 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                <div className="text-center px-4">
                  <Tablet className="h-10 w-10 text-white mb-2 mx-auto" />
                  <p className="text-white font-serif text-xl font-bold">Immo-hub</p>
                  <p className="text-white/80 text-xs mt-1">Pro Agence</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 max-w-xs">
              <h3 className="font-serif text-xl font-bold text-primary">
                Centralisez votre portefeuille
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vente et location en un seul endroit. Visualisez les statistiques, gérez vos
                équipes, et sponsorisez les annonces que vous voulez mettre en avant — depuis
                la tablette ou le tableau de bord web.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-primary">Boostez vos annonces</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Produits à l'unité pour mettre en avant vos biens.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => {
          const Icon = p.icon;
          return (
            <Card key={p.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center mb-2">
                    <Icon className="h-6 w-6" />
                  </div>
                  {p.badge && <Badge className="bg-secondary text-secondary-foreground">{p.badge}</Badge>}
                </div>
                <CardTitle className="font-serif">{p.name}</CardTitle>
                <CardDescription>{p.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-3xl font-bold text-primary">
                  {p.price.toLocaleString("fr-FR")} <span className="text-base font-normal text-muted-foreground">MAD</span>
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => buy(p.id, p.name)}>
                  Ajouter au panier
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
