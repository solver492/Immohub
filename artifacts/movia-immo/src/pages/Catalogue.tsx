import { useState, useEffect, useCallback } from "react";
import { useSearch } from "wouter";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion } from "framer-motion";
import { fetchBiens } from "@/lib/supabase";
import { Bien, MOROCCAN_CITIES, TYPE_BIEN_LABELS } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import BienCard from "@/components/BienCard";

const SORT_OPTIONS = [
  { value: "recent", labelKey: "sort_recent" },
  { value: "prix_asc", labelKey: "sort_price_asc" },
  { value: "prix_desc", labelKey: "sort_price_desc" },
  { value: "surface", labelKey: "sort_area" },
];

const DEMO_BIENS: Bien[] = [
  { id: "d1", titre: "Villa prestige Palmeraie", type_bien: "villa", transaction: "vente", prix: 8500000, devise: "MAD", ville: "Marrakech", quartier: "Palmeraie", surface: 450, chambres: 5, salles_bain: 4, statut: "disponible", proprietaire_id: "demo", description: "" },
  { id: "d2", titre: "Riad Médina rénovée", type_bien: "riad", transaction: "vente", prix: 3200000, devise: "MAD", ville: "Fès", quartier: "Médina", surface: 280, chambres: 4, salles_bain: 3, statut: "disponible", proprietaire_id: "demo", description: "" },
  { id: "d3", titre: "Appartement vue mer", type_bien: "appartement", transaction: "vente", prix: 4200000, devise: "MAD", ville: "Tanger", quartier: "Malabata", surface: 180, chambres: 3, salles_bain: 2, statut: "disponible", proprietaire_id: "demo", description: "" },
  { id: "d4", titre: "Studio meublé Gauthier", type_bien: "studio", transaction: "location", prix: 5500, devise: "MAD", ville: "Casablanca", quartier: "Gauthier", surface: 45, chambres: 1, salles_bain: 1, statut: "disponible", proprietaire_id: "demo", description: "" },
  { id: "d5", titre: "Appartement Hay Riad", type_bien: "appartement", transaction: "location", prix: 8000, devise: "MAD", ville: "Rabat", quartier: "Hay Riad", surface: 90, chambres: 2, salles_bain: 2, statut: "disponible", proprietaire_id: "demo", description: "" },
  { id: "d6", titre: "Villa Hivernage luxe", type_bien: "villa", transaction: "location", prix: 25000, devise: "MAD", ville: "Marrakech", quartier: "Hivernage", surface: 300, chambres: 4, salles_bain: 3, statut: "disponible", proprietaire_id: "demo", description: "" },
];

