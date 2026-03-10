import { useState } from 'react';
import { useProducts, useCategories } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('Kõik');
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = ['Kõik'] } = useCategories();

  const filteredProducts =
    selectedCategory === 'Kõik'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-cream-dark py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Meie Pood
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Sirvi meie hoolikalt restaureeritud mööblit. Iga ese on ainulaadne — broneeri endale sobiv!
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="transition-all"
              >
                {category}
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
                {products.length === 0
                  ? 'Kõik tooted on hetkel broneeritud.'
                  : 'Selles kategoorias tooteid hetkel pole.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
