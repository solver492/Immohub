import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Home } from "lucide-react";
import { MOROCCAN_CITIES } from "@/lib/types";
import { countBiensByVille } from "@/lib/supabase";

const CITY_DATA: Record<string, { img: string; desc: string; highlight: string }> = {
  Casablanca: {
    img: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800&q=80",
    desc: "Capitale économique du Maroc, Casablanca offre un marché immobilier dynamique avec de fortes opportunités d'investissement.",
    highlight: "Métropole d'affaires",
  },
  Marrakech: {
    img: "https://images.unsplash.com/photo-1539020140153-e479b8bcd9cc?w=800&q=80",
    desc: "La Ville Rouge séduit investisseurs et résidents grâce à son art de vivre unique, ses riads et ses villas de prestige.",
    highlight: "Luxe & Tourisme",
  },
  Tanger: {
    img: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&q=80",
    desc: "Porte de l'Afrique sur l'Europe, Tanger connaît un essor économique sans précédent avec le port Tanger Med.",
    highlight: "Croissance rapide",
  },
  Rabat: {
    img: "https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?w=800&q=80",
    desc: "Capitale administrative et ville patrimoniale UNESCO, Rabat allie prestige institutionnel et qualité de vie.",
    highlight: "Capitale & Prestige",
  },
  Agadir: {
    img: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=800&q=80",
    desc: "Station balnéaire prisée avec un marché locatif saisonnier fort et de nombreux complexes résidentiels modernes.",
    highlight: "Balnéaire & Loisirs",
  },
  Fès: {
    img: "https://images.unsplash.com/photo-1572803787f25-0b4e4d4d7143?w=800&q=80",
    desc: "Première ville impériale, Fès fascine par sa médina millénaire classée UNESCO et ses riads authentiques.",
    highlight: "Patrimoine & Culture",
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] } }),
};

export default function VillesPage() {
  const [, setLocation] = useLocation();
  const [counts, setCounts] = useState<Record<string, { total: number; vente: number; location: number }>>({});

  useEffect(() => {
    countBiensByVille().then((data) => {
      if (Object.keys(data).length > 0) setCounts(data);
      else setCounts({
        Casablanca: { total: 124, vente: 75, location: 49 },
        Marrakech: { total: 67, vente: 40, location: 27 },
        Tanger: { total: 48, vente: 30, location: 18 },
        Rabat: { total: 86, vente: 52, location: 34 },
        Agadir: { total: 32, vente: 18, location: 14 },
        Fès: { total: 29, vente: 17, location: 12 },
      });
    });
  }, []);

  const cities = Object.keys(MOROCCAN_CITIES);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[var(--page-bg)] transition-colors duration-300">
      <div className="lux-container px-6">
        {/* Header */}
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-16">
          <span className="rule" />
          <p className="overline-label mb-3">Explorer le Maroc</p>
          <h1 className="serif-display text-5xl md:text-6xl mb-4">Nos Villes</h1>
          <p className="text-[var(--muted-text)] max-w-xl leading-relaxed">
            Découvrez le marché immobilier de chaque ville marocaine — de la métropole à la cité impériale.
          </p>
        </motion.div>

        {/* City grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, i) => {
            const data = CITY_DATA[city];
            const count = counts[city];
            if (!data) return null;
            return (
              <motion.div
                key={city}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
                variants={fadeUp}
                custom={i % 3}
                className="glass-page-card group cursor-pointer"
                onClick={() => setLocation(`/biens?ville=${city}`)}
                data-testid={`ville-card-${city}`}
              >
                {/* Image */}
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={data.img}
                    alt={city}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-[0.65rem] font-medium tracking-[0.12em] uppercase px-2.5 py-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white">
                      {data.highlight}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
                    <MapPin size={12} className="text-white/70" />
                    <span className="text-white font-serif text-xl font-medium">{city}</span>
                  </div>
                </div>
                {/* Body */}
                <div className="p-5">
                  <p className="text-[var(--muted-text)] text-sm leading-relaxed mb-4">{data.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {count && (
                        <>
                          <div className="text-center">
                            <p className="font-serif text-lg text-[var(--ink-text)]">{count.vente}</p>
                            <p className="text-[0.62rem] tracking-[0.1em] uppercase text-[var(--muted-text)]">Vente</p>
                          </div>
                          <div className="w-px h-6 bg-[var(--divider)]" />
                          <div className="text-center">
                            <p className="font-serif text-lg text-[var(--ink-text)]">{count.location}</p>
                            <p className="text-[0.62rem] tracking-[0.1em] uppercase text-[var(--muted-text)]">Location</p>
                          </div>
                        </>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-[0.7rem] tracking-[0.08em] uppercase text-[var(--ink-text)] group-hover:gap-2 transition-all">
                      Explorer <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
