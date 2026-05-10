import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { TrendingUp, Shield, Globe, Percent, ArrowRight, CheckCircle } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] } }),
};
const reveal = { initial: "hidden", whileInView: "show" as const, viewport: { once: true, amount: 0.2 } };

const STATS = [
  { value: "6–8%", label: "Rendement locatif annuel moyen" },
  { value: "+4.2%", label: "Valorisation immobilière / an" },
  { value: "15 ans", label: "Exonération fiscale résidents étrangers" },
  { value: "120+", label: "Nationalités investissant au Maroc" },
];

const REASONS = [
  {
    icon: TrendingUp,
    title: "Marché en forte croissance",
    desc: "L'immobilier marocain enregistre une croissance constante portée par l'urbanisation, le tourisme et les investissements étrangers.",
  },
  {
    icon: Shield,
    title: "Cadre juridique sécurisé",
    desc: "Le Maroc offre un environnement légal transparent pour les investisseurs étrangers avec des droits de propriété pleinement garantis.",
  },
  {
    icon: Globe,
    title: "Position géostratégique",
    desc: "Carrefour entre l'Europe, l'Afrique et le monde arabe, le Maroc attire des flux d'investissements croissants.",
  },
  {
    icon: Percent,
    title: "Fiscalité avantageuse",
    desc: "Exonérations fiscales sur les revenus locatifs, conventions de non double imposition avec plus de 50 pays.",
  },
];

const STEPS = [
  "Définissez votre budget et vos objectifs (rendement, plus-value, résidence)",
  "Choisissez la ville et le type de bien adapté à votre profil",
  "Consultez notre équipe pour une analyse personnalisée du marché",
  "Visitez les biens sélectionnés avec notre accompagnement expert",
  "Finalisez l'acquisition avec notre réseau de notaires partenaires",
];

export default function InvestissementPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[var(--page-bg)] transition-colors duration-300">
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=85"
          alt="Investissement immobilier"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="relative z-10 lux-container px-6 pb-14">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <p className="overline-label text-white/70 mb-3">Guide de l'investisseur</p>
            <h1 className="serif-display text-white text-5xl md:text-6xl">Investir au Maroc</h1>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[var(--ink-text)] text-white">
        <div className="lux-container px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {STATS.map((s, i) => (
              <motion.div key={i} {...reveal} variants={fadeUp} custom={i} className="py-10 px-6 text-center">
                <p className="font-serif text-3xl md:text-4xl font-medium mb-2">{s.value}</p>
                <p className="text-[0.68rem] tracking-[0.1em] uppercase text-white/50">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why invest */}
      <section className="lux-section">
        <div className="lux-container px-6">
          <motion.div {...reveal} variants={fadeUp} className="mb-14">
            <span className="rule" />
            <p className="overline-label mb-3">Pourquoi choisir le Maroc</p>
            <h2 className="serif-display text-4xl md:text-5xl">Un marché de premier choix</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {REASONS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={i} {...reveal} variants={fadeUp} custom={i} className="flex gap-5">
                <div className="flex-shrink-0 w-10 h-10 border border-[var(--divider)] flex items-center justify-center mt-1">
                  <Icon size={18} className="text-[var(--gold)]" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-[var(--ink-text)] mb-2">{title}</h3>
                  <p className="text-[var(--muted-text)] text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="lux-section bg-[var(--alt-bg)]">
        <div className="lux-container px-6">
          <motion.div {...reveal} variants={fadeUp} className="mb-14">
            <span className="rule" />
            <p className="overline-label mb-3">Notre accompagnement</p>
            <h2 className="serif-display text-4xl md:text-5xl">5 étapes vers votre investissement</h2>
          </motion.div>
          <div className="space-y-6 max-w-2xl">
            {STEPS.map((step, i) => (
              <motion.div key={i} {...reveal} variants={fadeUp} custom={i} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 border border-[var(--gold)] flex items-center justify-center">
                  <span className="font-serif text-sm text-[var(--gold)]">{i + 1}</span>
                </div>
                <p className="text-[var(--ink-text)] text-sm leading-relaxed pt-1">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lux-section">
        <div className="lux-container px-6 text-center">
          <motion.div {...reveal} variants={fadeUp} className="max-w-xl mx-auto">
            <span className="rule mx-auto" />
            <h2 className="serif-display text-4xl mb-6">Prêt à investir ?</h2>
            <p className="text-[var(--muted-text)] mb-10 leading-relaxed">
              Consultez notre catalogue de biens sélectionnés pour leur potentiel d'investissement.
            </p>
            <button onClick={() => setLocation("/biens?transaction=vente")} className="btn-fill">
              Voir les biens à vendre <ArrowRight size={14} />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
