import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Hammer, Heart, Recycle } from 'lucide-react';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

const Index = () => {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-cream-dark overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in">
              <span className="text-secondary font-medium text-sm uppercase tracking-widest">
                Käsitöö & Kirg
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 leading-tight">
                Anname vanale mööblile{' '}
                <span className="text-secondary">uue elu</span>
              </h1>
              <p className="text-muted-foreground text-lg mt-6 leading-relaxed max-w-lg">
                Restaureerime armastusega vana mööblit ning müüme ainulaadseid 
                vintage mööblieksemplare. Iga ese räägib oma lugu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link to="/pood">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    Sirvi tooteid
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/kontakt">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Võta ühendust
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop"
                  alt="Restaureeritud mööbel"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-lg shadow-lg border border-border">
                <p className="font-serif text-2xl font-bold text-foreground">15+</p>
                <p className="text-sm text-muted-foreground">aastat kogemust</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Miks valida meid?
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Oleme pühendunud kvaliteedile ja jätkusuutlikkusele
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Hammer,
                title: 'Käsitöö',
                description: 'Iga ese restaureeritakse hoolikalt käsitsi, kasutades traditsioonilisi tehnikaid.',
              },
              {
                icon: Heart,
                title: 'Kirg',
                description: 'Armastame vana mööblit ja anname endast parima, et tuua välja selle ilu.',
              },
              {
                icon: Recycle,
                title: 'Jätkusuutlikkus',
                description: 'Restaureerimine on keskkonnasõbralik viis mööbli eluea pikendamiseks.',
              },
            ].map((value, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-sage-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-cream-dark">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Valitud tooted
              </h2>
              <p className="text-muted-foreground mt-2">
                Avasta meie parimad restaureeritud mööbliesemed
              </p>
            </div>
            <Link to="/pood">
              <Button variant="outline" className="gap-2">
                Vaata kõiki
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            Kas sul on mööbel, mis vajab uut elu?
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
            Võta meiega ühendust ja arutame, kuidas saame sinu lemmikut mööblit restaureerida.
          </p>
          <Link to="/kontakt" className="inline-block mt-8">
            <Button
              variant="secondary"
              size="lg"
              className="gap-2"
            >
              Küsi hinnapakkumist
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
