import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useListListings, type ListListingsParams, type ListListingsTransaction, type ListListingsPropertyType, type ListListingsSort } from "@workspace/api-client-react";
import { ListingCard, ListingCardSkeleton } from "@/components/listing/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { MapPin, Filter, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Search() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  // Parse params
  const initialParams: ListListingsParams = {
    city: searchParams.get("city") || undefined,
    transaction: (searchParams.get("transaction") as ListListingsTransaction) || undefined,
    propertyType: (searchParams.get("propertyType") as ListListingsPropertyType) || undefined,
    sort: (searchParams.get("sort") as ListListingsSort) || "recent",
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    minBedrooms: searchParams.get("minBedrooms") ? Number(searchParams.get("minBedrooms")) : undefined,
  };

  const [params, setParams] = useState<ListListingsParams>(initialParams);

  // Sync URL when params change
  useEffect(() => {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        urlParams.append(key, value.toString());
      }
    });
    
    // Replace URL without triggering a re-render cycle
    window.history.replaceState(null, "", `/recherche?${urlParams.toString()}`);
  }, [params]);

  const { data: page, isLoading } = useListListings(params, {
    query: {
      queryKey: ["/api/listings", params] as const
    }
  });

  const updateParam = <K extends keyof ListListingsParams>(key: K, value: ListListingsParams[K]) => {
    setParams(prev => ({ ...prev, [key]: value === "all" ? undefined : value }));
  };

  const resetFilters = () => {
    setParams({ sort: "recent" });
  };

  const propertyTypes = [
    { value: "apartment", label: "Appartement" },
    { value: "villa", label: "Villa" },
    { value: "house", label: "Maison" },
    { value: "riad", label: "Riad" },
    { value: "land", label: "Terrain" },
    { value: "commercial", label: "Commerce" },
    { value: "office", label: "Bureau" },
    { value: "studio", label: "Studio" },
  ];

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Transaction</label>
        <Select 
          value={params.transaction || "all"} 
          onValueChange={(v: any) => updateParam("transaction", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tout</SelectItem>
            <SelectItem value="sale">Acheter</SelectItem>
            <SelectItem value="rent">Louer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Type de bien</label>
        <Select 
          value={params.propertyType || "all"} 
          onValueChange={(v: any) => updateParam("propertyType", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {propertyTypes.map(t => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Ville</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-muted-foreground" size={16} />
          <Input 
            placeholder="Ex: Casablanca" 
            className="pl-9"
            value={params.city || ""}
            onChange={(e) => updateParam("city", e.target.value || undefined)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Chambres (min)</label>
        <Select 
          value={params.minBedrooms?.toString() || "0"} 
          onValueChange={(v) => updateParam("minBedrooms", v === "0" ? undefined : Number(v))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Peu importe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Peu importe</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
            <SelectItem value="5">5+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4 border-t">
        <Button variant="outline" className="w-full" onClick={resetFilters}>
          <X size={16} className="mr-2" />
          Réinitialiser les filtres
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container py-8 flex flex-col md:flex-row gap-8">
      {/* Mobile Filters */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-2xl font-serif font-bold text-primary">Recherche</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline"><Filter size={16} className="mr-2" /> Filtres</Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle className="font-serif">Filtres</SheetTitle>
            </SheetHeader>
            <div className="py-6">
              <FilterSidebar />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <aside className="hidden md:block w-64 shrink-0">
        <div className="sticky top-24">
          <h2 className="text-xl font-serif font-bold text-primary mb-6">Filtres</h2>
          <FilterSidebar />
        </div>
      </aside>

      {/* Results */}
      <main className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary hidden md:block">Résultats</h1>
            <p className="text-muted-foreground mt-1">
              {isLoading ? "Recherche en cours..." : `${page?.total || 0} biens trouvés`}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground whitespace-nowrap">Trier par:</label>
            <Select 
              value={params.sort || "recent"} 
              onValueChange={(v: any) => updateParam("sort", v)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus récents</SelectItem>
                <SelectItem value="priceAsc">Prix croissant</SelectItem>
                <SelectItem value="priceDesc">Prix décroissant</SelectItem>
                <SelectItem value="areaDesc">Plus grande surface</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={i} />)}
          </div>
        ) : page?.items && page.items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {page.items.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-xl border border-border border-dashed">
            <h3 className="text-xl font-bold text-primary mb-2">Aucun bien ne correspond</h3>
            <p className="text-muted-foreground mb-6">Élargissez vos critères de recherche pour voir plus de résultats.</p>
            <Button onClick={resetFilters}>Voir tous les biens</Button>
          </div>
        )}
      </main>
    </div>
  );
}
