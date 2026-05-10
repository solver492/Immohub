import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useI18n, LANGUAGES } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

const FLAG_MAP: Record<string, string> = { FR: "🇫🇷", AR: "🇲🇦", EN: "🇬🇧", ES: "🇪🇸" };

export default function Navbar() {
  const { t, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isHome = location === "/";
  const isTransparent = isHome && !scrolled;

  const navBg = isTransparent ? "navbar-transparent" : "navbar-solid";
  const textColor = isTransparent ? "text-white" : "text-[var(--nav-text)]";
  const mutedColor = isTransparent ? "text-white/55" : "text-[var(--nav-text-muted)]";

  const NAV_LINKS = [
    { href: "/", label: t("nav_home") },
    { href: "/biens", label: t("nav_catalogue") },
    { href: "/projets", label: "Projets" },
    { href: "/villes", label: "Villes" },
    { href: "/investissement", label: "Investir" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg} ${textColor}`}
      data-testid="navbar"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-[70px]">

          {/* Logo */}
          <Link href="/" data-testid="link-logo">
            <span className="font-serif text-[1.1rem] font-medium tracking-[0.2em] cursor-pointer select-none uppercase">
              Movia <span className={`font-light ${isTransparent ? "text-white/40" : "opacity-40"}`}>Immo</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}>
                <span className={`text-[0.68rem] font-medium tracking-[0.12em] uppercase transition-opacity cursor-pointer ${
                  location === href ? "opacity-100" : `${mutedColor} hover:opacity-100`
                }`}>
                  {label}
                </span>
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="hidden lg:flex items-center gap-5">
            {/* Language switcher */}
            <div className={`flex items-center gap-2 ${mutedColor}`}>
              {LANGUAGES.map((l, i) => (
                <span key={l} className="flex items-center gap-2">
                  <button
                    onClick={() => setLang(l)}
                    data-testid={`lang-${l}`}
                    className={`text-[0.64rem] font-medium tracking-[0.1em] uppercase transition-all cursor-pointer ${
                      lang === l ? `${textColor} underline underline-offset-4` : "hover:opacity-100"
                    }`}
                  >
                    {l}
                  </button>
                  {i < LANGUAGES.length - 1 && <span className="opacity-30 text-[0.55rem]">·</span>}
                </span>
              ))}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className={`flex items-center gap-1.5 text-[0.64rem] font-medium tracking-[0.1em] uppercase cursor-pointer transition-opacity hover:opacity-80 ${mutedColor}`}
            >
              {theme === "light" ? <Moon size={13} /> : <Sun size={13} />}
              <span className="hidden xl:inline">{theme === "light" ? "Nuit" : "Jour"}</span>
            </button>

            {/* CTA */}
            <Link href="/publier" data-testid="link-publish">
              <span className={`text-[0.66rem] font-medium tracking-[0.1em] uppercase cursor-pointer px-4 py-2.5 border transition-all ${
                isTransparent
                  ? "border-white/50 text-white hover:bg-white hover:text-[#1a1a1a]"
                  : "border-[var(--ink-text)] text-[var(--ink-text)] hover:bg-[var(--ink-text)] hover:text-[var(--page-bg)]"
              }`}>
                {t("nav_publish")}
              </span>
            </Link>
          </div>

          {/* Mobile: theme + burger */}
          <div className="lg:hidden flex items-center gap-3">
            <button onClick={toggle} className={`${mutedColor} hover:opacity-100`}>
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              className={`${mutedColor} hover:opacity-100`}
              onClick={() => setOpen(!open)}
              data-testid="button-menu-toggle"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-[var(--nav-border)] bg-[var(--nav-solid-bg)] backdrop-blur-md px-6 py-6 flex flex-col gap-5">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              <span className="text-[0.75rem] font-medium tracking-[0.12em] uppercase text-[var(--ink-text)] cursor-pointer">
                {label}
              </span>
            </Link>
          ))}
          <div className="flex items-center gap-4 pt-2 border-t border-[var(--divider)]">
            {LANGUAGES.map((l) => (
              <button
                key={l}
                onClick={() => { setLang(l); setOpen(false); }}
                data-testid={`lang-mobile-${l}`}
                className={`text-[0.65rem] font-medium tracking-[0.1em] uppercase cursor-pointer transition-all ${
                  lang === l ? "text-[var(--ink-text)] underline underline-offset-4" : "text-[var(--muted-text)]"
                }`}
              >
                {FLAG_MAP[l]} {l}
              </button>
            ))}
          </div>
          <Link href="/publier" onClick={() => setOpen(false)}>
            <span className="btn-fill text-[0.66rem] cursor-pointer w-fit">
              {t("nav_publish")}
            </span>
          </Link>
        </div>
      )}
    </nav>
  );
}
