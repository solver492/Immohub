import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ImageIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type Story = { id: string; title: string; cover: string; views: number; createdAt: string };

const initialStories: Story[] = [
  {
    id: "s1",
    title: "Villa de luxe à Anfa",
    cover:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=600&auto=format&fit=crop",
    views: 1240,
    createdAt: "2026-04-12",
  },
  {
    id: "s2",
    title: "Riad authentique - Médina",
    cover:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600&auto=format&fit=crop",
    views: 873,
    createdAt: "2026-04-08",
  },
  {
    id: "s3",
    title: "Appartement vue océan - Rabat",
    cover:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600&auto=format&fit=crop",
    views: 542,
    createdAt: "2026-04-02",
  },
];

export default function Stories() {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const { toast } = useToast();

  const addStory = () => {
    const id = `s${Date.now()}`;
    setStories((s) => [
      {
        id,
        title: "Nouvelle story",
        cover:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
        views: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...s,
    ]);
    toast({ title: "Story créée", description: "Votre nouvelle story a été ajoutée." });
  };

  const remove = (id: string) => {
    setStories((s) => s.filter((x) => x.id !== id));
    toast({ title: "Story supprimée" });
  };

  return (
    <DashboardLayout
      title="Gestion des Stories"
      description="Mettez vos annonces en avant avec des stories visuelles."
      actions={
        <Button onClick={addStory} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          <Plus className="h-4 w-4 mr-2" /> Créer une story
        </Button>
      }
    >
      {stories.length === 0 ? (
        <Card className="p-12 text-center">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucune story pour le moment.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stories.map((s) => (
            <Card key={s.id} className="overflow-hidden group relative">
              <div
                className="aspect-[3/4] bg-cover bg-center"
                style={{ backgroundImage: `url(${s.cover})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                <p className="font-semibold text-sm line-clamp-2">{s.title}</p>
                <p className="text-xs text-white/80">{s.views} vues</p>
              </div>
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                onClick={() => remove(s.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
