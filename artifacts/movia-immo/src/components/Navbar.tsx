import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useI18n, LANGUAGES } from "@/lib/i18n";

const FLAG_MAP: Record<string, string> = { FR: "🇫🇷", AR: "🇲🇦", EN: "🇬🇧", ES: "🇪🇸" };

export default function Navbar() {
  const { t, lang, setLang } = useI18n();
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isHome = location === "/";
  const navClass = isHome
    ? scrolled
      ? "navbar-solid text-[#1a1a1a]"
      : "navbar-transparent text-white"
    : "navbar-solid text-[#1a1a1a]";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navClass}`}
      data-testid="navbar"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link href="/" data-testid="link-logo">
            <span className="font-serif text-[1.15rem] font-medium tracking-[0.18em] cursor-pointer select-none uppercase">
              Movia <span className="opacity-40 font-light">Immo</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/" data-testid="link-home">
              <span className={`text-[0.72rem] font-medium tracking-[0.12em] uppercase transition-opacity cursor-pointer ${location === "/" ? "opacity-100" : "opacity-60 hover:opacity-100"}`}>
                {t("nav_home")}
              </span>
            </Link>
            <Link href="/biens" data-testid="link-catalogue">
              <span className={`text-[0.72rem] font-medium tracking-[0.12em] uppercase transition-opacity cursor-pointer ${location === "/biens" ? "opacity-100" : "opacity-60 hover:opacity-100"}`}>
                {t("nav_catalogue")}
              </span>
            </Link>

            {/* Language Switcher */}
            <div className="flex items-center gap-3 opacity-60">
              {LANGUAGES.map((l, i) => (
                <span key={l} className="flex items-center gap-3">
                  <button
                    onClick={() => setLang(l)}
                    data-testid={`lang-${l}`}
                    className={`text-[0.68rem] font-medium tracking-[0.1em] uppercase transition-all cursor-pointer ${lang === l ? "opacity-100 underline underline-offset-4" : "opacity-60 hover:opacity-100"}`}
                  >
                    {l}
                  </button>
                  {i < LANGUAGES.length - 1 && <span className="opacity-30 text-[0.6rem]">·</span>}
                </span>
              ))}
            </div>

            <Link href="/publier" data-testid="link-publish">
              <span className={`btn-outline text-[0.68rem] cursor-pointer py-2.5 px-5 ${
                isHome && !scrolled ? "border-white/70 text-white hover:bg-white hover:text-[#1a1a1a]" : ""
              }`}>
                {t("nav_publish")}
              </span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden opacity-80 hover:opacity-100"
            onClick={() => setOpen(!open)}
            data-testid="button-menu-toggle"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-[#e8e3dc] bg-[#faf9f7] px-6 py-8 flex flex-col gap-6">
          <Link href="/" onClick={() => setOpen(false)} data-testid="link-home-mobile">
            <span className="text-[0.78rem] font-medium tracking-[0.12em] uppercase text-[#1a1a1a] cursor-pointer">
              {t("nav_home")}
            </span>
          </Link>
          <Link href="/biens" onClick={() => setOpen(false)} data-testid="link-catalogue-mobile">
            <span className="text-[0.78rem] font-medium tracking-[0.12em] uppercase text-[#1a1a1a] cursor-pointer">
              {t("nav_catalogue")}
            </span>
          </Link>
          <div className="flex items-center gap-4 pt-2">
            {LANGUAGES.map((l) => (
              <button
                key={l}
                onClick={() => { setLang(l); setOpen(false); }}
                data-testid={`lang-mobile-${l}`}
                className={`text-[0.68rem] font-medium tracking-[0.1em] uppercase cursor-pointer transition-all ${lang === l ? "text-[#1a1a1a] underline underline-offset-4" : "text-[#b5aca0]"}`}
              >
                {FLAG_MAP[l]} {l}
              </button>
            ))}
          </div>
          <Link href="/publier" onClick={() => setOpen(false)} data-testid="link-publish-mobile">
            <span className="btn-fill text-[0.68rem] cursor-pointer w-fit">
              {t("nav_publish")}
            </span>
          </Link>
        </div>
      )}
    </nav>
  );
}
