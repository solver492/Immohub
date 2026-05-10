import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Search, ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { fetchBiens, countBiensByVille } from "@/lib/supabase";
import { Bien, MOROCCAN_CITIES, TYPE_BIEN_LABELS } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import BienCard from "@/components/BienCard";

const CITY_IMAGES: Record<string, string> = {
  Tanger: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&q=80",
  Casablanca: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800&q=80",
  Rabat: "https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?w=800&q=80",
  Marrakech: "https://images.unsplash.com/photo-1539020140153-e479b8bcd9cc?w=800&q=80",
  Fès: "https://images.unsplash.com/photo-1572803787f25-0b4e4d4d7143?w=800&q=80",
  Agadir: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=800&q=80",
};

const HERO_IMAGE = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=85";

const DEMO_BIENS: Bien[] = [
  {
    id: "demo-1", titre: "Villa d'exception avec piscine — Palmeraie", description: "Magnifique villa avec vue panoramique", type_bien: "villa",
    transaction: "vente", prix: 8500000, devise: "MAD", ville: "Marrakech", quartier: "Palmeraie", surface: 450, chambres: 5, salles_bain: 4, statut: "disponible", proprietaire_id: "demo",
  },
  {
    id: "demo-2", titre: "Riad authentique en médina rénovée", description: "Riad rénové au coeur de la médina", type_bien: "riad",
    transaction: "vente", prix: 3200000, devise: "MAD", ville: "Fès", quartier: "Médina", surface: 280, chambres: 4, salles_bain: 3, statut: "disponible", proprietaire_id: "demo",
  },
  {
    id: "demo-3", titre: "Appartement vue détroit — Malabata", description: "Somptueux appartement avec vue imprenable", type_bien: "appartement",
    transaction: "vente", prix: 4200000, devise: "MAD", ville: "Tanger", quartier: "Malabata", surface: 180, chambres: 3, salles_bain: 2, statut: "disponible", proprietaire_id: "demo",
  },
];

const DEMO_LOCATIONS: Bien[] = [
  {
    id: "demo-l1", titre: "Studio meublé — Gauthier", description: "Studio moderne entièrement meublé", type_bien: "studio",
    transaction: "location", prix: 5500, devise: "MAD", ville: "Casablanca", quartier: "Gauthier", surface: 45, chambres: 1, salles_bain: 1, statut: "disponible", proprietaire_id: "demo",
  },
  {
    id: "demo-l2", titre: "Appartement dans résidence sécurisée", description: "Bel appartement dans résidence sécurisée", type_bien: "appartement",
    transaction: "location", prix: 8000, devise: "MAD", ville: "Rabat", quartier: "Hay Riad", surface: 90, chambres: 2, salles_bain: 2, statut: "disponible", proprietaire_id: "demo",
  },
  {
    id: "demo-l3", titre: "Villa prestige — Hivernage", description: "Villa de luxe dans le quartier chic", type_bien: "villa",
    transaction: "location", prix: 25000, devise: "MAD", ville: "Marrakech", quartier: "Hivernage", surface: 300, chambres: 4, salles_bain: 3, statut: "disponible", proprietaire_id: "demo",
  },
  {
    id: "demo-l4", titre: "Bureau centre ville — Agdal", description: "Espace de bureau professionnel", type_bien: "bureau",
    transaction: "location", prix: 12000, devise: "MAD", ville: "Rabat", quartier: "Agdal", surface: 120, chambres: 0, salles_bain: 1, statut: "disponible", proprietaire_id: "demo",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] } }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: (i = 0) => ({ opacity: 1, transition: { duration: 1.0, delay: i * 0.1, ease: "easeOut" } }),
};

