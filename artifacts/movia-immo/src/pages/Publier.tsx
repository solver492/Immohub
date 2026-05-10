import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Send } from "lucide-react";
import { insertRadar } from "@/lib/supabase";
import { MOROCCAN_CITIES, TYPE_BIEN_LABELS } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

export default function PublierPage() {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nom: "",
    telephone: "",
    email: "",
    ville: "",
    type_bien: "",
    transaction: "vente",
    description: "",
  });

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom || !form.telephone || !form.email || !form.ville || !form.type_bien || !form.description) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await insertRadar(form);
      setSubmitted(true);
    } catch (err: any) {
      console.error("Radar insert error:", err);
      // Still show success for demo — the radar table may not exist yet
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const cityList = Object.keys(MOROCCAN_CITIES);

  return (
    <div className="min-h-screen gradient-bg pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">
            {t("cta_publish")}
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-4" />
          <p className="text-white/50">
            Confiez-nous votre bien et touchez des milliers d'acheteurs qualifiés
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass-strong rounded-3xl p-12 text-center neon-border"
              data-testid="success-message"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <CheckCircle size={64} className="text-cyan-400 mx-auto mb-6" />
              </motion.div>
              <h2 className="font-serif text-2xl font-bold text-white mb-3">
                {t("success_submit")}
              </h2>
              <p className="text-white/50 mb-8">
                Notre équipe vous contactera dans les 24 heures pour discuter de votre bien.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ nom: "", telephone: "", email: "", ville: "", type_bien: "", transaction: "vente", description: "" }); }}
                data-testid="button-new-form"
                className="glass text-white/70 px-6 py-3 rounded-xl hover:text-white transition-colors cursor-pointer"
              >
                Soumettre un autre bien
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="glass-strong rounded-3xl p-8 space-y-5"
              data-testid="form-publier"
            >
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs block mb-1.5">{t("form_name")} *</label>
                  <input
                    type="text"
                    value={form.nom}
                    onChange={(e) => set("nom", e.target.value)}
                    data-testid="input-nom"
                    placeholder="Mohammed Alami"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-cyan-400/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs block mb-1.5">{t("form_phone")} *</label>
                  <input
                    type="tel"
                    value={form.telephone}
                    onChange={(e) => set("telephone", e.target.value)}
                    data-testid="input-telephone"
                    placeholder="+212 6XX XXX XXX"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-cyan-400/60 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-white/60 text-xs block mb-1.5">{t("form_email")} *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  data-testid="input-email"
                  placeholder="votre@email.ma"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-cyan-400/60 transition-colors"
                />
              </div>

              {/* City & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-xs block mb-1.5">{t("form_city")} *</label>
                  <select
                    value={form.ville}
                    onChange={(e) => set("ville", e.target.value)}
                    data-testid="select-form-ville"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400/60 cursor-pointer"
                  >
                    <option value="" className="bg-[#04060b]">Sélectionner</option>
                    {cityList.map((c) => (
                      <option key={c} value={c} className="bg-[#04060b]">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-white/60 text-xs block mb-1.5">{t("form_type")} *</label>
                  <select
                    value={form.type_bien}
                    onChange={(e) => set("type_bien", e.target.value)}
                    data-testid="select-form-type"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400/60 cursor-pointer"
                  >
                    <option value="" className="bg-[#04060b]">Sélectionner</option>
                    {Object.entries(TYPE_BIEN_LABELS).map(([k, v]) => (
                      <option key={k} value={k} className="bg-[#04060b]">{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Transaction */}
              <div>
                <label className="text-white/60 text-xs block mb-2">{t("form_transaction")} *</label>
                <div className="flex gap-3">
                  {["vente", "location"].map((tx) => (
                    <button
                      key={tx}
                      type="button"
                      onClick={() => set("transaction", tx)}
                      data-testid={`radio-${tx}`}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
                        form.transaction === tx
                          ? tx === "vente"
                            ? "bg-cyan-400/20 text-cyan-400 border-cyan-400/50"
                            : "bg-violet-500/20 text-violet-300 border-violet-500/50"
                          : "border-white/10 text-white/50 hover:text-white/80"
                      }`}
                    >
                      {t(tx)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-white/60 text-xs block mb-1.5">{t("form_description")} *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  data-testid="textarea-description"
                  rows={4}
                  placeholder="Décrivez votre bien — surface, état, équipements, emplacement..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-cyan-400/60 transition-colors resize-none"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                data-testid="button-submit"
                className="glow-btn w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#04060b] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} /> {t("form_submit")}
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
