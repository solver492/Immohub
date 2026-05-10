import { useState, useEffect, useCallback } from "react";
import { useSearch } from "wouter";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
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
  const quartiers = commune && ville && MOROCCAN_CITIES[ville]?.quartiers[commune]
    ? MOROCCAN_CITIES[ville].quartiers[commune]
    : [];

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
    setBiens(data);
    setLoading(false);
  }, [search, transaction, ville, commune, quartier, typeBien, sort]);

  useEffect(() => { load(); }, [load]);

  const resetFilters = () => {
    setSearch("");
    setTransaction("all");
    setVille("");
    setCommune("");
    setQuartier("");
    setTypeBien("all");
    setSort("recent");
  };

  const hasFilters = transaction !== "all" || ville || typeBien !== "all" || search;

  return (
    <div className="min-h-screen gradient-bg pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-4xl font-bold text-white mb-2">
            {t("nav_catalogue")}
          </h1>
          <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent" />
          {biens.length > 0 && (
            <p className="text-white/40 text-sm mt-2">{biens.length} {t("listings")} trouvées</p>
          )}
        </motion.div>

        {/* Search + Filter Bar */}
        <div className="glass-strong rounded-2xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && load()}
                placeholder={t("search_placeholder")}
                data-testid="input-search-catalogue"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/50 transition-colors"
              />
            </div>

            {/* Transaction Toggle */}
            <div className="flex items-center gap-1 glass rounded-xl px-2">
              {["all", "vente", "location"].map((tx) => (
                <button
                  key={tx}
                  onClick={() => setTransaction(tx)}
                  data-testid={`filter-tx-${tx}`}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    transaction === tx
                      ? "bg-cyan-400 text-[#04060b] font-bold"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {tx === "all" ? t("all") : t(tx)}
                </button>
              ))}
            </div>

            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              data-testid="button-filters-toggle"
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                filtersOpen || hasFilters
                  ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/40"
                  : "glass text-white/60 hover:text-white border border-white/10"
              }`}
            >
              <SlidersHorizontal size={15} />
              Filtres
              {hasFilters && <span className="bg-cyan-400 text-[#04060b] text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">!</span>}
            </button>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              data-testid="select-sort"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400/50 cursor-pointer min-w-[160px]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-[#04060b]">{t(o.labelKey)}</option>
              ))}
            </select>
          </div>

          {/* Advanced Filters */}
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
            >
              {/* Ville */}
              <div>
                <label className="text-white/50 text-xs block mb-1">{t("filter_city")}</label>
                <select
                  value={ville}
                  onChange={(e) => { setVille(e.target.value); setCommune(""); setQuartier(""); }}
                  data-testid="select-ville"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/50 cursor-pointer"
                >
                  <option value="" className="bg-[#04060b]">Toutes</option>
                  {Object.keys(MOROCCAN_CITIES).map((c) => (
                    <option key={c} value={c} className="bg-[#04060b]">{c}</option>
                  ))}
                </select>
              </div>

              {/* Commune */}
              <div>
                <label className="text-white/50 text-xs block mb-1">{t("filter_commune")}</label>
                <select
                  value={commune}
                  onChange={(e) => { setCommune(e.target.value); setQuartier(""); }}
                  data-testid="select-commune"
                  disabled={!ville}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/50 cursor-pointer disabled:opacity-30"
                >
                  <option value="" className="bg-[#04060b]">Toutes</option>
                  {communes.map((c) => (
                    <option key={c} value={c} className="bg-[#04060b]">{c}</option>
                  ))}
                </select>
              </div>

              {/* Quartier */}
              <div>
                <label className="text-white/50 text-xs block mb-1">{t("filter_quartier")}</label>
                <select
                  value={quartier}
                  onChange={(e) => setQuartier(e.target.value)}
                  data-testid="select-quartier"
                  disabled={!commune}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/50 cursor-pointer disabled:opacity-30"
                >
                  <option value="" className="bg-[#04060b]">Tous</option>
                  {quartiers.map((q) => (
                    <option key={q} value={q} className="bg-[#04060b]">{q}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="text-white/50 text-xs block mb-1">{t("filter_type")}</label>
                <select
                  value={typeBien}
                  onChange={(e) => setTypeBien(e.target.value)}
                  data-testid="select-type-bien"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/50 cursor-pointer"
                >
                  <option value="all" className="bg-[#04060b]">Tous</option>
                  {Object.entries(TYPE_BIEN_LABELS).map(([k, v]) => (
                    <option key={k} value={k} className="bg-[#04060b]">{v}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 md:col-span-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  data-testid="button-reset-filters"
                  className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                >
                  <X size={13} /> Réinitialiser les filtres
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-card rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        ) : biens.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <Search size={48} className="text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">{t("no_results")}</p>
            <button
              onClick={resetFilters}
              className="mt-4 text-sm text-cyan-400 hover:underline cursor-pointer"
            >
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
                transition={{ delay: Math.min(i * 0.05, 0.5) }}
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
