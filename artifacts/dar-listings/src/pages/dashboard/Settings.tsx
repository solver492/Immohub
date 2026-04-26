import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "Youssef Bennani",
    email: "youssef@dar-listings.ma",
    phone: "+212 6 12 34 56 78",
    agency: "Bennani Immobilier",
    bio: "Agent immobilier à Casablanca depuis 12 ans.",
  });
  const [prefs, setPrefs] = useState({
    emailNotif: true,
    smsNotif: false,
    weeklyReport: true,
    publicProfile: true,
  });

  return (
    <DashboardLayout title="Paramètres" description="Gérez votre profil et vos préférences.">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Profil</CardTitle>
            <CardDescription>Vos informations publiques</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="set-name">Nom complet</Label>
                <Input id="set-name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="set-email">Email</Label>
                <Input id="set-email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="set-phone">Téléphone</Label>
                <Input id="set-phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="set-agency">Agence</Label>
                <Input id="set-agency" value={profile.agency} onChange={(e) => setProfile({ ...profile, agency: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="set-bio">Biographie</Label>
              <Textarea id="set-bio" rows={3} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => toast({ title: "Profil mis à jour" })}>Enregistrer</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Préférences</CardTitle>
            <CardDescription>Notifications et confidentialité</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "emailNotif", label: "Notifications par email", desc: "Recevoir les nouveaux messages par email" },
              { key: "smsNotif", label: "Notifications SMS", desc: "Recevoir les alertes urgentes par SMS" },
              { key: "weeklyReport", label: "Rapport hebdomadaire", desc: "Recevoir un résumé chaque lundi" },
              { key: "publicProfile", label: "Profil public", desc: "Permettre aux visiteurs de voir votre profil" },
            ].map((p) => (
              <div key={p.key} className="flex items-center justify-between p-3 rounded-md hover:bg-muted">
                <div>
                  <p className="font-medium">{p.label}</p>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </div>
                <Switch
                  checked={prefs[p.key as keyof typeof prefs]}
                  onCheckedChange={(v) => setPrefs({ ...prefs, [p.key]: v })}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Sécurité</CardTitle>
            <CardDescription>Mot de passe et authentification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="set-pwd1">Nouveau mot de passe</Label>
                <Input id="set-pwd1" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="set-pwd2">Confirmer</Label>
                <Input id="set-pwd2" type="password" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => toast({ title: "Mot de passe mis à jour" })}>
                Changer le mot de passe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
