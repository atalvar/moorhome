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
      {/* Header */}
      <section className="bg-cream-dark py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Kontakt
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Võta meiega ühendust küsimuste, hinnapakkumiste või lihtsalt vestluse jaoks.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="animate-fade-in">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
                Külasta meid
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-sage-light rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Aadress</h3>
                    <p className="text-muted-foreground">Vana-Posti 7</p>
                    <p className="text-muted-foreground">10146 Tallinn, Eesti</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-sage-light rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Telefon</h3>
                    <p className="text-muted-foreground">+372 5123 4567</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-sage-light rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">E-post</h3>
                    <p className="text-muted-foreground">info@mooblimeister.ee</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-sage-light rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Lahtiolekuajad</h3>
                    <p className="text-muted-foreground">E-R: 10:00 - 18:00</p>
                    <p className="text-muted-foreground">L: 10:00 - 15:00</p>
                    <p className="text-muted-foreground">P: Suletud</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 rounded-lg overflow-hidden border border-border">
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
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
                Saada sõnum
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Nimi
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Sinu nimi"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      E-post
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="sinu@email.ee"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Telefon (valikuline)
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+372 ..."
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Teema
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Milles saame aidata?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Sõnum
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Kirjelda oma soovi..."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Saada sõnum
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
