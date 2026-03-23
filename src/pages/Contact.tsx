import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Sõnum saadetud! Võtame teiega peagi ühendust.');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with gradient */}
      <section className="gradient-hero relative overflow-hidden py-14 md:py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="text-secondary font-medium text-sm uppercase tracking-[0.2em]">Ühendus</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-3">
            Kontakt
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Võta meiega ühendust küsimuste, hinnapakkumiste või lihtsalt vestluse jaoks.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="animate-fade-in">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
                Külasta meid
              </h2>
              
              <div className="space-y-6">
                {[
                  { icon: MapPin, title: 'Aadress', lines: ['Vana-Posti 7', '10146 Tallinn, Eesti'] },
                  { icon: Phone, title: 'Telefon', lines: ['+372 5123 4567'] },
                  { icon: Mail, title: 'E-post', lines: ['info@mooblimeister.ee'] },
                  { icon: Clock, title: 'Lahtiolekuajad', lines: ['E-R: 10:00 - 18:00', 'L: 10:00 - 15:00', 'P: Suletud'] },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-card/80 transition-colors duration-300">
                    <div className="w-12 h-12 gradient-sage rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft">
                      <item.icon className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      {item.lines.map((line, j) => (
                        <p key={j} className="text-muted-foreground">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map */}
              <div className="mt-8 rounded-2xl overflow-hidden border border-border/50 shadow-medium">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2028.9909259889473!2d24.74561221604489!3d59.43722198169!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4692949c8d6a8d9b%3A0x8b9b8b9b8b9b8b9b!2sVana-Posti%207%2C%20Tallinn!5e0!3m2!1set!2see!4v1620000000000!5m2!1set!2see"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Poe asukoht"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-card/60 glass rounded-2xl border border-border/50 p-8 shadow-medium">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
                  Saada sõnum
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Nimi
                      </label>
                      <Input id="name" type="text" placeholder="Sinu nimi" required className="rounded-xl" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        E-post
                      </label>
                      <Input id="email" type="email" placeholder="sinu@email.ee" required className="rounded-xl" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Telefon (valikuline)
                    </label>
                    <Input id="phone" type="tel" placeholder="+372 ..." className="rounded-xl" />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      Teema
                    </label>
                    <Input id="subject" type="text" placeholder="Milles saame aidata?" required className="rounded-xl" />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Sõnum
                    </label>
                    <Textarea id="message" placeholder="Kirjelda oma soovi..." rows={5} required className="rounded-xl" />
                  </div>

                  <Button type="submit" size="lg" className="w-full sm:w-auto gradient-warm border-0 text-primary-foreground shadow-medium hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5">
                    Saada sõnum
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;