function useReveal() {
  return {
    initial: "hidden",
    whileInView: "show",
    viewport: { once: true, amount: 0.2 },
  };
}

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
  const [totalCount, setTotalCount] = useState(325);
  const [loading, setLoading] = useState(true);
  const reveal = useReveal();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [prestige, locs, counts] = await Promise.all([
        fetchBiens({ transaction: "vente", sort: "recent" }),
        fetchBiens({ transaction: "location", sort: "recent" }),
        countBiensByVille(),
      ]);
      setPrestigeBiens(prestige.length > 0 ? prestige.slice(0, 3) : DEMO_BIENS);
      setLocationBiens(locs.length > 0 ? locs.slice(0, 4) : DEMO_LOCATIONS);
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
    <div className="lux-bg min-h-screen">

      {/* ── HERO ── */}
      <section className="relative h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
        {/* Background image */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <img src={HERO_IMAGE} alt="Propriété de luxe au Maroc" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </motion.div>

        {/* Hero content */}
        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
          <motion.p
            variants={fadeIn} initial="hidden" animate="show" custom={0}
            className="overline-label text-white/70 mb-6"
          >
            Portail Immobilier Premium · Maroc
          </motion.p>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="serif-display text-white text-5xl md:text-7xl lg:text-8xl mb-8 leading-[1.06]"
          >
            {t("hero_title")}{" "}
            <em className="italic font-normal">{t("hero_title2")}</em>
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="text-white/70 text-base md:text-lg font-light mb-12 max-w-xl mx-auto leading-relaxed"
          >
            {t("hero_sub")}
          </motion.p>

          {/* Search bar */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="bg-white/95 backdrop-blur-sm max-w-3xl mx-auto"
          >
            {/* Transaction tabs */}
            <div className="flex border-b border-[#e8e3dc]">
              {["all", "vente", "location"].map((tx) => (
                <button
                  key={tx}
                  onClick={() => setTransaction(tx)}
                  data-testid={`filter-transaction-${tx}`}
                  className={`flex-1 py-3 text-[0.68rem] font-medium tracking-[0.12em] uppercase transition-all cursor-pointer ${
                    transaction === tx
                      ? "text-[#1a1a1a] border-b-2 border-[#1a1a1a] -mb-px"
                      : "text-[#b5aca0] hover:text-[#1a1a1a]"
                  }`}
                >
                  {tx === "all" ? t("all") : t(tx)}
                </button>
              ))}
            </div>
            {/* Inputs */}
            <div className="flex flex-col md:flex-row items-stretch gap-0 px-6 py-5">
              <div className="flex-1 flex items-center gap-3 pr-6 border-r border-[#e8e3dc]">
                <Search size={14} className="text-[#b5aca0] flex-shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={t("search_placeholder")}
                  data-testid="input-search"
                  className="lux-input border-none py-0 text-sm"
                />
              </div>
              <div className="md:px-6 md:border-r border-[#e8e3dc] py-2 md:py-0">
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  data-testid="select-city"
                  className="lux-select border-none py-0 min-w-[120px]"
                >
                  <option value="">{t("filter_city")}</option>
                  {cityList.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="md:px-6 md:border-r border-[#e8e3dc] py-2 md:py-0">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  data-testid="select-type"
                  className="lux-select border-none py-0 min-w-[140px]"
                >
                  <option value="all">{t("filter_type")}</option>
                  {Object.entries(TYPE_BIEN_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="md:pl-6 pt-3 md:pt-0">
                <button
                  onClick={handleSearch}
                  data-testid="button-search"
                  className="btn-fill w-full md:w-auto whitespace-nowrap"
                >
                  <Search size={13} /> Rechercher
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-white/40 text-[0.6rem] tracking-[0.2em] uppercase">Défiler</span>
          <div className="w-px h-8 bg-white/30 relative overflow-hidden">
            <div className="scroll-dot absolute top-0 left-0 right-0 h-4 bg-white/60" />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-b border-[#e8e3dc] bg-white">
        <div className="lux-container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#e8e3dc]">
            {[
              { value: `${totalCount}+`, label: "Biens disponibles" },
              { value: Object.keys(cityCounts).length || "12", label: "Villes couvertes" },
              { value: "48", label: "Ventes ce mois" },
              { value: "200+", label: "Quartiers" },
            ].map(({ value, label }, i) => (
              <motion.div
                key={i}
                {...reveal}
                variants={fadeUp}
                custom={i}
                className="py-10 px-8 text-center"
                data-testid={`stat-card-${i}`}
              >
                <p className="stat-number mb-2">{value}</p>
                <p className="text-[0.72rem] font-medium tracking-[0.1em] uppercase text-[#b5aca0]">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRESTIGE SECTION ── */}
      <section className="lux-section">
        <div className="lux-container">
          {/* Header */}
          <div className="flex items-end justify-between mb-16">
            <motion.div {...reveal} variants={fadeUp}>
              <span className="rule" />
              <p className="overline-label mb-3">Sélection prestige</p>
              <h2 className="serif-display text-4xl md:text-5xl">
                {t("prestige_section")}
              </h2>
            </motion.div>
            <motion.button
              {...reveal} variants={fadeIn}
              onClick={() => setLocation("/biens?transaction=vente")}
              data-testid="button-view-all-vente"
              className="hidden md:flex items-center gap-2 text-[0.72rem] font-medium tracking-[0.1em] uppercase text-[#1a1a1a] hover:text-[#b5aca0] transition-colors cursor-pointer"
            >
              Voir tout <ArrowRight size={14} />
            </motion.button>
          </div>

          {/* Asymmetric Grid — editorial layout */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
              <div className="md:col-span-7 h-[420px] bg-[#f0ece6] animate-pulse" />
              <div className="md:col-span-5 grid grid-rows-2 gap-4 md:gap-6">
                <div className="h-[200px] bg-[#f0ece6] animate-pulse" />
                <div className="h-[200px] bg-[#f0ece6] animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
              {/* Large featured card */}
              {prestigeBiens[0] && (
                <motion.div
                  {...reveal} variants={fadeUp} custom={0}
                  className="md:col-span-7"
                >
                  <BienCard bien={prestigeBiens[0]} large />
                </motion.div>
              )}
              {/* Two stacked smaller cards */}
              <div className="md:col-span-5 grid grid-rows-2 gap-4 md:gap-6">
                {prestigeBiens.slice(1, 3).map((bien, i) => (
                  <motion.div key={bien.id} {...reveal} variants={fadeUp} custom={i + 1}>
                    <BienCard bien={bien} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Mobile "see all" */}
          <div className="mt-10 flex justify-center md:hidden">
            <button
              onClick={() => setLocation("/biens?transaction=vente")}
              className="btn-outline"
            >
              Voir tout <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* ── EDITORIAL SEPARATOR ── */}
      <div className="lux-container">
        <div className="rule-full" />
      </div>

      {/* ── LOCATIONS SECTION ── */}
      <section className="lux-section">
        <div className="lux-container">
          <div className="flex items-end justify-between mb-16">
            <motion.div {...reveal} variants={fadeUp}>
              <span className="rule" style={{ background: "#b5aca0" }} />
              <p className="overline-label mb-3">À louer</p>
              <h2 className="serif-display text-4xl md:text-5xl">
                {t("location_section")}
              </h2>
            </motion.div>
            <motion.button
              {...reveal} variants={fadeIn}
              onClick={() => setLocation("/biens?transaction=location")}
              data-testid="button-view-all-location"
              className="hidden md:flex items-center gap-2 text-[0.72rem] font-medium tracking-[0.1em] uppercase text-[#1a1a1a] hover:text-[#b5aca0] transition-colors cursor-pointer"
            >
              Voir tout <ArrowRight size={14} />
            </motion.button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[320px] bg-[#f0ece6] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {locationBiens.map((bien, i) => (
                <motion.div key={bien.id} {...reveal} variants={fadeUp} custom={i}>
                  <BienCard bien={bien} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-10 flex justify-center md:hidden">
            <button onClick={() => setLocation("/biens?transaction=location")} className="btn-outline">
              Voir tout <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* ── CITIES SECTION ── */}
      <section className="lux-section bg-[#1a1a1a] text-white">
        <div className="lux-container">
          <div className="flex items-end justify-between mb-16">
            <motion.div {...reveal} variants={fadeUp}>
              <span className="rule" />
              <p className="overline-label text-[#b5aca0] mb-3">Explorer</p>
              <h2 className="serif-display text-white text-4xl md:text-5xl">
                {t("cities_section")}
              </h2>
            </motion.div>
          </div>

          {/* Asymmetric city grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.keys(MOROCCAN_CITIES).slice(0, 4).map((city, i) => {
              const counts = cityCounts[city] || { total: 0 };
              const isLarge = i === 0;
              return (
                <motion.button
                  key={city}
                  {...reveal} variants={fadeUp} custom={i}
                  onClick={() => setLocation(`/biens?ville=${city}`)}
                  data-testid={`city-card-${city}`}
                  className={`city-card text-left ${isLarge ? "md:col-span-2 h-[320px]" : "h-[220px]"}`}
                >
                  <img
                    src={CITY_IMAGES[city] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80"}
                    alt={city}
                  />
                  <div className="city-card-overlay" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="font-serif text-white text-xl font-medium mb-1">{city}</p>
                    <p className="text-white/50 text-[0.68rem] tracking-[0.1em] uppercase">
                      {counts.total || "—"} {t("listings")}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="lux-section bg-[#f5f3ef]">
        <div className="lux-container">
          <motion.div
            {...reveal} variants={fadeUp}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="rule mx-auto" />
            <p className="overline-label mb-6">Propriétaires</p>
            <h2 className="serif-display text-4xl md:text-5xl mb-6 leading-tight">
              Vous avez un bien<br />
              <em className="italic font-normal">à vendre ou louer ?</em>
            </h2>
            <p className="text-[#b5aca0] text-base font-light mb-10 leading-relaxed">
              Rejoignez les centaines de propriétaires qui nous font confiance.<br />
              Publiez votre annonce en quelques minutes.
            </p>
            <button
              onClick={() => setLocation("/publier")}
              data-testid="button-cta-publish"
              className="btn-fill text-sm px-10 py-4"
            >
              {t("cta_publish")} <ArrowRight size={14} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#e8e3dc] bg-white">
        <div className="lux-container py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="font-serif text-[1.1rem] font-medium tracking-[0.18em] uppercase text-[#1a1a1a]">
              Movia <span className="opacity-40 font-light">Immo</span>
            </span>
            <p className="text-[0.72rem] font-medium tracking-[0.08em] uppercase text-[#b5aca0]">
              © 2026 Movia Immo — Le portail immobilier premium du Maroc
            </p>
            <div className="flex items-center gap-6 text-[0.72rem] font-medium tracking-[0.08em] uppercase text-[#b5aca0]">
              <span className="hover:text-[#1a1a1a] cursor-pointer transition-colors">Mentions légales</span>
              <span className="hover:text-[#1a1a1a] cursor-pointer transition-colors">Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
