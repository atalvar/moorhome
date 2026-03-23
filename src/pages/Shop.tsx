import { useState } from 'react';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('Kõik');
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = ['Kõik'] } = useCategories();
  const { t } = useLanguage();

  const filteredProducts =
    selectedCategory === 'Kõik'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <section className="gradient-hero relative overflow-hidden py-14 md:py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="text-secondary font-medium text-sm uppercase tracking-[0.2em]">{t.shop_label}</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-3">
            {t.shop_title}
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            {t.shop_subtitle}
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`transition-all duration-300 rounded-full px-5 ${
                  selectedCategory === category
                    ? 'gradient-warm border-0 text-primary-foreground shadow-soft'
                    : 'border-2 hover:border-primary'
                }`}
              >
                {category === 'Kõik' ? t.shop_all : category}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {products.length === 0 ? t.shop_empty_all : t.shop_empty_cat}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
