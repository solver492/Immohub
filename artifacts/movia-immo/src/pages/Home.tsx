import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, ChevronDown, TrendingUp, Home, Building2, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchBiens, countBiensByVille } from "@/lib/supabase";
import { Bien, MOROCCAN_CITIES, TYPE_BIEN_LABELS } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import BienCard from "@/components/BienCard";
import ParticleBackground from "@/components/ParticleBackground";

const CITY_IMAGES: Record<string, string> = {
  Tanger: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=600&q=80",
  Casablanca: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=600&q=80",
  Rabat: "https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?w=600&q=80",
  Marrakech: "https://images.unsplash.com/photo-1539020140153-e479b8bcd9cc?w=600&q=80",
  Fès: "https://images.unsplash.com/photo-1572803787f25-0b4e4d4d7143?w=600&q=80",
  Agadir: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&q=80",
};

const DEMO_BIENS: Bien[] = [
  {
    id: "demo-1", titre: "Villa d'exception avec piscine", description: "Magnifique villa avec vue panoramique", type_bien: "villa",
    transaction: "vente", prix: 8500000, devise: "MAD", ville: "Marrakech", quartier: "Palmeraie", surface: 450, chambres: 5, salles_bain: 4, statut: "disponible", proprietaire_id: "demo",
  },
  {
    id: "demo-2", titre: "Riad authentique Médina", description: "Riad rénové au coeur de la médina", type_bien: "riad",
    transaction: "vente", prix: 3200000, devise: "MAD", ville: "Fès", quartier: "Médina", surface: 280, chambres: 4, salles_bain: 3, statut: "disponible", proprietaire_id: "demo",
  },
  {
    id: "demo-3", titre: "Appartement vue mer Malabata", description: "Somptueux appartement avec vue imprenable sur le détroit", type_bien: "appartement",
    transaction: "vente", prix: 4200000, devise: "MAD", ville: "Tanger", quartier: "Malabata", surface: 180, chambres: 3, salles_bain: 2, statut: "disponible", proprietaire_id: "demo",
  },
];

const DEMO_LOCATIONS: Bien[] = [
  {
    id: "demo-l1", titre: "Studio meublé Gauthier", description: "Studio moderne entièrement meublé", type_bien: "studio",
    transaction: "location", prix: 5500, devise: "MAD", ville: "Casablanca", quartier: "Gauthier", surface: 45, chambres: 1, salles_bain: 1, statut: "disponible", proprietaire_id: "demo",
  },
  {
    id: "demo-l2", titre: "Appartement Hay Riad", description: "Bel appartement dans résidence sécurisée", type_bien: "appartement",
    transaction: "location", prix: 8000, devise: "MAD", ville: "Rabat", quartier: "Hay Riad", surface: 90, chambres: 2, salles_bain: 2, statut: "disponible", proprietaire_id: "demo",
  },
  {
    id: "demo-l3", titre: "Villa Hivernage luxe", description: "Villa de luxe dans le quartier chic", type_bien: "villa",
    transaction: "location", prix: 25000, devise: "MAD", ville: "Marrakech", quartier: "Hivernage", surface: 300, chambres: 4, salles_bain: 3, statut: "disponible", proprietaire_id: "demo",
  },
  {
    id: "demo-l4", titre: "Bureau centre Agdal", description: "Espace de bureau professionnel", type_bien: "bureau",
    transaction: "location", prix: 12000, devise: "MAD", ville: "Rabat", quartier: "Agdal", surface: 120, chambres: 0, salles_bain: 1, statut: "disponible", proprietaire_id: "demo",
  },
];

