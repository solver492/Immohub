import { Link } from "wouter";
import { Bed, Bath, Maximize2, MapPin, MessageCircle } from "lucide-react";
import { Bien, TYPE_BIEN_LABELS } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

interface BienCardProps {
  bien: Bien;
  prestige?: boolean;
}

function formatPrice(prix: number, devise: string = "MAD") {
  if (prix >= 1_000_000) return `${(prix / 1_000_000).toFixed(1)}M ${devise}`;
  if (prix >= 1_000) return `${(prix / 1_000).toFixed(0)}K ${devise}`;
  return `${prix.toLocaleString()} ${devise}`;
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80";

export default function BienCard({ bien, prestige = false }: BienCardProps) {
  const { t } = useI18n();
  const image = (bien as any).photos?.[0] || PLACEHOLDER_IMAGE;
  const whatsappMsg = encodeURIComponent(`${t("whatsapp_msg")} #${bien.id} - ${bien.titre}`);

  if (prestige) {
    return (
      <div className="prestige-card rounded-2xl overflow-hidden group" data-testid={`card-bien-${bien.id}`}>
        <div className="relative h-72 overflow-hidden">
          <img
            src={image}
            alt={bien.titre}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className="glass text-xs font-semibold text-cyan-400 px-3 py-1 rounded-full border border-cyan-400/30">
              {TYPE_BIEN_LABELS[bien.type_bien] || bien.type_bien}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              bien.transaction === "vente"
                ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/40"
                : "bg-violet-500/20 text-violet-300 border border-violet-500/40"
            }`}>
              {t(bien.transaction)}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="font-serif text-xl font-semibold text-white leading-tight line-clamp-2">
              {bien.titre}
            </p>
            <p className="text-2xl font-bold neon-text mt-1">{formatPrice(bien.prix, bien.devise)}</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1 text-white/50 text-sm mb-3">
            <MapPin size={13} className="text-cyan-400" />
            <span>{[bien.quartier, bien.ville].filter(Boolean).join(", ")}</span>
          </div>
          <div className="flex items-center gap-4 text-white/60 text-sm mb-4">
            {bien.chambres != null && (
              <span className="flex items-center gap-1"><Bed size={14} className="text-cyan-400/70" />{bien.chambres} {t("bedrooms")}</span>
            )}
            {bien.salles_bain != null && (
              <span className="flex items-center gap-1"><Bath size={14} className="text-cyan-400/70" />{bien.salles_bain} {t("bathrooms")}</span>
            )}
            {bien.surface != null && (
              <span className="flex items-center gap-1"><Maximize2 size={14} className="text-cyan-400/70" />{bien.surface} {t("sqm")}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/bien/${bien.id}`} data-testid={`link-view-${bien.id}`}>
              <span className="glow-btn text-xs font-semibold px-4 py-2 rounded-full cursor-pointer">
                {t("cta_view")}
              </span>
            </Link>
            <a
              href={`https://wa.me/212600000000?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`link-whatsapp-${bien.id}`}
              className="glass text-xs font-medium text-green-400 border border-green-400/30 px-4 py-2 rounded-full flex items-center gap-1 hover:border-green-400/60 transition-all"
            >
              <MessageCircle size={13} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden group" data-testid={`card-bien-${bien.id}`}>
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={bien.titre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute top-2 right-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            bien.transaction === "vente"
              ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/40"
              : "bg-violet-500/20 text-violet-300 border border-violet-500/40"
          }`}>
            {t(bien.transaction)}
          </span>
        </div>
      </div>
      <div className="p-4">
        <p className="font-semibold text-white text-sm line-clamp-1 mb-1">{bien.titre}</p>
        <div className="flex items-center gap-1 text-white/40 text-xs mb-2">
          <MapPin size={11} className="text-cyan-400" />
          <span>{[bien.quartier, bien.ville].filter(Boolean).join(", ")}</span>
        </div>
        <p className="text-lg font-bold neon-text mb-3">{formatPrice(bien.prix, bien.devise)}</p>
        <div className="flex items-center gap-3 text-white/50 text-xs mb-3">
          {bien.chambres != null && <span className="flex items-center gap-1"><Bed size={12} />{bien.chambres}</span>}
          {bien.salles_bain != null && <span className="flex items-center gap-1"><Bath size={12} />{bien.salles_bain}</span>}
          {bien.surface != null && <span className="flex items-center gap-1"><Maximize2 size={12} />{bien.surface}m²</span>}
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/bien/${bien.id}`} data-testid={`link-view-${bien.id}`}>
            <span className="text-xs font-medium text-cyan-400 border border-cyan-400/30 px-3 py-1.5 rounded-full hover:bg-cyan-400/10 transition-all cursor-pointer">
              {t("cta_view")}
            </span>
          </Link>
          <a
            href={`https://wa.me/212600000000?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`link-whatsapp-${bien.id}`}
            className="text-xs text-green-400/70 border border-green-400/20 px-3 py-1.5 rounded-full hover:border-green-400/50 transition-all flex items-center gap-1"
          >
            <MessageCircle size={11} /> WA
          </a>
        </div>
      </div>
    </div>
  );
}
