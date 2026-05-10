import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Home, Search, Plus } from "lucide-react";
import { useI18n, LANGUAGES } from "@/lib/i18n";

const FLAG_MAP: Record<string, string> = { FR: "🇫🇷", AR: "🇲🇦", EN: "🇬🇧", ES: "🇪🇸" };

export default function Navbar() {
  const { t, lang, setLang } = useI18n();
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-strong shadow-lg" : "bg-transparent"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" data-testid="link-logo">
            <span className="font-serif text-xl font-bold neon-text tracking-widest cursor-pointer select-none">
              MOVIA<span className="text-white/60 font-light"> IMMO</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" data-testid="link-home">
              <span className={`text-sm font-medium transition-colors cursor-pointer ${location === "/" ? "neon-text" : "text-white/70 hover:text-white"}`}>
                {t("nav_home")}
              </span>
            </Link>
            <Link href="/biens" data-testid="link-catalogue">
              <span className={`text-sm font-medium transition-colors cursor-pointer ${location === "/biens" ? "neon-text" : "text-white/70 hover:text-white"}`}>
                {t("nav_catalogue")}
              </span>
            </Link>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 glass rounded-full px-2 py-1">
              {LANGUAGES.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  data-testid={`lang-${l}`}
                  className={`text-xs px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                    lang === l
                      ? "bg-cyan-400/20 text-cyan-400 font-semibold"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {FLAG_MAP[l]} {l}
                </button>
              ))}
            </div>

            <Link href="/publier" data-testid="link-publish">
              <span className="glow-btn text-sm font-semibold px-4 py-2 rounded-full cursor-pointer flex items-center gap-2">
                <Plus size={14} />
                {t("nav_publish")}
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setOpen(!open)}
            data-testid="button-menu-toggle"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden glass-strong border-t border-white/5 px-4 py-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setOpen(false)} data-testid="link-home-mobile">
            <span className="flex items-center gap-2 text-white/80 hover:text-white cursor-pointer">
              <Home size={16} /> {t("nav_home")}
            </span>
          </Link>
          <Link href="/biens" onClick={() => setOpen(false)} data-testid="link-catalogue-mobile">
            <span className="flex items-center gap-2 text-white/80 hover:text-white cursor-pointer">
              <Search size={16} /> {t("nav_catalogue")}
            </span>
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            {LANGUAGES.map((l) => (
              <button
                key={l}
                onClick={() => { setLang(l); setOpen(false); }}
                data-testid={`lang-mobile-${l}`}
                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                  lang === l
                    ? "border-cyan-400 text-cyan-400 bg-cyan-400/10"
                    : "border-white/20 text-white/50"
                }`}
              >
                {FLAG_MAP[l]} {l}
              </button>
            ))}
          </div>
          <Link href="/publier" onClick={() => setOpen(false)} data-testid="link-publish-mobile">
            <span className="glow-btn text-sm font-semibold px-4 py-2 rounded-full cursor-pointer flex items-center gap-2 w-fit">
              <Plus size={14} /> {t("nav_publish")}
            </span>
          </Link>
        </div>
      )}
    </nav>
  );
}
