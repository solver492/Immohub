import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, HelpCircle, BookOpen, MessageCircle, Phone } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

const categories = [
  { icon: BookOpen, title: "Premiers pas", desc: "Créer un compte et publier votre première annonce" },
  { icon: HelpCircle, title: "Gestion des annonces", desc: "Modifier, booster ou supprimer une annonce" },
  { icon: MessageCircle, title: "Messagerie", desc: "Communiquer avec les acheteurs et locataires" },
  { icon: Phone, title: "Facturation", desc: "Abonnements, factures et moyens de paiement" },
];

const faqs = [
  {
    q: "Comment publier une annonce ?",
    a: "Cliquez sur 'Publier une annonce' en haut de page, puis remplissez les informations sur votre bien. La publication est immédiate.",
  },
  {
    q: "Combien coûte la publication ?",
    a: "La publication d'une annonce est gratuite avec la formule Starter (jusqu'à 3 annonces). Pour plus d'annonces ou des fonctionnalités premium, consultez nos formules d'abonnement.",
  },
  {
    q: "Puis-je modifier mon annonce après publication ?",
    a: "Oui, allez dans 'Gestion annonce' depuis le menu, puis cliquez sur l'icône modifier de l'annonce concernée.",
  },
  {
    q: "Comment booster ma visibilité ?",
    a: "Visitez le Dar Store pour découvrir nos produits de mise en avant : boost annonce, vedette, campagnes sociales, etc.",
  },
  {
    q: "Comment contacter un vendeur ?",
    a: "Sur la page d'une annonce, utilisez le formulaire de contact à droite. Le vendeur recevra votre message par email immédiatement.",
  },
  {
    q: "Comment changer de formule d'abonnement ?",
    a: "Allez dans 'Mon compte' > 'Mon abonnement' et choisissez la formule qui vous convient. Le changement est instantané.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Oui, toutes vos données sont chiffrées. Nous ne partageons jamais vos coordonnées sans votre accord.",
  },
];

export default function Help() {
  const [q, setQ] = useState("");
  const filtered = faqs.filter(
    (f) => f.q.toLowerCase().includes(q.toLowerCase()) || f.a.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <main>
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Comment pouvons-nous vous aider ?</h1>
          <p className="text-primary-foreground/80 mb-8">
            Trouvez des réponses à vos questions ou contactez notre équipe.
          </p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher une question..."
              className="pl-12 h-14 text-base bg-background text-foreground"
            />
          </div>
        </div>
      </section>

      <section className="container max-w-5xl py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Card key={c.title} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center mb-2">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-serif">{c.title}</CardTitle>
                  <CardDescription>{c.desc}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Questions fréquentes</CardTitle>
            <CardDescription>{filtered.length} résultats</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {filtered.map((f, i) => (
                <AccordionItem value={`item-${i}`} key={i}>
                  <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
              {filtered.length === 0 && (
                <p className="text-muted-foreground text-center py-8">Aucun résultat. <Link href="/contact" className="text-secondary underline">Contactez-nous</Link>.</p>
              )}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="mt-8 bg-secondary/5 border-secondary/20">
          <CardContent className="pt-6 text-center">
            <h3 className="font-serif text-xl font-bold mb-2">Toujours besoin d'aide ?</h3>
            <p className="text-muted-foreground mb-4">Notre équipe est disponible 7j/7.</p>
            <Link href="/contact" className="inline-block">
              <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors">
                <MessageCircle className="h-4 w-4" /> Contactez-nous
              </span>
            </Link>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
