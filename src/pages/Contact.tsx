import { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactFieldErrors {
  name?: boolean;
  email?: boolean;
  subject?: boolean;
  message?: boolean;
}

const Contact = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors: ContactFieldErrors = {
      name: !formData.name.trim(),
      email: !formData.email.trim(),
      subject: !formData.subject.trim(),
      message: !formData.message.trim(),
    };

    if (Object.values(nextErrors).some(Boolean)) {
      setFieldErrors(nextErrors);
      toast.error(t.validation_required_fields);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    try {
      const { error } = await supabase.functions.invoke('contact-form', { body: payload });
      if (error) throw error;

      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      toast.success(t.contact_sent);
    } catch {
      toast.error(t.contact_send_error);
    } finally {
      setIsSubmitting(false);
    }
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
                        {t.contact_name} <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, name: e.target.value }));
                          if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: false }));
                        }}
                        placeholder={t.contact_your_name}
                        className={`rounded-xl ${fieldErrors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        {t.contact_email} <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, email: e.target.value }));
                          if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: false }));
                        }}
                        placeholder={t.contact_your_email}
                        className={`rounded-xl ${fieldErrors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      {t.contact_phone_opt}
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+372 ..."
                      className="rounded-xl"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      {t.contact_subject} <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, subject: e.target.value }));
                        if (fieldErrors.subject) setFieldErrors((prev) => ({ ...prev, subject: false }));
                      }}
                      placeholder={t.contact_subject_placeholder}
                      className={`rounded-xl ${fieldErrors.subject ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      {t.contact_message} <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, message: e.target.value }));
                        if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: false }));
                      }}
                      placeholder={t.contact_message_placeholder}
                      rows={5}
                      className={`rounded-xl ${fieldErrors.message ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                  </div>

                  <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto gradient-warm border-0 text-primary-foreground shadow-medium hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5">
                    {isSubmitting ? 'Saadan...' : t.contact_send}
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
