import { Link, useLocation } from "react-router-dom";
import { Calendar, Menu, X, LogOut } from "lucide-react";
import { useReservation } from "@/contexts/ReservationContext";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Header = () => {
  const { totalItems } = useReservation();
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: t.nav_home },
    { path: "/pood", label: t.nav_shop },
    { path: "/kontakt", label: t.nav_contact },
    ...(user ? [{ path: "/admin", label: t.nav_admin }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/80 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Moor Home logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-soft transition-transform duration-300 group-hover:scale-105" />
            <div className="hidden sm:block">
              <h1 className="font-serif text-lg md:text-xl font-semibold text-foreground">Moor Home</h1>
              <p className="text-xs text-muted-foreground -mt-0.5">{t.footer_subtitle}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-300 hover:text-primary relative ${
                  isActive(link.path) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 gradient-warm rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <div className="flex rounded-full border border-border overflow-hidden">
              <button
                onClick={() => setLanguage('et')}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  language === 'et' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                ET
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  language === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                EN
              </button>
            </div>

            {user && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5 text-muted-foreground hover:text-foreground">
                  <LogOut className="h-4 w-4" /> {t.auth_logout}
                </Button>
              </div>
            )}

            {totalItems > 0 && (
              <Link to="/broneering">
                <Button variant="ghost" size="icon" className="relative animate-fade-in">
                  <Calendar className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 gradient-warm text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium shadow-soft">
                    {totalItems}
                  </span>
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-3 text-sm font-medium transition-colors ${
                  isActive(link.path) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="pt-3 border-t border-border/50 mt-2">
                <span className="block text-sm text-muted-foreground py-2">{user.email}</span>
                <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5 px-0 text-muted-foreground">
                  <LogOut className="h-4 w-4" /> {t.auth_logout}
                </Button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
