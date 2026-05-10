import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { fetchBiens, countBiensByVille } from "@/lib/supabase";
import { Bien, MOROCCAN_CITIES, TYPE_BIEN_LABELS } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import BienCard from "@/components/BienCard";

/* ── Images ── */
const IMG_VENTE = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=85";
const IMG_LOCATION = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1800&q=85";

const CITY_IMAGES: Record<string, string> = {
  Tanger: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&q=80",
  Casablanca: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800&q=80",
  Rabat: "https://images.unsplash.com/photo-1563991655280-cb95c90ca2fb?w=800&q=80",
  Marrakech: "https://images.unsplash.com/photo-1539020140153-e479b8bcd9cc?w=800&q=80",
};

/* ── Demo data ── */
const DEMO_BIENS: Bien[] = [
  { id: "demo-1", titre: "Villa d'exception — Palmeraie", description: "", type_bien: "villa", transaction: "vente", prix: 8500000, devise: "MAD", ville: "Marrakech", quartier: "Palmeraie", surface: 450, chambres: 5, salles_bain: 4, statut: "disponible", proprietaire_id: "demo" },
  { id: "demo-2", titre: "Riad authentique — Médina", description: "", type_bien: "riad", transaction: "vente", prix: 3200000, devise: "MAD", ville: "Fès", quartier: "Médina", surface: 280, chambres: 4, salles_bain: 3, statut: "disponible", proprietaire_id: "demo" },
  { id: "demo-3", titre: "Appartement vue mer — Malabata", description: "", type_bien: "appartement", transaction: "vente", prix: 4200000, devise: "MAD", ville: "Tanger", quartier: "Malabata", surface: 180, chambres: 3, salles_bain: 2, statut: "disponible", proprietaire_id: "demo" },
];
const DEMO_LOCATIONS: Bien[] = [
  { id: "demo-l1", titre: "Studio meublé — Gauthier", description: "", type_bien: "studio", transaction: "location", prix: 5500, devise: "MAD", ville: "Casablanca", quartier: "Gauthier", surface: 45, chambres: 1, salles_bain: 1, statut: "disponible", proprietaire_id: "demo" },
  { id: "demo-l2", titre: "Appartement résidence sécurisée", description: "", type_bien: "appartement", transaction: "location", prix: 8000, devise: "MAD", ville: "Rabat", quartier: "Hay Riad", surface: 90, chambres: 2, salles_bain: 2, statut: "disponible", proprietaire_id: "demo" },
  { id: "demo-l3", titre: "Villa prestige — Hivernage", description: "", type_bien: "villa", transaction: "location", prix: 25000, devise: "MAD", ville: "Marrakech", quartier: "Hivernage", surface: 300, chambres: 4, salles_bain: 3, statut: "disponible", proprietaire_id: "demo" },
  { id: "demo-l4", titre: "Bureau centre — Agdal", description: "", type_bien: "bureau", transaction: "location", prix: 12000, devise: "MAD", ville: "Rabat", quartier: "Agdal", surface: 120, chambres: 0, salles_bain: 1, statut: "disponible", proprietaire_id: "demo" },
];

