import { useLocation, useParams } from "wouter";
import { useGetListing, useGetSimilarListings, useCreateInquiry, useDeleteListing } from "@workspace/api-client-react";
import { formatMAD, cn } from "@/lib/utils";
import { ListingCard } from "@/components/listing/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Bed, Bath, Maximize, Calendar, Phone, Mail, User, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateInquiryBody } from "@workspace/api-zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import fallbackImg from "@/assets/fallback.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ListingDetail() {
  const [, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: listing, isLoading, error } = useGetListing(id, {
    query: { enabled: !!id, queryKey: ["/api/listings", id] as const }
  });

  const { data: similarListings } = useGetSimilarListings(id, {
    query: { enabled: !!id, queryKey: ["/api/listings", id, "similar"] as const }
  });

  const createInquiry = useCreateInquiry();
  const deleteListing = useDeleteListing();

  const form = useForm({
    resolver: zodResolver(CreateInquiryBody),
    defaultValues: {
      listingId: id,
      name: "",
      email: "",
      phone: "",
      message: "Bonjour, je suis intéressé par ce bien. Pouvez-vous me contacter ?",
    },
  });

  const onSubmit = (data: any) => {
    createInquiry.mutate({ data }, {
      onSuccess: () => {
        toast({
          title: "Message envoyé",
          description: "Le vendeur vous contactera prochainement.",
        });
        form.reset();
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer le message. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    });
  };

  const handleDelete = () => {
    deleteListing.mutate({ id }, {
      onSuccess: () => {
        toast({
          title: "Annonce supprimée",
          description: "L'annonce a été retirée avec succès.",
        });
        setLocation("/");
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'annonce.",
          variant: "destructive"
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container py-8 animate-pulse">
        <div className="h-8 bg-muted w-1/3 mb-4 rounded" />
        <div className="h-[500px] bg-muted rounded-xl mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="h-6 bg-muted w-1/4 rounded" />
            <div className="h-4 bg-muted w-full rounded" />
            <div className="h-4 bg-muted w-full rounded" />
          </div>
          <div className="h-[400px] bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Annonce introuvable</h2>
        <p className="text-muted-foreground">Ce bien n'existe plus ou a été retiré.</p>
      </div>
    );
  }

  const transactionLabel = listing.transaction === "sale" ? "À Vendre" : "À Louer";
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

  const images = listing.images?.length ? listing.images : [fallbackImg];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <main className="container py-8">
      {/* Header Info */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex gap-2 mb-3">
            <Badge variant="secondary" className="text-sm">{transactionLabel}</Badge>
            <Badge variant="outline" className="text-sm">{typeLabel}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">
            {listing.title}
          </h1>
          <div className="flex items-center text-muted-foreground text-lg">
            <MapPin size={18} className="mr-1.5" />
            {listing.neighborhood}, {listing.city}
            {listing.address && ` • ${listing.address}`}
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="text-3xl md:text-4xl font-bold text-secondary">
            {formatMAD(listing.price, listing.transaction)}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 size={16} className="mr-2" />
                Supprimer l'annonce
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette annonce ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. L'annonce sera définitivement retirée de la plateforme.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  {deleteListing.isPending ? "Suppression..." : "Supprimer"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-10 rounded-2xl overflow-hidden bg-muted relative group">
        <div className="aspect-[16/9] md:aspect-[21/9] relative">
          <img 
            src={images[currentImageIndex]} 
            alt={`Image ${currentImageIndex + 1} de ${listing.title}`}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = fallbackImg; }}
          />
          
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={24} />
              </button>
              
              <div className="absolute bottom-4 left-1/2 -translate-y-1/2 flex gap-2 backdrop-blur-sm bg-black/30 px-3 py-1.5 rounded-full">
                {images.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={cn("w-2 h-2 rounded-full transition-all", idx === currentImageIndex ? "bg-white scale-125" : "bg-white/50")}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Quick Specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-border">
            <div className="flex flex-col gap-1 text-center md:text-left">
              <span className="text-muted-foreground text-sm flex items-center justify-center md:justify-start gap-1.5"><Bed size={16}/> Chambres</span>
              <span className="font-bold text-xl">{listing.bedrooms}</span>
            </div>
            <div className="flex flex-col gap-1 text-center md:text-left border-l border-border md:border-none pl-4 md:pl-0">
              <span className="text-muted-foreground text-sm flex items-center justify-center md:justify-start gap-1.5"><Bath size={16}/> Salles de bain</span>
              <span className="font-bold text-xl">{listing.bathrooms}</span>
            </div>
            <div className="flex flex-col gap-1 text-center md:text-left border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-4">
              <span className="text-muted-foreground text-sm flex items-center justify-center md:justify-start gap-1.5"><Maximize size={16}/> Surface</span>
              <span className="font-bold text-xl">{listing.area} m²</span>
            </div>
            <div className="flex flex-col gap-1 text-center md:text-left border-t border-l md:border-t-0 border-border pt-4 pl-4 md:pt-0">
              <span className="text-muted-foreground text-sm flex items-center justify-center md:justify-start gap-1.5"><Calendar size={16}/> Publié le</span>
              <span className="font-bold text-lg">{format(new Date(listing.createdAt), "dd MMM yyyy", { locale: fr })}</span>
            </div>
          </div>

          {/* Video */}
          {listing.videoUrl && (() => {
            const url = listing.videoUrl;
            let embed: string | null = null;
            const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
            const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
            if (yt) embed = `https://www.youtube.com/embed/${yt[1]}`;
            else if (vimeo) embed = `https://player.vimeo.com/video/${vimeo[1]}`;
            return (
              <section>
                <h2 className="text-2xl font-serif font-bold text-primary mb-4">Vidéo du bien</h2>
                {embed ? (
                  <div className="aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe
                      src={embed}
                      title="Vidéo du bien"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary underline break-all"
                  >
                    {url}
                  </a>
                )}
              </section>
            );
          })()}

          {/* Description */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">Description</h2>
            <div className="prose prose-slate max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
              {listing.description}
            </div>
          </section>

          {/* Features */}
          {listing.features && listing.features.length > 0 && (
            <section>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">Équipements et caractéristiques</h2>
              <div className="flex flex-wrap gap-2">
                {listing.features.map((feature, i) => (
                  <Badge key={i} variant="secondary" className="bg-muted text-foreground py-1.5 px-3 font-normal">
                    {feature}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar / Contact */}
        <div>
          <div className="bg-card border border-border shadow-md rounded-2xl p-6 sticky top-24">
            <h3 className="font-serif text-xl font-bold text-primary mb-4">Contactez l'annonceur</h3>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-xl shrink-0">
                {listing.contactName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-foreground">{listing.contactName}</p>
                <p className="text-sm text-muted-foreground">{listing.agencyName || "Propriétaire"}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <a href={`tel:${listing.contactPhone}`} className="flex items-center gap-3 text-foreground hover:text-secondary transition-colors p-2 rounded-lg hover:bg-secondary/5">
                <Phone size={18} className="text-secondary" />
                <span className="font-medium">{listing.contactPhone}</span>
              </a>
              <a href={`mailto:${listing.contactEmail}`} className="flex items-center gap-3 text-foreground hover:text-secondary transition-colors p-2 rounded-lg hover:bg-secondary/5">
                <Mail size={18} className="text-secondary" />
                <span className="font-medium truncate">{listing.contactEmail}</span>
              </a>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Votre nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="email" placeholder="Votre email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="tel" placeholder="Votre téléphone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Votre message" className="resize-none" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={createInquiry.isPending}>
                  {createInquiry.isPending ? "Envoi en cours..." : "Envoyer un message"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Similar Listings */}
      {similarListings && similarListings.length > 0 && (
        <section className="mt-20 pt-10 border-t border-border">
          <h2 className="text-2xl font-serif font-bold text-primary mb-6">Biens similaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarListings.map((sim, i) => (
              <ListingCard key={sim.id} listing={sim} index={i} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

