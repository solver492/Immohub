import aboutHero from "@/assets/about-hero.png";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <main className="flex-1 bg-background">
      {/* Hero */}
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img src={aboutHero} alt="Architecture marocaine" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/60" />
        </div>
        <div className="container relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-lg">
            Notre Mission
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-md">
            Redéfinir la recherche immobilière au Maroc avec transparence, confiance et élégance.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 container max-w-4xl">
        <div className="prose prose-lg prose-slate max-w-none text-foreground/80">
          <h2 className="text-3xl font-serif font-bold text-primary mb-6">L'histoire de Dar Listings</h2>
          <p className="mb-6">
            L'immobilier au Maroc mérite mieux qu'une simple plateforme de petites annonces. Chez Dar Listings, nous croyons que la recherche d'un foyer ou d'un investissement est une étape cruciale qui requiert une expérience fluide, esthétique et rassurante.
          </p>
          <p className="mb-10">
            Née de la volonté de moderniser le marché, notre plateforme rassemble particuliers exigeants et professionnels de confiance autour d'une interface pensée pour mettre en valeur chaque bien immobilier. Des riads historiques de la médina aux appartements contemporains de la corniche, nous offrons une vitrine exceptionnelle à la richesse du parc immobilier marocain.
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-16">
            <div className="bg-muted/50 p-8 rounded-2xl border border-border">
              <h3 className="text-xl font-bold text-secondary mb-3">Transparence totale</h3>
              <p className="text-sm leading-relaxed">
                Fini les annonces doublons et les descriptions vagues. Nous mettons un point d'honneur à la qualité de l'information pour vous faire gagner du temps.
              </p>
            </div>
            <div className="bg-muted/50 p-8 rounded-2xl border border-border">
              <h3 className="text-xl font-bold text-secondary mb-3">Esthétisme</h3>
              <p className="text-sm leading-relaxed">
                Parce qu'un bien se choisit d'abord avec les yeux, notre interface s'efface pour laisser place à la photographie et aux volumes.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16 pt-16 border-t border-border">
          <h2 className="text-2xl font-serif font-bold text-primary mb-6">Prêt à commencer ?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/recherche">
              <Button size="lg" className="w-full sm:w-auto font-bold px-8">Chercher un bien</Button>
            </Link>
            <Link href="/publier">
              <Button size="lg" variant="outline" className="w-full sm:w-auto font-bold px-8 border-primary text-primary">Publier une annonce</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
