import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const projects = [
  {
    id: "p1",
    name: "Anfa Crystal Towers",
    developer: "Atlas Développement",
    city: "Casablanca",
    neighborhood: "Anfa Supérieur",
    delivery: "T2 2027",
    priceFrom: 1850000,
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop",
    units: 124,
    badge: "En avant-première",
  },
  {
    id: "p2",
    name: "Marina Bay Residences",
    developer: "Bouygues Immobilier",
    city: "Rabat",
    neighborhood: "L'Océan",
    delivery: "T4 2026",
    priceFrom: 1450000,
    image:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1200&auto=format&fit=crop",
    units: 86,
    badge: "Bientôt livré",
  },
  {
    id: "p3",
    name: "Palm Garden Marrakech",
    developer: "Addoha",
    city: "Marrakech",
    neighborhood: "Route de l'Ourika",
    delivery: "T1 2027",
    priceFrom: 980000,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
    units: 210,
    badge: "Nouveau",
  },
  {
    id: "p4",
    name: "Tanger Med View",
    developer: "Alliances",
    city: "Tanger",
    neighborhood: "Malabata",
    delivery: "T3 2027",
    priceFrom: 720000,
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop",
    units: 156,
  },
  {
    id: "p5",
    name: "Agadir Beach Apartments",
    developer: "Chaabi Lil Iskane",
    city: "Agadir",
    neighborhood: "Founty",
    delivery: "T2 2026",
    priceFrom: 850000,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
    units: 98,
  },
  {
    id: "p6",
    name: "Fes Riad Modern",
    developer: "Palmeraie Développement",
    city: "Fès",
    neighborhood: "Saiss",
    delivery: "T4 2027",
    priceFrom: 620000,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    units: 72,
  },
];

export default function NewProperties() {
  return (
    <main>
      <section className="relative bg-primary text-primary-foreground py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop)",
          }}
        />
        <div className="container relative max-w-3xl">
          <Badge className="bg-secondary text-secondary-foreground mb-4">
            <Sparkles className="h-3 w-3 mr-1" /> Programmes neufs
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Immobilier neuf au Maroc</h1>
          <p className="text-primary-foreground/80 text-lg">
            Découvrez les nouveaux programmes immobiliers des plus grands promoteurs marocains.
            Achetez sur plan et bénéficiez de prix préférentiels.
          </p>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <Card key={p.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div
                className="aspect-[4/3] bg-cover bg-center relative"
                style={{ backgroundImage: `url(${p.image})` }}
              >
                {p.badge && (
                  <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
                    {p.badge}
                  </Badge>
                )}
                <div className="absolute bottom-3 right-3 bg-background/95 text-foreground rounded-md px-3 py-1 text-sm font-semibold">
                  À partir de {p.priceFrom.toLocaleString("fr-FR")} MAD
                </div>
              </div>
              <CardContent className="pt-4 space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-lg">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">par {p.developer}</p>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-secondary shrink-0" />
                    {p.neighborhood}, {p.city}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 text-secondary shrink-0" />
                    Livraison {p.delivery}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5 text-secondary shrink-0" />
                    {p.units} unités
                  </div>
                </div>
                <Link href="/contact">
                  <Button variant="outline" className="w-full group-hover:border-secondary group-hover:text-secondary">
                    Demander la brochure <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
