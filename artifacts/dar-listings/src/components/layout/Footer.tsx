import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 md:py-16">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="font-serif text-2xl font-bold tracking-tight">Dar Listings</h3>
          <p className="text-primary-foreground/70 text-sm max-w-xs">
            Le marché immobilier de confiance au Maroc. Trouvez votre prochaine maison ou investissement avec nous.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Explorer</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link href="/recherche?transaction=sale" className="hover:text-white transition-colors">Acheter</Link></li>
            <li><Link href="/recherche?transaction=rent" className="hover:text-white transition-colors">Louer</Link></li>
            <li><Link href="/villes" className="hover:text-white transition-colors">Villes</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Entreprise</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link href="/a-propos" className="hover:text-white transition-colors">À propos</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Conditions d'utilisation</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Professionnels</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link href="/publier" className="hover:text-white transition-colors">Publier une annonce</Link></li>
            <li><Link href="/agents" className="hover:text-white transition-colors">Espace Pro</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
        &copy; {new Date().getFullYear()} Dar Listings. Tous droits réservés.
      </div>
    </footer>
  );
}
