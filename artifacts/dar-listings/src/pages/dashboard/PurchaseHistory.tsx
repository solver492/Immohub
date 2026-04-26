import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Receipt, Download } from "lucide-react";

const history = [
  { id: "INV-2026-0412", date: "2026-04-12", label: "Abonnement Pro - Avril 2026", amount: 499, status: "Payé" },
  { id: "INV-2026-0312", date: "2026-03-12", label: "Abonnement Pro - Mars 2026", amount: 499, status: "Payé" },
  { id: "INV-2026-0301", date: "2026-03-01", label: "Mise en avant - Villa Anfa", amount: 350, status: "Payé" },
  { id: "INV-2026-0212", date: "2026-02-12", label: "Abonnement Pro - Février 2026", amount: 499, status: "Payé" },
  { id: "INV-2026-0118", date: "2026-01-18", label: "Pack 5 stories", amount: 200, status: "Payé" },
];

export default function PurchaseHistory() {
  const total = history.reduce((s, h) => s + h.amount, 0);

  return (
    <DashboardLayout title="Historique d'achat" description="Toutes vos transactions et factures.">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total dépensé</p>
            <p className="text-3xl font-serif font-bold text-primary">{total.toLocaleString("fr-FR")} MAD</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Transactions</p>
            <p className="text-3xl font-serif font-bold text-primary">{history.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Dernière transaction</p>
            <p className="text-lg font-semibold text-primary mt-1">
              {new Date(history[0].date).toLocaleDateString("fr-FR")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="divide-y">
        {history.map((h) => (
          <div key={h.id} className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Receipt className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{h.label}</p>
              <p className="text-xs text-muted-foreground">
                {h.id} · {new Date(h.date).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <p className="font-semibold whitespace-nowrap">{h.amount.toLocaleString("fr-FR")} MAD</p>
            <Badge>{h.status}</Badge>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </Card>
    </DashboardLayout>
  );
}
