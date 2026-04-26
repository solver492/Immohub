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
import { Building, MapPin, Ruler, Users, Info } from "lucide-react";
import { useState } from "react";

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
      features: [] as string[],
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      agencyName: "",
    },
  });

  const onSubmit = (data: any) => {
    // Process features string into array
    const featuresArray = features
      .split(",")
      .map(f => f.trim())
      .filter(f => f.length > 0);
      
    // Add placeholder image if none provided
    const payload = {
      ...data,
      features: featuresArray,
      images: data.images.length ? data.images : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"]
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
                <Users className="text-secondary" /> 4. Contact
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
