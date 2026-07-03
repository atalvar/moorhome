import { memo } from 'react';
import { Product } from '@/contexts/ReservationContext';
import { useReservation } from '@/contexts/ReservationContext';
import { useProductImages } from '@/hooks/useProductImages';
import { useLanguage, Translations } from '@/contexts/LanguageContext';
import ProductImageGallery from '@/components/ProductImageGallery';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check } from 'lucide-react';
import { toast } from 'sonner';

const categoryTranslationKey: Record<string, keyof Translations> = {
  'Mööbel': 'shop_cat_furniture',
  'Valgustid': 'shop_cat_lighting',
  'Varia': 'shop_cat_misc',
  'Soodus -%': 'shop_cat_sale',
};

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToReservation, reservedItems } = useReservation();
  const { data: extraImages = [] } = useProductImages(product.id);
  const { t } = useLanguage();

  const isInReservation = reservedItems.some((item) => item.id === product.id);

  const handleReserve = () => {
    addToReservation(product);
    toast.success(`${product.name} ${t.product_added_toast}`, {
      duration: 4000,
      style: { fontSize: '16px', padding: '16px' },
    });
  };

  const allImages = extraImages.length > 0
    ? extraImages.map((img) => img.image_url)
    : [product.image];

  const hasSalePrice = product.sale_price != null && product.sale_price < product.price;

  return (
    <div
      className="group relative h-[33rem] min-h-[33rem] max-h-[33rem] flex flex-col rounded-2xl overflow-hidden border border-border/60 bg-card/90 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-slate-100/55 via-white/20 to-slate-300/25" />
      <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-white/30 blur-2xl" />
      <ProductImageGallery
        images={allImages}
        alt={product.name}
        containerClassName="relative h-64 w-full shrink-0"
        imageClassName="block h-full w-full object-cover object-center"
      />
      <div className="relative z-10 p-5 flex flex-1 flex-col">
        <span className="inline-flex w-fit rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-[11px] font-semibold text-secondary uppercase tracking-[0.14em]">
          {categoryTranslationKey[product.category] ? t[categoryTranslationKey[product.category]] : product.category}
        </span>
        <h3 className="font-serif text-xl font-medium mt-2 text-foreground group-hover:text-primary transition-colors h-14 overflow-hidden leading-tight">
          {product.name}
        </h3>
        <p
          className="text-sm text-muted-foreground/95 mt-2 leading-relaxed h-20 overflow-hidden"
          style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}
        >
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/60">
          <div className="flex items-center gap-2 bg-background/70 border border-border/60 rounded-xl px-3 py-1.5">
            {hasSalePrice ? (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  {product.price} €
                </span>
                <span className="text-xl font-semibold text-destructive leading-none">
                  {product.sale_price} €
                </span>
              </>
            ) : (
              <span className="text-xl font-semibold text-foreground leading-none">
                {product.price} €
              </span>
            )}
          </div>
          {isInReservation ? (
            <Button size="sm" variant="outline" disabled className="gap-2 rounded-full bg-background/80">
              <Check className="h-4 w-4" />
              {t.product_added}
            </Button>
          ) : (
            <Button onClick={handleReserve} size="sm" className="gap-2 rounded-full gradient-warm border-0 text-primary-foreground shadow-soft hover:shadow-medium hover:scale-[1.02] transition-all duration-300">
              <ShoppingCart className="h-4 w-4" />
              {t.product_buy}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);
