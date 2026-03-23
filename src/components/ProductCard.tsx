import { Product } from '@/contexts/ReservationContext';
import { useReservation } from '@/contexts/ReservationContext';
import { useProductImages } from '@/hooks/useProductImages';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductImageGallery from '@/components/ProductImageGallery';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Check } from 'lucide-react';
import { toast } from 'sonner';

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
    <div className="group bg-card/80 glass rounded-2xl overflow-hidden border border-border/50 hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
      <ProductImageGallery images={allImages} alt={product.name} />
      <div className="p-5">
        <span className="text-xs font-semibold text-secondary uppercase tracking-[0.15em]">
          {product.category}
        </span>
        <h3 className="font-serif text-lg font-medium mt-1.5 text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            {hasSalePrice ? (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  {product.price} €
                </span>
                <span className="text-xl font-semibold text-destructive">
                  {product.sale_price} €
                </span>
              </>
            ) : (
              <span className="text-xl font-semibold text-foreground">
                {product.price} €
              </span>
            )}
          </div>
          {isInReservation ? (
            <Button size="sm" variant="outline" disabled className="gap-2 rounded-full">
              <Check className="h-4 w-4" />
              {t.product_added}
            </Button>
          ) : (
            <Button onClick={handleReserve} size="sm" className="gap-2 rounded-full gradient-warm border-0 text-primary-foreground shadow-soft hover:shadow-medium transition-all duration-300">
              <ShoppingBag className="h-4 w-4" />
              {t.product_buy}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
