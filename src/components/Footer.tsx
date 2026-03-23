import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <span className="font-serif text-lg font-bold">M</span>
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold">Moor Home</h3>
                <p className="text-xs text-primary-foreground/70">Restaureerimine & Müük</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Anname vanale mööblile uue elu. Käsitööna restaureeritud mööbel Eesti südamest.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-4">Kiirlingid</h4>
            <nav className="space-y-2">
              <Link
                to="/"
                className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Avaleht
              </Link>
              <Link
                to="/pood"
                className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Pood
              </Link>
              <Link
                to="/kontakt"
                className="block text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Kontakt
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg mb-4">Kontakt</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                <span>+372 5123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                <span>info@mooblimeister.ee</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4" />
                <span>Vana-Posti 7, Tallinn</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Mööbli Meister. Kõik õigused kaitstud.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