export default function CataloguePage() {
  const { t } = useI18n();
  const searchStr = useSearch();
  const urlParams = new URLSearchParams(searchStr);

  const [biens, setBiens] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [search, setSearch] = useState(urlParams.get("search") || "");
  const [transaction, setTransaction] = useState(urlParams.get("transaction") || "all");
  const [ville, setVille] = useState(urlParams.get("ville") || "");
  const [commune, setCommune] = useState("");
  const [quartier, setQuartier] = useState("");
  const [typeBien, setTypeBien] = useState(urlParams.get("type_bien") || "all");
  const [sort, setSort] = useState("recent");

  const communes = ville && MOROCCAN_CITIES[ville] ? MOROCCAN_CITIES[ville].communes : [];
  const quartiers = commune && ville && MOROCCAN_CITIES[ville]?.quartiers[commune] ? MOROCCAN_CITIES[ville].quartiers[commune] : [];

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchBiens({
      search: search || undefined,
      transaction: transaction !== "all" ? transaction : undefined,
      ville: ville || undefined,
      commune: commune || undefined,
      quartier: quartier || undefined,
      type_bien: typeBien !== "all" ? typeBien : undefined,
      sort,
    });
    setBiens(data.length > 0 ? data : DEMO_BIENS);
    setLoading(false);
  }, [search, transaction, ville, commune, quartier, typeBien, sort]);

  useEffect(() => { load(); }, [load]);

  const resetFilters = () => {
    setSearch(""); setTransaction("all"); setVille(""); setCommune(""); setQuartier(""); setTypeBien("all"); setSort("recent");
  };

  const hasFilters = transaction !== "all" || ville || typeBien !== "all" || search;

  return (
    <div className="min-h-screen bg-[var(--page-bg)] transition-colors duration-300 pt-24 pb-20">

      {/* Hero band */}
      <div className="bg-[var(--ink-text)] text-[var(--page-bg)] py-12 px-6 mb-10">
        <div className="lux-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-[0.68rem] font-medium tracking-[0.18em] uppercase opacity-50 mb-2">Explorer</p>
            <h1 className="font-serif text-4xl md:text-5xl font-medium">
              {t("nav_catalogue")}
            </h1>
            {!loading && (
              <p className="text-sm opacity-50 mt-2 font-light">{biens.length} propriétés trouvées</p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="lux-container px-6">
        {/* Filter glass panel */}
        <div className="glass-panel p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && load()}
                placeholder={t("search_placeholder")}
                data-testid="input-search-catalogue"
                className="glass-input pl-9"
              />
            </div>

            {/* Transaction tabs */}
            <div className="flex border border-[var(--glass-border)]">
              {["all", "vente", "location"].map((tx) => (
                <button
                  key={tx}
                  onClick={() => setTransaction(tx)}
                  data-testid={`filter-tx-${tx}`}
                  className={`px-4 py-2.5 text-[0.68rem] font-medium tracking-[0.1em] uppercase transition-all cursor-pointer ${
                    transaction === tx
                      ? "bg-[var(--ink-text)] text-[var(--page-bg)]"
                      : "text-[var(--muted-text)] hover:text-[var(--ink-text)]"
                  }`}
                >
                  {tx === "all" ? t("all") : t(tx)}
                </button>
              ))}
            </div>

            {/* Filters toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              data-testid="button-filters-toggle"
              className={`flex items-center gap-2 px-4 py-2.5 text-[0.68rem] font-medium tracking-[0.1em] uppercase border transition-all cursor-pointer ${
                filtersOpen || hasFilters
                  ? "border-[var(--gold)] text-[var(--gold)]"
                  : "border-[var(--glass-border)] text-[var(--muted-text)] hover:text-[var(--ink-text)]"
              }`}
            >
              <SlidersHorizontal size={13} />
              Filtres
              {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />}
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                data-testid="select-sort"
                className="glass-select pr-8 min-w-[160px]"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{t(o.labelKey)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Advanced filters */}
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 pt-4 border-t border-[var(--glass-border)] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                {
                  label: t("filter_city"), value: ville,
                  onChange: (v: string) => { setVille(v); setCommune(""); setQuartier(""); },
                  options: Object.keys(MOROCCAN_CITIES).map((c) => ({ value: c, label: c })),
                  testId: "select-ville", defaultLabel: "Toutes",
                },
                {
                  label: t("filter_commune"), value: commune,
                  onChange: (v: string) => { setCommune(v); setQuartier(""); },
                  options: communes.map((c) => ({ value: c, label: c })),
                  testId: "select-commune", defaultLabel: "Toutes", disabled: !ville,
                },
                {
                  label: t("filter_quartier"), value: quartier,
                  onChange: (v: string) => setQuartier(v),
                  options: quartiers.map((q) => ({ value: q, label: q })),
                  testId: "select-quartier", defaultLabel: "Tous", disabled: !commune,
                },
                {
                  label: t("filter_type"), value: typeBien,
                  onChange: (v: string) => setTypeBien(v),
                  options: Object.entries(TYPE_BIEN_LABELS).map(([k, v]) => ({ value: k, label: v })),
                  testId: "select-type-bien", defaultLabel: "Tous",
                },
              ].map(({ label, value, onChange, options, testId, defaultLabel, disabled }) => (
                <div key={testId}>
                  <label className="text-[0.64rem] font-medium tracking-[0.1em] uppercase text-[var(--muted-text)] block mb-1.5">{label}</label>
                  <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    data-testid={testId}
                    disabled={disabled}
                    className="glass-select disabled:opacity-30"
                  >
                    <option value="">{defaultLabel}</option>
                    {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              ))}
              <div className="sm:col-span-2 md:col-span-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  data-testid="button-reset-filters"
                  className="flex items-center gap-1.5 text-[0.68rem] font-medium tracking-[0.1em] uppercase text-[var(--muted-text)] hover:text-[var(--ink-text)] transition-colors cursor-pointer"
                >
                  <X size={12} /> Réinitialiser
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 bg-[var(--alt-bg)] animate-pulse" />
            ))}
          </div>
        ) : biens.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <Search size={40} className="text-[var(--muted-text)] mx-auto mb-4 opacity-30" />
            <p className="text-[var(--muted-text)] text-lg font-serif">{t("no_results")}</p>
            <button onClick={resetFilters} className="mt-6 btn-outline text-sm">
              Effacer les filtres
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {biens.map((bien, i) => (
              <motion.div
                key={bien.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.4) }}
              >
                <BienCard bien={bien} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