export default function HomePage() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [transaction, setTransaction] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("");
  const [prestigeBiens, setPrestigeBiens] = useState<Bien[]>([]);
  const [locationBiens, setLocationBiens] = useState<Bien[]>([]);
  const [cityCounts, setCityCounts] = useState<Record<string, { total: number; vente: number; location: number }>>({});
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [prestige, locs, counts] = await Promise.all([
        fetchBiens({ transaction: "vente", sort: "recent" }),
        fetchBiens({ transaction: "location", sort: "recent" }),
        countBiensByVille(),
      ]);

      const displayPrestige = prestige.length > 0 ? prestige.slice(0, 3) : DEMO_BIENS;
      const displayLocs = locs.length > 0 ? locs.slice(0, 4) : DEMO_LOCATIONS;
      setPrestigeBiens(displayPrestige);
      setLocationBiens(displayLocs);
      setCityCounts(Object.keys(counts).length > 0 ? counts : {
        Tanger: { total: 48, vente: 30, location: 18 },
        Casablanca: { total: 124, vente: 75, location: 49 },
        Rabat: { total: 86, vente: 52, location: 34 },
        Marrakech: { total: 67, vente: 40, location: 27 },
      });
      setTotalCount(prestige.length + locs.length || 325);
      setLoading(false);
    }
    load();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (transaction !== "all") params.set("transaction", transaction);
    if (typeFilter !== "all") params.set("type_bien", typeFilter);
    if (cityFilter) params.set("ville", cityFilter);
    setLocation(`/biens?${params.toString()}`);
  };

  const cityList = Object.keys(MOROCCAN_CITIES);

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden">
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#04060b]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-cyan-400 text-sm font-medium mb-8 border border-cyan-400/20"
          >
            <TrendingUp size={14} />
            <span>{totalCount}+ annonces disponibles</span>
          </motion.div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            {t("hero_title")}{" "}
            <span className="neon-text">{t("hero_title2")}</span>
          </h1>

          <p className="text-white/60 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            {t("hero_sub")}
          </p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="glass-strong rounded-2xl p-4 md:p-6 max-w-3xl mx-auto"
          >
            {/* Transaction Toggle */}
            <div className="flex gap-2 mb-4">
              {["all", "vente", "location"].map((tx) => (
                <button
                  key={tx}
                  onClick={() => setTransaction(tx)}
                  data-testid={`filter-transaction-${tx}`}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    transaction === tx
                      ? "bg-cyan-400 text-[#04060b] font-bold"
                      : "glass text-white/60 hover:text-white border border-white/10"
                  }`}
                >
                  {tx === "all" ? t("all") : t(tx)}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={t("search_placeholder")}
                  data-testid="input-search"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50 transition-colors"
                />
              </div>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                data-testid="select-city"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors cursor-pointer min-w-[150px]"
              >
                <option value="" className="bg-[#04060b]">{t("filter_city")}</option>
                {cityList.map((c) => (
                  <option key={c} value={c} className="bg-[#04060b]">{c}</option>
                ))}
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                data-testid="select-type"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors cursor-pointer min-w-[150px]"
              >
                <option value="all" className="bg-[#04060b]">{t("filter_type")}</option>
                {Object.entries(TYPE_BIEN_LABELS).map(([k, v]) => (
                  <option key={k} value={k} className="bg-[#04060b]">{v}</option>
                ))}
              </select>
              <button
                onClick={handleSearch}
                data-testid="button-search"
                className="glow-btn px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 whitespace-nowrap"
              >
                <Search size={15} /> Rechercher
              </button>
            </div>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown size={24} className="text-white/30" />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Home, label: "Biens disponibles", value: totalCount.toString() + "+" },
              { icon: Building2, label: "Villes couvertes", value: Object.keys(cityCounts).length.toString() || "12" },
              { icon: TrendingUp, label: "Ventes ce mois", value: "48" },
              { icon: MapPin, label: "Quartiers", value: "200+" },
            ].map(({ icon: Icon, label, value }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-5 text-center"
                data-testid={`stat-card-${i}`}
              >
                <Icon size={22} className="text-cyan-400 mx-auto mb-2" />
                <p className="text-2xl font-bold neon-text">{value}</p>
                <p className="text-white/50 text-xs mt-1">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prestige Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
                {t("prestige_section")}
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent mt-2" />
            </div>
            <button
              onClick={() => setLocation("/biens?transaction=vente")}
              className="text-sm text-cyan-400/70 hover:text-cyan-400 transition-colors"
              data-testid="button-view-all-vente"
            >
              Voir tout →
            </button>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {prestigeBiens.map((bien, i) => (
                <motion.div
                  key={bien.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <BienCard bien={bien} prestige />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
                {t("location_section")}
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-violet-400 to-transparent mt-2" />
            </div>
            <button
              onClick={() => setLocation("/biens?transaction=location")}
              className="text-sm text-violet-400/70 hover:text-violet-400 transition-colors"
              data-testid="button-view-all-location"
            >
              Voir tout →
            </button>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => <div key={i} className="glass-card rounded-xl h-64 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {locationBiens.map((bien, i) => (
                <motion.div
                  key={bien.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <BienCard bien={bien} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
              {t("cities_section")}
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent mt-2" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.keys(MOROCCAN_CITIES).slice(0, 4).map((city, i) => {
              const counts = cityCounts[city] || { total: 0, vente: 0, location: 0 };
              return (
                <motion.button
                  key={city}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setLocation(`/biens?ville=${city}`)}
                  data-testid={`city-card-${city}`}
                  className="relative rounded-2xl overflow-hidden h-48 group cursor-pointer text-left"
                >
                  <img
                    src={CITY_IMAGES[city] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80"}
                    alt={city}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 border border-cyan-400/0 group-hover:border-cyan-400/30 rounded-2xl transition-all duration-300" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="font-serif text-white font-semibold text-lg">{city}</p>
                    <p className="text-white/50 text-xs">{counts.total || "—"} {t("listings")}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-12 neon-border"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
              Vous avez un bien à vendre ou louer ?
            </h2>
            <p className="text-white/60 mb-8">
              Rejoignez les centaines de propriétaires qui nous font confiance.
            </p>
            <button
              onClick={() => setLocation("/publier")}
              data-testid="button-cta-publish"
              className="glow-btn px-8 py-4 rounded-2xl font-semibold text-lg"
            >
              {t("cta_publish")}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-serif text-lg font-bold neon-text tracking-widest">
            MOVIA<span className="text-white/40 font-light"> IMMO</span>
          </span>
          <p className="text-white/30 text-sm">© 2026 Movia Immo — Le portail immobilier premium du Maroc</p>
          <div className="flex items-center gap-4 text-white/30 text-sm">
            <span className="hover:text-white/60 cursor-pointer transition-colors">Mentions légales</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
