import { useMemo, useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useLanguage, Translations } from '@/contexts/LanguageContext';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const categoryTranslationKey: Record<string, keyof Translations> = {
  'Mööbel': 'shop_cat_furniture',
  'Valgustid': 'shop_cat_lighting',
  'Varia': 'shop_cat_misc',
  'Soodus -%': 'shop_cat_sale',
};

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('Kõik');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const { data: products = [], isLoading } = useProducts();
  const { t } = useLanguage();

  const translateCategory = (cat: string) => {
    if (cat === 'Kõik') return t.shop_all;
    const key = categoryTranslationKey[cat];
    return key ? t[key] : cat;
  };

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map((product) => product.category).filter(Boolean)))
      .sort((a, b) => a.localeCompare(b, 'et'));
    return ['Kõik', ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Kõik') return products;
    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  const sortedProducts = useMemo(() => {
    const getEffectivePrice = (product: (typeof filteredProducts)[number]) =>
      product.sale_price != null && product.sale_price < product.price ? product.sale_price : product.price;

    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
        break;
      case 'price-desc':
        sorted.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'et'));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name, 'et'));
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => {
          const aDate = Date.parse((a as { created_at?: string }).created_at || '');
          const bDate = Date.parse((b as { created_at?: string }).created_at || '');
          return (Number.isNaN(bDate) ? 0 : bDate) - (Number.isNaN(aDate) ? 0 : aDate);
        });
        break;
    }

    return sorted;
  }, [filteredProducts, sortBy]);

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
          <div className="flex justify-end mb-5">
            <div className="w-full sm:w-72">
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sorteeri" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Uuemad tooted eespool</SelectItem>
                  <SelectItem value="price-asc">Hinna järgi kasvavalt</SelectItem>
                  <SelectItem value="price-desc">Hinna järgi kahanevalt</SelectItem>
                  <SelectItem value="name-asc">Tähestikuliselt A-Z</SelectItem>
                  <SelectItem value="name-desc">Tähestikuliselt Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
                {translateCategory(category)}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in h-[33rem] min-h-[33rem] max-h-[33rem]"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {!isLoading && sortedProducts.length === 0 && (
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
