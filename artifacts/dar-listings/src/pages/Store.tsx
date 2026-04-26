import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star, Sparkles, Image as ImageIcon, Megaphone, Zap } from "lucide-react";
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
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary">Dar Store</h1>
          <p className="text-muted-foreground mt-2">
            Boostez la visibilité de vos annonces avec nos produits dédiés.
          </p>
        </div>
        <Badge variant="outline" className="text-base py-2 px-4 gap-2">
          <ShoppingBag className="h-4 w-4" /> {cart.length} article{cart.length > 1 ? "s" : ""}
        </Badge>
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
