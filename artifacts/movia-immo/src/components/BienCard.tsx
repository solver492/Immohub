import { Link } from "wouter";
import { Bed, Bath, Maximize2, MapPin } from "lucide-react";
import { Bien, TYPE_BIEN_LABELS } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

interface BienCardProps {
  bien: Bien;
  prestige?: boolean;
  large?: boolean;
}

function formatPrice(prix: number, devise: string = "MAD") {
  if (prix >= 1_000_000) return `${(prix / 1_000_000).toFixed(1)} M ${devise}`;
  if (prix >= 1_000) return `${(prix / 1_000).toFixed(0)} K ${devise}`;
  return `${prix.toLocaleString()} ${devise}`;
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80";

export default function BienCard({ bien, prestige = false, large = false }: BienCardProps) {
  const { t } = useI18n();
  const image = (bien as any).photos?.[0] || PLACEHOLDER_IMAGE;
  const imgHeight = large ? "h-[420px]" : prestige ? "h-[280px]" : "h-[220px]";

  return (
    <Link href={`/bien/${bien.id}`} data-testid={`card-bien-${bien.id}`}>
      <div className="prop-card group">
        {/* Image */}
        <div className={`prop-card-img ${imgHeight}`}>
          <img
            src={image}
            alt={bien.titre}
            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
          />
          {/* Transaction tag overlay */}
          <div className="absolute top-4 left-4">
            <span className={`tag ${bien.transaction === "vente" ? "tag-vente bg-white/90" : "tag-location bg-white/90"}`}>
              {t(bien.transaction)}
            </span>
          </div>
          {/* Type badge */}
          <div className="absolute top-4 right-4">
            <span className="tag bg-white/90 text-[#1a1a1a] border-[#1a1a1a]/20">
              {TYPE_BIEN_LABELS[bien.type_bien] || bien.type_bien}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 bg-white">
          {/* Location */}
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin size={11} className="text-[#b5aca0] flex-shrink-0" />
            <span className="text-[0.7rem] font-medium tracking-[0.06em] uppercase text-[#b5aca0]">
              {[bien.quartier, bien.ville].filter(Boolean).join(" · ")}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-[1.05rem] font-medium text-[#1a1a1a] leading-snug line-clamp-2 mb-3">
            {bien.titre}
          </h3>

          {/* Separator */}
          <div className="w-full h-px bg-[#e8e3dc] mb-3" />

          {/* Price + specs */}
          <div className="flex items-end justify-between">
            <p className="price-tag text-[1.2rem]">{formatPrice(bien.prix, bien.devise)}</p>
            <div className="flex items-center gap-3 text-[#b5aca0]">
              {bien.chambres != null && (
                <span className="flex items-center gap-1 text-[0.7rem]">
                  <Bed size={12} /> {bien.chambres}
                </span>
              )}
              {bien.salles_bain != null && (
                <span className="flex items-center gap-1 text-[0.7rem]">
                  <Bath size={12} /> {bien.salles_bain}
                </span>
              )}
              {bien.surface != null && (
                <span className="flex items-center gap-1 text-[0.7rem]">
                  <Maximize2 size={12} /> {bien.surface}m²
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
