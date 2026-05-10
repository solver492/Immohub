import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Bed, Bath, Maximize2, MapPin, MessageCircle, ArrowLeft, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { fetchBienById, fetchMediasByBienId, fetchBiens } from "@/lib/supabase";
import { Bien, Media, TYPE_BIEN_LABELS } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import BienCard from "@/components/BienCard";

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80";

function formatPrice(prix: number, devise: string = "MAD") {
  return `${prix.toLocaleString("fr-MA")} ${devise}`;
}

export default function BienDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { t } = useI18n();

  const [bien, setBien] = useState<Bien | null>(null);
  const [medias, setMedias] = useState<Media[]>([]);
  const [similar, setSimilar] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setCurrentImg(0);

    Promise.all([
      fetchBienById(id),
      fetchMediasByBienId(id),
    ]).then(async ([bienData, mediaData]) => {
      setBien(bienData);
      setMedias(mediaData);
      if (bienData) {
        const sim = await fetchBiens({ ville: bienData.ville, transaction: bienData.transaction });
        setSimilar(sim.filter((b) => b.id !== id).slice(0, 4));
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!bien) {
    return (
      <div className="min-h-screen gradient-bg pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 text-lg mb-4">Bien introuvable</p>
          <button onClick={() => setLocation("/biens")} className="glow-btn px-6 py-3 rounded-xl font-medium cursor-pointer">
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  const images = medias.length > 0
    ? medias.map((m) => m.url)
    : [(bien as any).photos?.[0] || PLACEHOLDER_IMAGE];

  const whatsappMsg = encodeURIComponent(`${t("whatsapp_msg")} #${bien.id} - ${bien.titre}`);

  return (
    <div className="min-h-screen gradient-bg pt-16">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => setLocation("/biens")}
          data-testid="button-back"
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors cursor-pointer text-sm"
        >
          <ArrowLeft size={16} /> Retour au catalogue
        </button>
      </div>

      {/* Gallery */}
      <div className="relative max-w-7xl mx-auto px-4 mb-8">
        <div className="relative h-[50vh] md:h-[65vh] rounded-2xl overflow-hidden glass-card">
          <img
            src={images[currentImg] || PLACEHOLDER_IMAGE}
            alt={bien.titre}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImg((c) => (c - 1 + images.length) % images.length)}
                data-testid="button-prev-img"
                className="absolute left-4 top-1/2 -translate-y-1/2 glass w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentImg((c) => (c + 1) % images.length)}
                data-testid="button-next-img"
                className="absolute right-4 top-1/2 -translate-y-1/2 glass w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${i === currentImg ? "bg-cyan-400 w-6" : "bg-white/40"}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-2 max-w-[200px] overflow-x-auto">
              {images.slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${i === currentImg ? "border-cyan-400" : "border-transparent opacity-60"}`}
                >
                  <img src={img} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="glass text-xs font-semibold text-cyan-400 px-3 py-1 rounded-full border border-cyan-400/30">
                  {TYPE_BIEN_LABELS[bien.type_bien] || bien.type_bien}
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  bien.transaction === "vente"
                    ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30"
                    : "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                }`}>
                  {t(bien.transaction)}
                </span>
              </div>

              <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                {bien.titre}
              </h1>

              <div className="flex items-center gap-2 text-white/50 mb-4">
                <MapPin size={16} className="text-cyan-400" />
                <span>{[bien.quartier, bien.commune, bien.ville].filter(Boolean).join(", ")}</span>
              </div>

              <p className="text-4xl font-bold neon-text mb-6">{formatPrice(bien.prix, bien.devise)}</p>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {bien.surface != null && (
                  <div className="glass-card rounded-xl p-4 text-center" data-testid="spec-surface">
                    <Maximize2 size={20} className="text-cyan-400 mx-auto mb-2" />
                    <p className="text-xl font-bold text-white">{bien.surface}</p>
                    <p className="text-white/40 text-xs">{t("sqm")}</p>
                  </div>
                )}
                {bien.chambres != null && (
                  <div className="glass-card rounded-xl p-4 text-center" data-testid="spec-chambres">
                    <Bed size={20} className="text-cyan-400 mx-auto mb-2" />
                    <p className="text-xl font-bold text-white">{bien.chambres}</p>
                    <p className="text-white/40 text-xs">{t("bedrooms")}</p>
                  </div>
                )}
                {bien.salles_bain != null && (
                  <div className="glass-card rounded-xl p-4 text-center" data-testid="spec-salles-bain">
                    <Bath size={20} className="text-cyan-400 mx-auto mb-2" />
                    <p className="text-xl font-bold text-white">{bien.salles_bain}</p>
                    <p className="text-white/40 text-xs">{t("bathrooms")}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="glass-card rounded-xl p-6 mb-6">
                <h2 className="font-serif text-xl font-semibold text-white mb-3">Description</h2>
                <p className="text-white/60 leading-relaxed">{bien.description}</p>
              </div>

              {/* Characteristics */}
              {bien.caracteristiques && bien.caracteristiques.length > 0 && (
                <div className="glass-card rounded-xl p-6">
                  <h2 className="font-serif text-xl font-semibold text-white mb-4">{t("characteristics")}</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {bien.caracteristiques.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 text-white/70 text-sm">
                        <CheckCircle size={14} className="text-cyan-400 flex-shrink-0" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Contact Sidebar */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-strong rounded-2xl p-6 sticky top-24"
            >
              <h3 className="font-serif text-lg font-semibold text-white mb-4">Contacter l'agence</h3>
              <div className="space-y-3 mb-6">
                <a
                  href={`https://wa.me/212600000000?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="button-whatsapp-main"
                  className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25 hover:border-green-400/60 transition-all font-semibold"
                >
                  <MessageCircle size={18} /> Réserver une visite WhatsApp
                </a>
              </div>
              <div className="text-center text-white/30 text-xs">
                Réf. #{bien.id?.slice(0, 8)}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Similar Properties */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-white mb-6">{t("similar")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {similar.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <BienCard bien={b} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/212600000000?text=${whatsappMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="button-whatsapp-floating"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 text-white px-5 py-3.5 rounded-full shadow-lg hover:bg-green-400 transition-all glow-pulse font-semibold text-sm"
      >
        <MessageCircle size={18} /> WhatsApp
      </a>
    </div>
  );
}
