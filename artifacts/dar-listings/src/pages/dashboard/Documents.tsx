import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Upload, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type Doc = { id: string; name: string; type: string; size: string; date: string; status: "validé" | "en attente" };

const initial: Doc[] = [
  { id: "d1", name: "CIN_recto_verso.pdf", type: "Identité", size: "1.2 Mo", date: "2026-04-10", status: "validé" },
  { id: "d2", name: "Titre_propriete_villa_anfa.pdf", type: "Titre foncier", size: "2.4 Mo", date: "2026-04-08", status: "validé" },
  { id: "d3", name: "Mandat_vente_appartement.pdf", type: "Mandat", size: "856 Ko", date: "2026-04-05", status: "en attente" },
  { id: "d4", name: "Diagnostic_energetique.pdf", type: "Diagnostic", size: "1.1 Mo", date: "2026-03-28", status: "validé" },
];

export default function Documents() {
  const [docs, setDocs] = useState<Doc[]>(initial);
  const { toast } = useToast();

  const upload = () => {
    const id = `d${Date.now()}`;
    setDocs((d) => [
      { id, name: `Document_${d.length + 1}.pdf`, type: "Autre", size: "1.0 Mo", date: new Date().toISOString().slice(0, 10), status: "en attente" },
      ...d,
    ]);
    toast({ title: "Document ajouté" });
  };

  const remove = (id: string) => {
    setDocs((d) => d.filter((x) => x.id !== id));
    toast({ title: "Document supprimé" });
  };

  return (
    <DashboardLayout
      title="Mes documents"
      description="Stockez et partagez vos pièces justificatives en toute sécurité."
      actions={
        <Button onClick={upload} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          <Upload className="h-4 w-4 mr-2" /> Téléverser
        </Button>
      }
    >
      <Card className="divide-y">
        {docs.map((d) => (
          <div key={d.id} className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-md bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{d.name}</p>
              <p className="text-xs text-muted-foreground">
                {d.type} · {d.size} · Ajouté le {new Date(d.date).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <Badge variant={d.status === "validé" ? "default" : "secondary"} className="hidden sm:inline-flex">
              {d.status}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => toast({ title: "Téléchargement..." })}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(d.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </Card>
    </DashboardLayout>
  );
}
