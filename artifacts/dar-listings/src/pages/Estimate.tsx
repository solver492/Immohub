import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Banknote, TrendingUp, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";

const cityFactors: Record<string, number> = {
  Casablanca: 18000,
  Rabat: 15500,
  Marrakech: 14000,
  Tanger: 11000,
  Fes: 8500,
  Agadir: 12000,
  Autre: 9000,
};

const typeFactors: Record<string, number> = {
  apartment: 1,
  villa: 1.6,
  riad: 1.4,
  house: 1.2,
  studio: 0.85,
  land: 0.5,
};

const conditionFactor: Record<string, number> = {
  neuf: 1.15,
  recent: 1.05,
  bon: 1,
  renover: 0.8,
};

export default function Estimate() {
  const [form, setForm] = useState({
    city: "Casablanca",
    type: "apartment",
    area: "",
    bedrooms: "2",
    condition: "bon",
  });
  const [estimate, setEstimate] = useState<{ low: number; mid: number; high: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const compute = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const area = Number(form.area) || 0;
      const base = (cityFactors[form.city] ?? 9000) * area;
      const mid = Math.round(base * (typeFactors[form.type] ?? 1) * (conditionFactor[form.condition] ?? 1));
      setEstimate({ low: Math.round(mid * 0.88), mid, high: Math.round(mid * 1.12) });
      setLoading(false);
    }, 700);
  };

  return (
    <main>
      <section className="relative bg-primary text-primary-foreground py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop)",
          }}
        />
        <div className="container relative max-w-3xl text-center">
          <Banknote className="h-12 w-12 mx-auto text-secondary mb-4" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Estimer votre bien</h1>
          <p className="text-primary-foreground/80 text-lg">
            Obtenez une estimation gratuite et instantanée du prix de votre bien immobilier au Maroc.
          </p>
        </div>
      </section>

      <section className="container max-w-4xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Caractéristiques du bien</CardTitle>
              <CardDescription>Quelques infos suffisent</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={compute} className="space-y-4">
                <div className="space-y-2">
                  <Label>Ville</Label>
                  <Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(cityFactors).map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type de bien</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Appartement</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="riad">Riad</SelectItem>
                      <SelectItem value="house">Maison</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="land">Terrain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="est-area">Surface (m²)</Label>
                    <Input
                      id="est-area"
                      type="number"
                      placeholder="120"
                      value={form.area}
                      onChange={(e) => setForm({ ...form, area: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="est-bed">Chambres</Label>
                    <Input
                      id="est-bed"
                      type="number"
                      value={form.bedrooms}
                      onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>État du bien</Label>
                  <Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neuf">Neuf</SelectItem>
                      <SelectItem value="recent">Récent</SelectItem>
                      <SelectItem value="bon">Bon état</SelectItem>
                      <SelectItem value="renover">À rénover</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Calcul en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" /> Estimer mon bien
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-secondary" /> Estimation
              </CardTitle>
              <CardDescription>Fourchette de prix indicative</CardDescription>
            </CardHeader>
            <CardContent>
              {!estimate ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Banknote className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Remplissez le formulaire pour voir l'estimation.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Prix estimé</p>
                    <p className="text-4xl font-serif font-bold text-primary mt-1">
                      {estimate.mid.toLocaleString("fr-FR")} <span className="text-lg">MAD</span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bas</span>
                      <span className="font-medium">{estimate.low.toLocaleString("fr-FR")} MAD</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary/20 relative overflow-hidden">
                      <div className="absolute inset-y-0 left-1/4 right-1/4 bg-secondary rounded-full" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Médian</span>
                      <span className="font-medium">{estimate.mid.toLocaleString("fr-FR")} MAD</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Haut</span>
                      <span className="font-medium">{estimate.high.toLocaleString("fr-FR")} MAD</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Cette estimation est indicative. Pour une évaluation précise, contactez un de nos experts.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
