import { useLocation } from "wouter";
import { useListCities } from "@workspace/api-client-react";
import casaImage from "@/assets/casablanca.png";
import rabatImage from "@/assets/rabat.png";
import marrakechImage from "@/assets/marrakech.png";
import tangerImage from "@/assets/tanger.png";
import fesImage from "@/assets/fes.png";
import agadirImage from "@/assets/agadir.png";
import fallbackImage from "@/assets/fallback.png";
import { motion } from "framer-motion";

const cityImages: Record<string, string> = {
  "Casablanca": casaImage,
  "Rabat": rabatImage,
  "Marrakech": marrakechImage,
  "Tanger": tangerImage,
  "Fès": fesImage,
  "Agadir": agadirImage,
};

export default function Cities() {
  const [, setLocation] = useLocation();
  const { data: cities, isLoading } = useListCities();

  return (
    <main className="container py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Villes du Maroc</h1>
        <p className="text-lg text-muted-foreground">
          Découvrez notre sélection de biens immobiliers à travers le Royaume. Trouvez votre prochain chez-vous dans votre ville préférée.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
          ))
        ) : cities && cities.length > 0 ? (
          cities.map((city, i) => (
            <motion.div
              key={city.city}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setLocation(`/recherche?city=${city.city}`)}
              className="group cursor-pointer rounded-2xl overflow-hidden relative aspect-[4/3] shadow-md hover:shadow-xl transition-all"
            >
              <img 
                src={cityImages[city.city] || fallbackImage} 
                alt={city.city}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <h2 className="text-3xl font-serif font-bold mb-2">{city.city}</h2>
                <div className="flex gap-4 text-sm font-medium">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                    {city.listingsCount} annonces
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center py-20 text-muted-foreground">Aucune ville disponible pour le moment.</p>
        )}
      </div>
    </main>
  );
}
