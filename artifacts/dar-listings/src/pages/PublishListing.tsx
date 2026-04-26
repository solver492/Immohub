import { useLocation } from "wouter";
import { useCreateListing } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateListingBody } from "@workspace/api-zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building, MapPin, Ruler, Users, Info, ImagePlus, Video, X } from "lucide-react";
import { useRef, useState } from "react";

export default function PublishListing() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createListing = useCreateListing();
  const [features, setFeatures] = useState<string>("");

  const form = useForm({
    resolver: zodResolver(CreateListingBody),
    defaultValues: {
      title: "",
      description: "",
      transaction: "sale" as "sale" | "rent",
      propertyType: "apartment" as const,
      price: 0,
      city: "",
      neighborhood: "",
      address: "",
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      images: [] as string[],
      videoUrl: "",
      features: [] as string[],
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      agencyName: "",
    },
  });

  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onPickFiles = async (files: FileList | null) => {
    if (!files) return;
    const next: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Image trop volumineuse",
          description: `${file.name} dépasse 5 Mo et a été ignorée.`,
          variant: "destructive",
        });
        continue;
      }
      const dataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      next.push(dataUrl);
    }
    setImages((prev) => [...prev, ...next].slice(0, 12));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const onSubmit = (data: any) => {
    // Process features string into array
    const featuresArray = features
      .split(",")
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const payload = {
      ...data,
      features: featuresArray,
      images: images.length ? images : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"],
      videoUrl: data.videoUrl?.trim() ? data.videoUrl.trim() : null,
    };

    createListing.mutate({ data: payload }, {
      onSuccess: (newListing) => {
        toast({
          title: "Annonce publiée",
          description: "Votre annonce a été publiée avec succès.",
        });
        setLocation(`/annonce/${newListing.id}`);
      },
      onError: (err) => {
        toast({
          title: "Erreur",
          description: "Impossible de publier l'annonce. Vérifiez vos informations.",
          variant: "destructive"
        });
        console.error(err);
      }
    });
  };

  return (
    <main className="container max-w-4xl py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-primary mb-2">Publier une annonce</h1>
        <p className="text-muted-foreground text-lg">Touchez des milliers d'acheteurs et de locataires à travers le Maroc.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-2xl">
                <Info className="text-secondary" /> 1. Informations générales
              </CardTitle>
              <CardDescription>Les détails essentiels de votre bien</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="transaction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de transaction</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sale">À Vendre</SelectItem>
                          <SelectItem value="rent">À Louer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de bien</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="apartment">Appartement</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="house">Maison</SelectItem>
                          <SelectItem value="riad">Riad</SelectItem>
                          <SelectItem value="land">Terrain</SelectItem>
                          <SelectItem value="commercial">Commerce</SelectItem>
                          <SelectItem value="office">Bureau</SelectItem>
                          <SelectItem value="studio">Studio</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre de l'annonce</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Superbe appartement au centre de Casablanca" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Décrivez votre bien en détail..." 
                        rows={6}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (MAD)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ex: 1500000" 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-2xl">
                <MapPin className="text-secondary" /> 2. Localisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Marrakech" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quartier</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Guéliz" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse complète (Optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="N°, Rue..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-2xl">
                <Ruler className="text-secondary" /> 3. Caractéristiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surface (m²)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chambres</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salles de bain</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features-input">Équipements (séparés par des virgules)</Label>
                <Input
                  id="features-input"
                  placeholder="Ex: Piscine, Balcon, Ascenseur, Parking"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                />
                <p className="text-[0.8rem] text-muted-foreground">Optionnel</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-2xl">
                <ImagePlus className="text-secondary" /> 4. Photos & vidéo
              </CardTitle>
              <CardDescription>
                Ajoutez jusqu'à 12 photos (max 5 Mo) et un lien vidéo YouTube ou Vimeo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-2 block">Photos du bien</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover-elevate transition">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => onPickFiles(e.target.files)}
                    data-testid="input-image-upload"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-2 mx-auto text-muted-foreground hover:text-secondary transition"
                  >
                    <ImagePlus size={32} />
                    <span className="font-medium">Cliquez pour téléverser</span>
                    <span className="text-xs">PNG, JPG, WEBP — jusqu'à 12 photos</span>
                  </button>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                    {images.map((src, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                        <img src={src} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          aria-label="Supprimer la photo"
                        >
                          <X size={14} />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-secondary text-secondary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Couverture
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Video size={16} /> Lien vidéo (YouTube, Vimeo, etc.)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.youtube.com/watch?v=..."
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Optionnel — la vidéo sera intégrée dans la page de l'annonce.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-2xl">
                <Users className="text-secondary" /> 5. Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agencyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'agence (Optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="Si vous êtes un professionnel" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Pour recevoir les messages" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="06..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="w-full md:w-auto px-12" disabled={createListing.isPending}>
              {createListing.isPending ? "Publication en cours..." : "Publier l'annonce"}
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
