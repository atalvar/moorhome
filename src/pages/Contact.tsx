import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const Contact = () => {
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t.contact_sent);
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="gradient-hero relative overflow-hidden py-14 md:py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="text-secondary font-medium text-sm uppercase tracking-[0.2em]">{t.contact_label}</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-3">
            {t.contact_title}
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            {t.contact_subtitle}
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="animate-fade-in">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
                {t.contact_visit}
              </h2>
              
              <div className="space-y-6">
                {[
                  { icon: MapPin, title: t.contact_address, lines: [t.address_line1, t.address_line2] },
                  { icon: Phone, title: t.contact_phone, lines: ['+372 5123 4567'] },
                  { icon: Mail, title: t.contact_email, lines: ['info@mooblimeister.ee'] },
                  { icon: Clock, title: t.contact_hours, lines: [t.hours_mon_fri, t.hours_sat, t.hours_sun] },
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

              <div className="mt-8 rounded-2xl overflow-hidden border border-border/50 shadow-medium">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2034.5!2d24.4155!3d59.3035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4692f5c8e1234567%3A0x1234567890abcdef!2sKeskv%C3%A4ljak%2010%2C%2076607%20Keila!5e0!3m2!1set!2see!4v1620000000000!5m2!1set!2see"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t.contact_address}
                />
              </div>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-card/60 glass rounded-2xl border border-border/50 p-8 shadow-medium">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
                  {t.contact_send}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        {t.contact_name}
                      </label>
                      <Input id="name" type="text" placeholder={t.contact_your_name} required className="rounded-xl" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        {t.contact_email}
                      </label>
                      <Input id="email" type="email" placeholder={t.contact_your_email} required className="rounded-xl" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      {t.contact_phone_opt}
                    </label>
                    <Input id="phone" type="tel" placeholder="+372 ..." className="rounded-xl" />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      {t.contact_subject}
                    </label>
                    <Input id="subject" type="text" placeholder={t.contact_subject_placeholder} required className="rounded-xl" />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      {t.contact_message}
                    </label>
                    <Textarea id="message" placeholder={t.contact_message_placeholder} rows={5} required className="rounded-xl" />
                  </div>

                  <Button type="submit" size="lg" className="w-full sm:w-auto gradient-warm border-0 text-primary-foreground shadow-medium hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5">
                    {t.contact_send}
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
