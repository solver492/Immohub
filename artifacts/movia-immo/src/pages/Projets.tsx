import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { MapPin, Calendar, ArrowRight, Building2 } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] } }),
};
const reveal = { initial: "hidden", whileInView: "show" as const, viewport: { once: true, amount: 0.15 } };

const PROJECTS = [
  {
    id: "p1",
    nom: "Résidence Marina Bay",
    ville: "Tanger",
    type: "Résidentiel Premium",
    livraison: "T4 2025",
    prix_depuis: "2.8M MAD",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    desc: "Ensemble résidentiel de standing avec vue mer, piscine et services hôteliers.",
    statut: "En commercialisation",
  },
  {
    id: "p2",
    nom: "Les Villas de l'Atlas",
    ville: "Marrakech",
    type: "Villas de luxe",
    livraison: "T2 2026",
    prix_depuis: "7.5M MAD",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    desc: "Domaine privé de 24 villas avec jardins paysagers, piscines privées et vue Atlas.",
    statut: "Pré-vente",
  },
  {
    id: "p3",
    nom: "Anfa Business Center",
    ville: "Casablanca",
    type: "Bureaux & Commerce",
    livraison: "T1 2026",
    prix_depuis: "1.2M MAD",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    desc: "Tour de bureaux certifiée LEED au cœur du nouveau centre d'affaires d'Anfa.",
    statut: "En commercialisation",
  },
  {
    id: "p4",
    nom: "Riad Collection Médina",
    ville: "Fès",
    type: "Riads rénovés",
    livraison: "Livré",
    prix_depuis: "2.1M MAD",
    img: "https://images.unsplash.com/photo-1572803787f25-0b4e4d4d7143?w=800&q=80",
    desc: "Collection de riads d'exception entièrement rénovés dans la médina classée UNESCO.",
    statut: "Disponible",
  },
  {
    id: "p5",
    nom: "Ocean Résidence Agadir",
    ville: "Agadir",
    type: "Résidentiel balnéaire",
    livraison: "T3 2025",
    prix_depuis: "1.8M MAD",
    img: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=800&q=80",
    desc: "Résidence en bord de mer avec accès direct plage, spa et club nautique.",
    statut: "Dernières unités",
  },
  {
    id: "p6",
    nom: "Hay Riad Premium",
    ville: "Rabat",
    type: "Appartements standing",
    livraison: "T4 2026",
    prix_depuis: "3.2M MAD",
    img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    desc: "Programme résidentiel haut de gamme dans le quartier diplomatique de Rabat.",
    statut: "Lancement imminent",
  },
];

const STATUT_COLORS: Record<string, string> = {
  "En commercialisation": "border-emerald-600 text-emerald-700",
  "Pré-vente": "border-amber-500 text-amber-600",
  "Disponible": "border-blue-500 text-blue-600",
  "Dernières unités": "border-red-500 text-red-600",
  "Lancement imminent": "border-purple-500 text-purple-600",
};

export default function ProjetsPage() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState("Tous");
  const villes = ["Tous", ...Array.from(new Set(PROJECTS.map((p) => p.ville)))];
  const filtered = filter === "Tous" ? PROJECTS : PROJECTS.filter((p) => p.ville === filter);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] pt-24 pb-20 transition-colors duration-300">
      <div className="lux-container px-6">
        {/* Header */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-12">
          <span className="rule" />
          <p className="overline-label mb-3">Immobilier neuf</p>
          <h1 className="serif-display text-5xl md:text-6xl mb-4">Projets & Programmes</h1>
          <p className="text-[var(--muted-text)] max-w-xl leading-relaxed">
            Découvrez les programmes immobiliers neufs sélectionnés par Movia Immo — résidences, villas et espaces de bureau.
          </p>
        </motion.div>

        {/* City filter */}
        <div className="flex items-center gap-3 flex-wrap mb-10 border-b border-[var(--divider)] pb-6">
          {villes.map((v) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`text-[0.68rem] font-medium tracking-[0.12em] uppercase px-4 py-2 border transition-all cursor-pointer ${
                filter === v
                  ? "bg-[var(--ink-text)] text-[var(--page-bg)] border-[var(--ink-text)]"
                  : "border-[var(--divider)] text-[var(--muted-text)] hover:border-[var(--ink-text)] hover:text-[var(--ink-text)]"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj, i) => (
            <motion.div
              key={proj.id}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={i % 3}
              className="glass-page-card group cursor-pointer"
              data-testid={`projet-card-${proj.id}`}
            >
              {/* Image */}
              <div className="h-52 overflow-hidden relative">
                <img
                  src={proj.img}
                  alt={proj.nom}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className={`text-[0.62rem] font-medium tracking-[0.1em] uppercase px-2 py-1 bg-white/90 border ${STATUT_COLORS[proj.statut] || "border-gray-400 text-gray-600"}`}>
                    {proj.statut}
                  </span>
                </div>
              </div>
              {/* Body */}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[0.65rem] tracking-[0.1em] uppercase text-[var(--muted-text)] flex items-center gap-1">
                    <Building2 size={10} /> {proj.type}
                  </span>
                  <span className="w-px h-3 bg-[var(--divider)]" />
                  <span className="text-[0.65rem] tracking-[0.1em] uppercase text-[var(--muted-text)] flex items-center gap-1">
                    <MapPin size={10} /> {proj.ville}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-medium text-[var(--ink-text)] mb-2">{proj.nom}</h3>
                <p className="text-[var(--muted-text)] text-sm leading-relaxed mb-4">{proj.desc}</p>
                <div className="w-full h-px bg-[var(--divider)] mb-4" />
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[0.62rem] tracking-[0.1em] uppercase text-[var(--muted-text)] mb-0.5">À partir de</p>
                    <p className="font-serif text-lg font-medium text-[var(--ink-text)]">{proj.prix_depuis}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[0.62rem] tracking-[0.1em] uppercase text-[var(--muted-text)] mb-0.5 flex items-center gap-1 justify-end">
                      <Calendar size={10} /> Livraison
                    </p>
                    <p className="text-sm font-medium text-[var(--ink-text)]">{proj.livraison}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
