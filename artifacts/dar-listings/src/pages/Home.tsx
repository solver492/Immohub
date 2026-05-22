import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetFeaturedListings, useGetRecentListings, useListCities, useGetStatsOverview } from "@workspace/api-client-react";
import { ListingCard, ListingCardSkeleton } from "@/components/listing/ListingCard";
import { motion } from "framer-motion";
import { Search, MapPin, Building, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero.png";
import casaImage from "@/assets/casablanca.png";
import rabatImage from "@/assets/rabat.png";
import marrakechImage from "@/assets/marrakech.png";
import tangerImage from "@/assets/tanger.png";
import fesImage from "@/assets/fes.png";
import agadirImage from "@/assets/agadir.png";

const cityImages: Record<string, string> = {
  "Casablanca": casaImage,
  "Rabat": rabatImage,
  "Marrakech": marrakechImage,
  "Tanger": tangerImage,
  "Fès": fesImage,
  "Agadir": agadirImage,
};

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchCity, setSearchCity] = useState("");
  const [transaction, setTransaction] = useState<"sale" | "rent" | "all">("all");
  const [propertyType, setPropertyType] = useState<string>("all");

  const { data: featured, isLoading: isLoadingFeatured } = useGetFeaturedListings();
  const { data: recent, isLoading: isLoadingRecent } = useGetRecentListings({ limit: 4 });
  const { data: citiesData, isLoading: isLoadingCities } = useListCities();
  const { data: stats } = useGetStatsOverview();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity) params.append("city", searchCity);
    if (transaction !== "all") params.append("transaction", transaction);
    if (propertyType !== "all") params.append("propertyType", propertyType);
    
    setLocation(`/recherche?${params.toString()}`);
  };

  const cities = citiesData?.slice(0, 6) || [];

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Modern Moroccan interior" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="container relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-lg">
              Trouvez votre maison idéale au Maroc
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow-md">
              Des appartements modernes aux riads traditionnels. Le marché immobilier de confiance pour acheter et louer.
            </p>
            
            {/* Search Box */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-xl max-w-4xl mx-auto backdrop-blur-sm bg-white/95">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <Input 
                    placeholder="Ville ou quartier" 
                    className="pl-10 h-12 bg-muted/50 border-none"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                  />
                </div>
                <div>
                  <Select value={transaction} onValueChange={(v: "sale" | "rent" | "all") => setTransaction(v)}>
                    <SelectTrigger className="h-12 bg-muted/50 border-none">
                      <SelectValue placeholder="Transaction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tout</SelectItem>
                      <SelectItem value="sale">Acheter</SelectItem>
                      <SelectItem value="rent">Louer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="h-12 bg-muted/50 border-none">
                      <SelectValue placeholder="Type de bien" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="apartment">Appartement</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="house">Maison</SelectItem>
                      <SelectItem value="riad">Riad</SelectItem>
                      <SelectItem value="land">Terrain</SelectItem>
                      <SelectItem value="commercial">Commerce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="h-12 w-full font-bold text-lg" size="lg">
                  <Search className="mr-2" size={20} />
                  Rechercher
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      {stats && (
        <div className="bg-primary text-primary-foreground py-8">
          <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-primary-foreground/20">
            <div>
              <p className="text-3xl font-bold font-serif">{stats.totalListings}</p>
              <p className="text-sm text-primary-foreground/70 uppercase tracking-wider mt-1">Biens disponibles</p>
            </div>
            <div>
              <p className="text-3xl font-bold font-serif">{stats.forSale}</p>
              <p className="text-sm text-primary-foreground/70 uppercase tracking-wider mt-1">À vendre</p>
            </div>
            <div>
              <p className="text-3xl font-bold font-serif">{stats.forRent}</p>
              <p className="text-sm text-primary-foreground/70 uppercase tracking-wider mt-1">À louer</p>
            </div>
            <div>
              <p className="text-3xl font-bold font-serif">{stats.topCities?.length ?? 0}</p>
              <p className="text-sm text-primary-foreground/70 uppercase tracking-wider mt-1">Villes couvertes</p>
            </div>
          </div>
        </div>
      )}

      {/* Featured Listings */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold text-primary mb-2">Biens d'exception</h2>
              <p className="text-muted-foreground">Sélectionnés avec soin par nos experts</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingFeatured ? (
              Array.from({ length: 3 }).map((_, i) => <ListingCardSkeleton key={i} />)
            ) : featured?.length ? (
              featured.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} index={i} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-10">Aucun bien d'exception pour le moment.</p>
            )}
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-20 bg-muted/30 border-y border-border/50">
        <div className="container">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold text-primary mb-2">Villes populaires</h2>
              <p className="text-muted-foreground">Découvrez l'immobilier dans les principales villes marocaines</p>
            </div>
            <Button variant="outline" onClick={() => setLocation('/villes')}>Voir toutes</Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {isLoadingCities ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-muted rounded-xl animate-pulse" />
              ))
            ) : (
              cities.map((city, i) => (
                <motion.div
                  key={city.city}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => setLocation(`/recherche?city=${city.city}`)}
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
                    <img 
                      src={cityImages[city.city] || cityImages["Casablanca"]} 
                      alt={city.city} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="text-white font-bold text-xl">{city.city}</h3>
                      <p className="text-white/80 text-sm">{city.listingsCount} biens</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold text-primary mb-2">Nouveautés</h2>
              <p className="text-muted-foreground">Les dernières annonces publiées sur la plateforme</p>
            </div>
            <Button variant="ghost" className="text-secondary font-semibold" onClick={() => setLocation('/recherche?sort=recent')}>
              Parcourir tout
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingRecent ? (
              Array.from({ length: 4 }).map((_, i) => <ListingCardSkeleton key={i} />)
            ) : recent?.length ? (
              recent.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} index={i} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-10">Aucune nouveauté pour le moment.</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary text-secondary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-black/10 blur-3xl" />
        <div className="container relative z-10 text-center max-w-3xl">
          <h2 className="text-4xl font-serif font-bold mb-6">Vous êtes propriétaire ?</h2>
          <p className="text-lg text-secondary-foreground/90 mb-10">
            Publiez votre annonce sur Immo-hub et touchez des milliers d'acheteurs et de locataires potentiels à travers le Maroc.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-secondary hover:bg-white/90 font-bold px-8 py-6 text-lg" onClick={() => setLocation('/publier')}>
            Publier une annonce
          </Button>
        </div>
      </section>
    </main>
  );
}
