import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Hammer, Heart, Recycle } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/ProductCard';

const Index = () => {
  const { data: products = [] } = useProducts();
  const { t } = useLanguage();
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&h=900&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-2xl animate-fade-in">
            <span className="inline-block text-secondary font-medium text-sm uppercase tracking-[0.2em] mb-6 px-4 py-1.5 gradient-sage rounded-full">
              {t.hero_badge}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1]">
              {t.hero_title1}{' '}
              <span className="text-gradient">{t.hero_title2}</span>
            </h1>
            <p className="text-muted-foreground text-lg mt-6 leading-relaxed max-w-lg">
              {t.hero_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link to="/pood">
                <Button size="lg" className="gap-2 w-full sm:w-auto gradient-warm border-0 text-primary-foreground shadow-medium hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5">
                  {t.hero_browse}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/kontakt">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 bg-background/50">
                  {t.hero_contact}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-28 gradient-subtle relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-secondary font-medium text-sm uppercase tracking-[0.2em]">{t.values_label}</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3">
              {t.values_title}
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              {t.values_subtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Hammer, title: t.values_craft, description: t.values_craft_desc },
              { icon: Heart, title: t.values_passion, description: t.values_passion_desc },
              { icon: Recycle, title: t.values_sustain, description: t.values_sustain_desc },
            ].map((value, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-card/80 glass border border-border/50 hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 gradient-sage rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-soft">
                  <value.icon className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 md:py-28 gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 right-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
              <div>
                <span className="text-secondary font-medium text-sm uppercase tracking-[0.2em]">{t.featured_label}</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">{t.featured_title}</h2>
                <p className="text-muted-foreground mt-2">{t.featured_subtitle}</p>
              </div>
              <Link to="/pood">
                <Button variant="outline" className="gap-2 border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                  {t.featured_viewAll}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 md:py-28 gradient-warm text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight">
            {t.cta_title}
          </h2>
          <p className="mt-6 text-primary-foreground/80 max-w-2xl mx-auto text-lg leading-relaxed">
            {t.cta_subtitle}
          </p>
          <Link to="/kontakt" className="inline-block mt-10">
            <Button size="lg" className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-elevated transition-all duration-300 hover:-translate-y-0.5 text-base px-8">
              {t.cta_button}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
