import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type User = { id: string; name: string; email: string; role: "Admin" | "Agent" | "Lecture seule"; status: "active" | "pending" };

const initial: User[] = [
  { id: "u1", name: "Youssef Bennani", email: "youssef@immo-hub.ma", role: "Admin", status: "active" },
  { id: "u2", name: "Salma Idrissi", email: "salma@immo-hub.ma", role: "Agent", status: "active" },
  { id: "u3", name: "Karim Tazi", email: "karim@immo-hub.ma", role: "Agent", status: "pending" },
  { id: "u4", name: "Nora El Amrani", email: "nora@immo-hub.ma", role: "Lecture seule", status: "active" },
];

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>(initial);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ name: "", email: "", role: "Agent" as User["role"] });
  const { toast } = useToast();

  const add = () => {
    if (!draft.name || !draft.email) return;
    setUsers((u) => [...u, { id: `u${Date.now()}`, ...draft, status: "pending" }]);
    setDraft({ name: "", email: "", role: "Agent" });
    setOpen(false);
    toast({ title: "Invitation envoyée", description: `${draft.email} a reçu une invitation.` });
  };

  const remove = (id: string) => {
    setUsers((u) => u.filter((x) => x.id !== id));
    toast({ title: "Utilisateur retiré" });
  };

  return (
    <DashboardLayout
      title="Gestion utilisateurs"
      description="Invitez et gérez les membres de votre équipe."
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Plus className="h-4 w-4 mr-2" /> Inviter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inviter un membre</DialogTitle>
              <DialogDescription>Il recevra un email avec un lien d'inscription.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="u-name">Nom</Label>
                <Input id="u-name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="u-email">Email</Label>
                <Input id="u-email" type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Rôle</Label>
                <Select value={draft.role} onValueChange={(v) => setDraft({ ...draft, role: v as User["role"] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Agent">Agent</SelectItem>
                    <SelectItem value="Lecture seule">Lecture seule</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button onClick={add}>Envoyer l'invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <Card className="divide-y">
        {users.map((u) => (
          <div key={u.id} className="flex items-center gap-4 p-4">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">{initials(u.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{u.name}</p>
              <p className="text-sm text-muted-foreground truncate">{u.email}</p>
            </div>
            <Badge variant="outline">{u.role}</Badge>
            <Badge variant={u.status === "active" ? "default" : "secondary"}>
              {u.status === "active" ? "Actif" : "En attente"}
            </Badge>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(u.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </Card>
    </DashboardLayout>
  );
}
