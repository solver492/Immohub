import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast({
        title: "Message envoyé",
        description: "Notre équipe vous répondra sous 24 heures.",
      });
      setForm({ name: "", email: "", phone: "", subject: "general", message: "" });
      setSubmitting(false);
    }, 600);
  };

  return (
    <main>
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Contactez-nous</h1>
          <p className="text-primary-foreground/80 text-lg">
            Une question ? Un projet immobilier ? Notre équipe est là pour vous accompagner.
          </p>
        </div>
      </section>

      <section className="container max-w-6xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            {[
              { icon: Mail, label: "Email", value: "contact@dar-listings.ma" },
              { icon: Phone, label: "Téléphone", value: "+212 5 22 00 00 00" },
              { icon: MapPin, label: "Adresse", value: "12 rue Tahar Sebti, 20000 Casablanca" },
              { icon: Clock, label: "Horaires", value: "Lun - Ven : 9h - 18h" },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <Card key={c.label}>
                  <CardContent className="pt-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{c.label}</p>
                      <p className="font-semibold">{c.value}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-serif">Envoyez-nous un message</CardTitle>
              <CardDescription>Nous vous répondons sous 24 heures.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ct-name">Nom complet</Label>
                    <Input
                      id="ct-name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ct-email">Email</Label>
                    <Input
                      id="ct-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ct-phone">Téléphone</Label>
                    <Input
                      id="ct-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sujet</Label>
                    <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Question générale</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="support">Support technique</SelectItem>
                        <SelectItem value="partenariat">Partenariat</SelectItem>
                        <SelectItem value="presse">Presse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ct-msg">Message</Label>
                  <Textarea
                    id="ct-msg"
                    rows={6}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full md:w-auto" disabled={submitting}>
                  <Send className="h-4 w-4 mr-2" />
                  {submitting ? "Envoi..." : "Envoyer le message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
