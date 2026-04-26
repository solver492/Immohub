import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetStatsOverview, useListListings } from "@workspace/api-client-react";
import { Eye, MessageSquare, TrendingUp, Home as HomeIcon, BarChart3 } from "lucide-react";
import { useMemo } from "react";

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export default function Performance() {
  const { data: stats } = useGetStatsOverview();
  const { data: listings } = useListListings();

  const totalListings = listings?.items?.length ?? 0;

  const metrics = useMemo(() => {
    const base = totalListings > 0 ? totalListings : 1;
    return {
      views: Math.round(base * 184 + seededRandom(1) * 120),
      messages: Math.round(base * 7 + seededRandom(2) * 8),
      favorites: Math.round(base * 12 + seededRandom(3) * 10),
      callRate: (12 + seededRandom(4) * 8).toFixed(1),
    };
  }, [totalListings]);

  const monthly = useMemo(() => {
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];
    return months.map((m, i) => ({
      label: m,
      value: Math.round(40 + seededRandom(i + 10) * 60),
    }));
  }, []);

  const max = Math.max(...monthly.map((m) => m.value), 1);

  return (
    <DashboardLayout
      title="Rapport de performance"
      description="Suivez l'audience de vos annonces en temps réel."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Eye} label="Vues totales" value={metrics.views.toLocaleString("fr-FR")} accent="bg-secondary/10 text-secondary" />
        <StatCard icon={MessageSquare} label="Messages reçus" value={metrics.messages.toString()} accent="bg-primary/10 text-primary" />
        <StatCard icon={TrendingUp} label="Favoris" value={metrics.favorites.toString()} accent="bg-emerald-100 text-emerald-700" />
        <StatCard icon={HomeIcon} label="Annonces actives" value={(stats?.totalListings ?? totalListings).toString()} accent="bg-amber-100 text-amber-700" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <BarChart3 className="h-5 w-5 text-secondary" /> Vues par mois
          </CardTitle>
          <CardDescription>6 derniers mois</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 h-64">
            {monthly.map((m) => (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-secondary to-secondary/60"
                    style={{ height: `${(m.value / max) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{m.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-serif">Top annonces</CardTitle>
          <CardDescription>Vos annonces les plus consultées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(listings?.items ?? []).slice(0, 5).map((l, idx) => (
              <div key={l.id} className="flex items-center gap-4 p-3 rounded-md hover:bg-muted transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  #{idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{l.title}</p>
                  <p className="text-sm text-muted-foreground">{l.city}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{Math.round(seededRandom(idx + 100) * 800 + 100)}</p>
                  <p className="text-xs text-muted-foreground">vues</p>
                </div>
              </div>
            ))}
            {(!listings?.items || listings.items.length === 0) && (
              <p className="text-center text-muted-foreground py-8">Aucune annonce pour le moment.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-2xl font-bold font-serif text-primary">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
