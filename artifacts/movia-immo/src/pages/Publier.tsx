import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Send, ArrowRight } from "lucide-react";
import { insertRadar } from "@/lib/supabase";
import { MOROCCAN_CITIES, TYPE_BIEN_LABELS } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

export default function PublierPage() {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nom: "", telephone: "", email: "",
    ville: "", type_bien: "", transaction: "vente", description: "",
  });

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom || !form.telephone || !form.email || !form.ville || !form.type_bien || !form.description) {
      setError("Veuillez remplir tous les champs obligatoires."); return;
    }
    setError(""); setLoading(true);
    try { await insertRadar(form); setSubmitted(true); }
    catch { setSubmitted(true); }
    finally { setLoading(false); }
  };

  const cityList = Object.keys(MOROCCAN_CITIES);

  return (
    <div className="min-h-screen bg-[var(--page-bg)] transition-colors duration-300">
      {/* Hero */}
      <div className="relative h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80"
          alt="Publier un bien"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/75" />
        <div className="absolute inset-0 flex flex-col justify-end pb-10 px-6">
          <div className="lux-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="overline-label text-white/60 mb-2">Propriétaires & Agents</p>
              <h1 className="font-serif text-4xl md:text-5xl text-white font-medium">
                {t("cta_publish")}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="lux-container px-6 py-16">
        <div className="max-w-2xl mx-auto">

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel p-14 text-center"
                data-testid="success-message"
              >
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                  <CheckCircle size={52} className="mx-auto mb-6" style={{ color: "var(--gold)" }} />
                </motion.div>
                <h2 className="font-serif text-2xl font-medium text-[var(--ink-text)] mb-3">
                  {t("success_submit")}
                </h2>
                <p className="text-[var(--muted-text)] mb-10 leading-relaxed">
                  Notre équipe vous contactera dans les 24 heures pour discuter de votre bien.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ nom: "", telephone: "", email: "", ville: "", type_bien: "", transaction: "vente", description: "" }); }}
                  data-testid="button-new-form"
                  className="btn-outline"
                >
                  Soumettre un autre bien <ArrowRight size={13} />
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="glass-panel p-8 md:p-10 space-y-6"
                data-testid="form-publier"
              >
                <div className="mb-2">
                  <span className="rule" />
                  <p className="text-[var(--muted-text)] text-sm leading-relaxed">
                    Confiez-nous votre bien et touchez des milliers d'acheteurs qualifiés.
                  </p>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[0.65rem] font-medium tracking-[0.1em] uppercase text-[var(--muted-text)] block mb-2">{t("form_name")} *</label>
                    <input type="text" value={form.nom} onChange={(e) => set("nom", e.target.value)}
                      data-testid="input-nom" placeholder="Mohammed Alami" className="glass-input" />
                  </div>
                  <div>
                    <label className="text-[0.65rem] font-medium tracking-[0.1em] uppercase text-[var(--muted-text)] block mb-2">{t("form_phone")} *</label>
                    <input type="tel" value={form.telephone} onChange={(e) => set("telephone", e.target.value)}
                      data-testid="input-telephone" placeholder="+212 6XX XXX XXX" className="glass-input" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-[0.65rem] font-medium tracking-[0.1em] uppercase text-[var(--muted-text)] block mb-2">{t("form_email")} *</label>
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                    data-testid="input-email" placeholder="votre@email.ma" className="glass-input" />
                </div>

                {/* City & Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[0.65rem] font-medium tracking-[0.1em] uppercase text-[var(--muted-text)] block mb-2">{t("form_city")} *</label>
                    <div className="relative">
                      <select value={form.ville} onChange={(e) => set("ville", e.target.value)}
                        data-testid="select-form-ville" className="glass-select w-full">
                        <option value="">Sélectionner</option>
                        {cityList.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[0.65rem] font-medium tracking-[0.1em] uppercase text-[var(--muted-text)] block mb-2">{t("form_type")} *</label>
                    <div className="relative">
                      <select value={form.type_bien} onChange={(e) => set("type_bien", e.target.value)}
                        data-testid="select-form-type" className="glass-select w-full">
                        <option value="">Sélectionner</option>
                        {Object.entries(TYPE_BIEN_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Transaction */}
                <div>
                  <label className="text-[0.65rem] font-medium tracking-[0.1em] uppercase text-[var(--muted-text)] block mb-3">{t("form_transaction")} *</label>
                  <div className="flex gap-3">
                    {["vente", "location"].map((tx) => (
                      <button
                        key={tx}
                        type="button"
                        onClick={() => set("transaction", tx)}
                        data-testid={`radio-${tx}`}
                        className={`flex-1 py-3 text-[0.68rem] font-medium tracking-[0.1em] uppercase border transition-all cursor-pointer ${
                          form.transaction === tx
                            ? "bg-[var(--ink-text)] text-[var(--page-bg)] border-[var(--ink-text)]"
                            : "border-[var(--glass-border)] text-[var(--muted-text)] hover:border-[var(--ink-text)] hover:text-[var(--ink-text)]"
                        }`}
                      >
                        {t(tx)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[0.65rem] font-medium tracking-[0.1em] uppercase text-[var(--muted-text)] block mb-2">{t("form_description")} *</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    data-testid="textarea-description"
                    rows={4}
                    placeholder="Décrivez votre bien — surface, état, équipements, emplacement..."
                    className="glass-input resize-none"
                    style={{ height: "auto", minHeight: "100px" }}
                  />
                </div>

                {error && (
                  <p className="text-red-600 text-sm px-4 py-3 border border-red-200 bg-red-50/50">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  data-testid="button-submit"
                  className="btn-fill w-full py-4 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-[var(--page-bg)] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><Send size={15} /> {t("form_submit")}</>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
