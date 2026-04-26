import { Link } from "wouter";
import { formatMAD } from "@/lib/utils";
import type { Listing } from "@workspace/api-client-react";
import { MapPin, Bed, Bath, Maximize } from "lucide-react";
import fallbackImg from "@/assets/fallback.png";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ListingCardProps {
  listing: Listing;
  index?: number;
}

export function ListingCard({ listing, index = 0 }: ListingCardProps) {
  const transactionLabel = listing.transaction === "sale" ? "Vente" : "Location";
  const propertyTypeMap: Record<string, string> = {
    apartment: "Appartement",
    house: "Maison",
    villa: "Villa",
    riad: "Riad",
    land: "Terrain",
    commercial: "Commerce",
    office: "Bureau",
    studio: "Studio",
  };
  
  const typeLabel = propertyTypeMap[listing.propertyType] || listing.propertyType;
  const imageSrc = listing.images && listing.images.length > 0 ? listing.images[0] : fallbackImg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/annonce/${listing.id}`}>
        <Card className="overflow-hidden group cursor-pointer border-none shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-card">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img 
              src={imageSrc} 
              alt={listing.title} 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
              onError={(e) => {
                e.currentTarget.src = fallbackImg;
              }}
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge variant="secondary" className="bg-white/90 text-primary hover:bg-white backdrop-blur-sm font-semibold">
                {transactionLabel}
              </Badge>
              <Badge variant="outline" className="bg-primary/80 text-white border-none backdrop-blur-sm">
                {typeLabel}
              </Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12">
              <p className="text-white font-bold text-xl drop-shadow-md">
                {formatMAD(listing.price, listing.transaction)}
              </p>
            </div>
          </div>
          
          <CardContent className="p-4 flex flex-col flex-grow">
            <h3 className="font-bold text-lg text-foreground line-clamp-1 mb-1 group-hover:text-secondary transition-colors">
              {listing.title}
            </h3>
            
            <div className="flex items-center text-muted-foreground text-sm mb-4">
              <MapPin size={14} className="mr-1 shrink-0" />
              <span className="line-clamp-1">{listing.neighborhood}, {listing.city}</span>
            </div>
            
            <div className="mt-auto pt-4 border-t flex justify-between text-sm text-muted-foreground">
              {listing.bedrooms > 0 && (
                <div className="flex items-center gap-1.5">
                  <Bed size={16} />
                  <span>{listing.bedrooms}</span>
                </div>
              )}
              {listing.bathrooms > 0 && (
                <div className="flex items-center gap-1.5">
                  <Bath size={16} />
                  <span>{listing.bathrooms}</span>
                </div>
              )}
              {listing.area > 0 && (
                <div className="flex items-center gap-1.5">
                  <Maximize size={16} />
                  <span>{listing.area} m²</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border shadow-sm h-full flex flex-col">
      <div className="aspect-[4/3] bg-muted animate-pulse" />
      <div className="p-4 flex flex-col flex-grow gap-3">
        <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        <div className="mt-auto pt-4 border-t flex justify-between">
          <div className="h-4 bg-muted rounded animate-pulse w-8" />
          <div className="h-4 bg-muted rounded animate-pulse w-8" />
          <div className="h-4 bg-muted rounded animate-pulse w-12" />
        </div>
      </div>
    </div>
  );
}
