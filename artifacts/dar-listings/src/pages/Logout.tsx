import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Logout() {
  return (
    <main className="container max-w-md py-16 md:py-24">
      <Card>
        <CardContent className="pt-12 pb-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
            <LogOut className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-2">À bientôt !</h1>
            <p className="text-muted-foreground">
              Vous avez été déconnecté avec succès. Merci de votre visite sur Immo-hub.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/">
              <Button className="w-full" size="lg">
                Retour à l'accueil <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/recherche">
              <Button variant="outline" className="w-full" size="lg">
                Continuer à parcourir les annonces
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