/* ── Framer variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] } }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: (i = 0) => ({ opacity: 1, transition: { duration: 1.0, delay: i * 0.1, ease: "easeOut" } }),
};
function useReveal() {
  return { initial: "hidden", whileInView: "show" as const, viewport: { once: true, amount: 0.2 } };
}

/* ── Split Hero ── */
function SplitHero({ onSearch }: { onSearch: (p: URLSearchParams) => void }) {
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0.5); // 0 = left, 1 = right
  const [hovered, setHovered] = useState(false);
  const [search, setSearch] = useState("");
  const [transaction, setTransaction] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("");

  const isLeft = mouseX < 0.5;
  const leftW = hovered ? (isLeft ? 62 : 38) : 50;

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouseX((e.clientX - rect.left) / rect.width);
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
    <section
      ref={containerRef}
      className="relative h-screen min-h-[620px] overflow-hidden cursor-none select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Left panel: Location ── */}
      <div
        className="hero-split-panel left-0"
        style={{ width: `${leftW}%` }}
      >
        <img src={IMG_LOCATION} alt="Location" className="hero-split-img absolute inset-0" style={{ width: "100vw", height: "100%", maxWidth: "none" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        {/* Location CTA — visible when left is dominant */}
        <motion.div
          className="absolute left-12 bottom-20 z-20"
          animate={{ opacity: hovered && isLeft ? 1 : 0, x: hovered && isLeft ? 0 : -20 }}
          transition={{ duration: 0.4 }}
        >
          <p className="overline-label text-white/60 mb-2">Trouver à louer</p>
          <h2 className="font-serif text-white text-4xl md:text-5xl font-medium mb-6 leading-tight max-w-xs">
            Votre chez-vous,<br /><em className="italic font-normal">au meilleur prix</em>
          </h2>
          <button
            onClick={() => setLocation("/biens?transaction=location")}
            className="flex items-center gap-2 px-6 py-3 bg-white text-[#1a1a1a] text-[0.72rem] font-medium tracking-[0.1em] uppercase transition-all hover:bg-[var(--gold)] hover:text-white cursor-pointer"
          >
            Voir les locations <ArrowRight size={13} />
          </button>
        </motion.div>
      </div>

      {/* ── Right panel: Vente ── */}
      <div
        className="hero-split-panel right-0"
        style={{ width: `${100 - leftW}%` }}
      >
        <img
          src={IMG_VENTE}
          alt="Vente"
          className="hero-split-img absolute inset-0"
          style={{ width: "100vw", height: "100%", maxWidth: "none", objectPosition: "right center", right: 0, left: "auto" }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/30 to-transparent" />
        {/* Sale CTA — visible when right is dominant */}
        <motion.div
          className="absolute right-12 bottom-20 z-20 text-right"
          animate={{ opacity: hovered && !isLeft ? 1 : 0, x: hovered && !isLeft ? 0 : 20 }}
          transition={{ duration: 0.4 }}
        >
          <p className="overline-label text-white/60 mb-2 text-right">Acheter votre bien</p>
          <h2 className="font-serif text-white text-4xl md:text-5xl font-medium mb-6 leading-tight max-w-xs ml-auto">
            Investissez dans<br /><em className="italic font-normal">l'excellence</em>
          </h2>
          <button
            onClick={() => setLocation("/biens?transaction=vente")}
            className="flex items-center gap-2 px-6 py-3 bg-white text-[#1a1a1a] text-[0.72rem] font-medium tracking-[0.1em] uppercase transition-all hover:bg-[var(--gold)] hover:text-white cursor-pointer ml-auto"
          >
            Voir les ventes <ArrowRight size={13} />
          </button>
        </motion.div>
      </div>

      {/* ── Vertical divider line ── */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white/30 z-10 transition-all duration-500"
        style={{ left: `${leftW}%` }}
      />

      {/* ── Center overlay: title + search ── */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 pointer-events-none">
        {/* Glass title badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="hero-glass-title text-center mb-8 max-w-3xl"
        >
          <p className="overline-label text-white/70 mb-3">Portail Immobilier Premium · Maroc</p>
          <h1 className="font-serif text-white text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.06]">
            {t("hero_title")}{" "}
            <em className="italic font-normal">{t("hero_title2")}</em>
          </h1>
          <p className="text-white/70 text-sm md:text-base font-light mt-4 max-w-lg mx-auto leading-relaxed">
            {t("hero_sub")}
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="w-full max-w-3xl pointer-events-auto"
        >
          <div className="bg-white/95 backdrop-blur-sm">
            {/* Transaction tabs */}
            <div className="flex border-b border-[#e8e3dc]">
              {["all", "vente", "location"].map((tx) => (
                <button
                  key={tx}
                  onClick={() => setTransaction(tx)}
                  data-testid={`filter-transaction-${tx}`}
                  className={`flex-1 py-3 text-[0.66rem] font-medium tracking-[0.12em] uppercase transition-all cursor-pointer ${
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
            <div className="flex flex-col md:flex-row items-stretch px-5 py-4 gap-3 md:gap-0">
              <div className="flex-1 flex items-center gap-3 md:pr-4 md:border-r border-[#e8e3dc]">
                <Search size={13} className="text-[#b5aca0] flex-shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={t("search_placeholder")}
                  data-testid="input-search"
                  className="lux-input border-none py-1 text-sm"
                />
              </div>
              <div className="md:px-4 md:border-r border-[#e8e3dc]">
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  data-testid="select-city"
                  className="lux-select border-none py-1 min-w-[120px] text-sm"
                >
                  <option value="">{t("filter_city")}</option>
                  {cityList.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="md:px-4 md:border-r border-[#e8e3dc]">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  data-testid="select-type"
                  className="lux-select border-none py-1 min-w-[130px] text-sm"
                >
                  <option value="all">{t("filter_type")}</option>
                  {Object.entries(TYPE_BIEN_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="md:pl-4">
                <button
                  onClick={handleSearch}
                  data-testid="button-search"
                  className="btn-fill w-full md:w-auto whitespace-nowrap text-[0.68rem]"
                >
                  <Search size={12} /> Rechercher
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-white/40 text-[0.58rem] tracking-[0.2em] uppercase">Défiler</span>
        <div className="w-px h-8 bg-white/25 relative overflow-hidden">
          <div className="scroll-dot absolute top-0 left-0 right-0 h-4 bg-white/50" />
        </div>
      </div>
    </section>
  );
}

/* ── Main page ── */
export default function HomePage() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
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

  return (
    <div className="lux-bg min-h-screen">

      {/* ── SPLIT HERO ── */}
      <SplitHero onSearch={() => {}} />

      {/* ── STATS BAR ── */}
      <section className="border-b border-[var(--divider)] bg-[var(--card-bg)] transition-colors duration-300">
        <div className="lux-container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--divider)]">
            {[
              { value: `${totalCount}+`, label: "Biens disponibles" },
              { value: `${Object.keys(cityCounts).length || "12"}`, label: "Villes couvertes" },
              { value: "48", label: "Ventes ce mois" },
              { value: "200+", label: "Quartiers" },
            ].map(({ value, label }, i) => (
              <motion.div key={i} {...reveal} variants={fadeUp} custom={i}
                className="py-10 px-8 text-center" data-testid={`stat-card-${i}`}>
                <p className="stat-number mb-2">{value}</p>
                <p className="text-[0.68rem] font-medium tracking-[0.1em] uppercase text-[var(--muted-text)]">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRESTIGE SECTION ── */}
      <section className="lux-section">
        <div className="lux-container px-6">
          <div className="flex items-end justify-between mb-14">
            <motion.div {...reveal} variants={fadeUp}>
              <span className="rule" />
              <p className="overline-label mb-3">Sélection prestige</p>
              <h2 className="serif-display text-4xl md:text-5xl">{t("prestige_section")}</h2>
            </motion.div>
            <motion.button {...reveal} variants={fadeIn}
              onClick={() => setLocation("/biens?transaction=vente")}
              data-testid="button-view-all-vente"
              className="hidden md:flex items-center gap-2 text-[0.68rem] font-medium tracking-[0.1em] uppercase text-[var(--ink-text)] hover:text-[var(--muted-text)] transition-colors cursor-pointer"
            >
              Voir tout <ArrowRight size={13} />
            </motion.button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-7 h-[400px] bg-[var(--alt-bg)] animate-pulse" />
              <div className="md:col-span-5 grid grid-rows-2 gap-5">
                <div className="h-[190px] bg-[var(--alt-bg)] animate-pulse" />
                <div className="h-[190px] bg-[var(--alt-bg)] animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {prestigeBiens[0] && (
                <motion.div {...reveal} variants={fadeUp} custom={0} className="md:col-span-7">
                  <BienCard bien={prestigeBiens[0]} large />
                </motion.div>
              )}
              <div className="md:col-span-5 grid grid-rows-2 gap-5">
                {prestigeBiens.slice(1, 3).map((bien, i) => (
                  <motion.div key={bien.id} {...reveal} variants={fadeUp} custom={i + 1}>
                    <BienCard bien={bien} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex justify-center md:hidden">
            <button onClick={() => setLocation("/biens?transaction=vente")} className="btn-outline">
              Voir tout <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      <div className="lux-container px-6"><div className="rule-full" /></div>

      {/* ── LOCATION SECTION ── */}
      <section className="lux-section">
        <div className="lux-container px-6">
          <div className="flex items-end justify-between mb-14">
            <motion.div {...reveal} variants={fadeUp}>
              <span className="rule" style={{ background: "var(--taupe, #b5aca0)" }} />
              <p className="overline-label mb-3">À louer</p>
              <h2 className="serif-display text-4xl md:text-5xl">{t("location_section")}</h2>
            </motion.div>
            <motion.button {...reveal} variants={fadeIn}
              onClick={() => setLocation("/biens?transaction=location")}
              data-testid="button-view-all-location"
              className="hidden md:flex items-center gap-2 text-[0.68rem] font-medium tracking-[0.1em] uppercase text-[var(--ink-text)] hover:text-[var(--muted-text)] transition-colors cursor-pointer"
            >
              Voir tout <ArrowRight size={13} />
            </motion.button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1,2,3,4].map((i) => <div key={i} className="h-[300px] bg-[var(--alt-bg)] animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {locationBiens.map((bien, i) => (
                <motion.div key={bien.id} {...reveal} variants={fadeUp} custom={i}>
                  <BienCard bien={bien} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CITIES ── */}
      <section className="lux-section bg-[var(--ink-text)]">
        <div className="lux-container px-6">
          <div className="flex items-end justify-between mb-14">
            <motion.div {...reveal} variants={fadeUp}>
              <span className="rule" />
              <p className="overline-label text-[var(--muted-text)] mb-3">Explorer</p>
              <h2 className="font-serif text-white text-4xl md:text-5xl font-medium">{t("cities_section")}</h2>
            </motion.div>
            <motion.button {...reveal} variants={fadeIn}
              onClick={() => setLocation("/villes")}
              className="hidden md:flex items-center gap-2 text-[0.68rem] font-medium tracking-[0.1em] uppercase text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              Toutes les villes <ArrowRight size={13} />
            </motion.button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.keys(MOROCCAN_CITIES).slice(0, 4).map((city, i) => {
              const counts = cityCounts[city] || { total: 0 };
              const isLarge = i === 0;
              return (
                <motion.button key={city} {...reveal} variants={fadeUp} custom={i}
                  onClick={() => setLocation(`/biens?ville=${city}`)}
                  data-testid={`city-card-${city}`}
                  className={`city-card text-left ${isLarge ? "md:col-span-2 h-[300px]" : "h-[200px]"}`}
                >
                  <img src={CITY_IMAGES[city] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80"} alt={city} />
                  <div className="city-card-overlay" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="font-serif text-white text-xl font-medium mb-0.5">{city}</p>
                    <p className="text-white/50 text-[0.65rem] tracking-[0.1em] uppercase">
                      {counts.total || "—"} {t("listings")}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lux-section bg-[var(--alt-bg)]">
        <div className="lux-container px-6">
          <motion.div {...reveal} variants={fadeUp} className="max-w-2xl mx-auto text-center">
            <span className="rule mx-auto" />
            <p className="overline-label mb-4">Propriétaires</p>
            <h2 className="serif-display text-4xl md:text-5xl mb-5 leading-tight">
              Vous avez un bien<br /><em className="italic font-normal">à vendre ou louer ?</em>
            </h2>
            <p className="text-[var(--muted-text)] text-sm leading-relaxed mb-10 max-w-md mx-auto">
              Rejoignez les centaines de propriétaires qui nous font confiance.<br />
              Publiez en quelques minutes.
            </p>
            <button onClick={() => setLocation("/publier")} data-testid="button-cta-publish" className="btn-fill px-10 py-4 text-sm">
              {t("cta_publish")} <ArrowRight size={13} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[var(--divider)] bg-[var(--card-bg)] transition-colors duration-300">
        <div className="lux-container px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="font-serif text-[1.05rem] font-medium tracking-[0.2em] uppercase text-[var(--ink-text)]">
              Movia <span className="opacity-35 font-light">Immo</span>
            </span>
            <p className="text-[0.68rem] font-medium tracking-[0.08em] uppercase text-[var(--muted-text)]">
              © 2026 Movia Immo — Le portail immobilier premium du Maroc
            </p>
            <div className="flex items-center gap-6 text-[0.68rem] font-medium tracking-[0.08em] uppercase text-[var(--muted-text)]">
              <span className="hover:text-[var(--ink-text)] cursor-pointer transition-colors">Mentions légales</span>
              <span className="hover:text-[var(--ink-text)] cursor-pointer transition-colors">Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
