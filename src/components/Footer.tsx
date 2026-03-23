import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logoImg from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="gradient-warm text-primary-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src={logoImg} alt="Moor Home logo" className="w-12 h-12 rounded-full object-cover bg-white/10 p-0.5" />
              <div>
                <h3 className="font-serif text-xl font-semibold">Moor Home</h3>
                <p className="text-xs text-primary-foreground/60">Restaureerimine & Müük</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-xs">
              Anname vanale mööblile uue elu. Käsitööna restaureeritud mööbel Eesti südamest.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-5">Kiirlingid</h4>
            <nav className="space-y-3">
              {[
                { to: "/", label: "Avaleht" },
                { to: "/pood", label: "Pood" },
                { to: "/kontakt", label: "Kontakt" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg mb-5">Kontakt</h4>
            <div className="space-y-3">
              {[
                { icon: Phone, text: "+372 5123 4567" },
                { icon: Mail, text: "info@mooblimeister.ee" },
                { icon: MapPin, text: "Vana-Posti 7, Tallinn" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-primary-foreground/70">
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-8 text-center">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} Moor Home. Kõik õigused kaitstud.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;