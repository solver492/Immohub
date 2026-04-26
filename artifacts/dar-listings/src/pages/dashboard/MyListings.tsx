import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteListing, useListListings } from "@workspace/api-client-react";
import { Eye, Pencil, Trash2, Plus, Search as SearchIcon } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const formatPrice = (price: number, transaction: "sale" | "rent") =>
  `${price.toLocaleString("fr-FR")} MAD${transaction === "rent" ? "/mois" : ""}`;

export default function MyListings() {
  const { data, isLoading } = useListListings();
  const deleteListing = useDeleteListing();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [query, setQuery] = useState("");

  const items = (data?.items ?? []).filter((l) =>
    l.title.toLowerCase().includes(query.toLowerCase()) ||
    l.city.toLowerCase().includes(query.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteListing.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Annonce supprimée", description: "L'annonce a été supprimée avec succès." });
          qc.invalidateQueries();
        },
        onError: () => toast({ title: "Erreur", description: "Suppression impossible.", variant: "destructive" }),
      }
    );
  };

  return (
    <DashboardLayout
      title="Gestion annonce"
      description="Gérez toutes vos annonces immobilières."
      actions={
        <Link href="/publier">
          <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <Plus className="h-4 w-4 mr-2" /> Nouvelle annonce
          </Button>
        </Link>
      }
    >
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par titre ou ville..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-center py-12">Chargement...</p>
      ) : items.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">Aucune annonce trouvée.</p>
          <Link href="/publier">
            <Button>Créer ma première annonce</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((l) => (
            <Card key={l.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div
                  className="w-full sm:w-40 h-40 sm:h-auto bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${l.images?.[0] ?? ""})` }}
                />
                <div className="flex-1 p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant={l.transaction === "sale" ? "default" : "secondary"}>
                          {l.transaction === "sale" ? "Vente" : "Location"}
                        </Badge>
                        {l.featured && <Badge className="bg-secondary text-secondary-foreground">En vedette</Badge>}
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <h3 className="font-semibold text-lg truncate">{l.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {l.neighborhood ? `${l.neighborhood}, ` : ""}{l.city}
                      </p>
                    </div>
                    <p className="font-bold text-lg text-primary whitespace-nowrap">
                      {formatPrice(l.price, l.transaction)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{l.bedrooms} ch.</span>
                      <span>{l.bathrooms} sdb.</span>
                      <span>{l.area} m²</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link href={`/annonce/${l.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" disabled title="Bientôt">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer cette annonce ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est définitive. L'annonce "{l.title}" sera retirée du site.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(l.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
