import { Link, useLocation } from "react-router-dom";
import { Calendar, Menu, X } from "lucide-react";
import { useReservation } from "@/contexts/ReservationContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Header = () => {
  const { totalItems } = useReservation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Avaleht" },
    { path: "/pood", label: "Pood" },
    { path: "/kontakt", label: "Kontakt" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Moor Home logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" />
            <div className="hidden sm:block">
              <h1 className="font-serif text-lg md:text-xl font-semibold text-foreground">Moor Home</h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Restaureerimine & Müük</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Reservation & Mobile Menu */}
          <div className="flex items-center gap-2">
            {totalItems > 0 && (
              <Link to="/broneering">
                <Button variant="ghost" size="icon" className="relative animate-fade-in">
                  <Calendar className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
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
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
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
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
