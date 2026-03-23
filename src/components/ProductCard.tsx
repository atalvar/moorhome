import { Product } from '@/contexts/ReservationContext';
import { useReservation } from '@/contexts/ReservationContext';
import { useProductImages } from '@/hooks/useProductImages';
import ProductImageGallery from '@/components/ProductImageGallery';
import { Button } from '@/components/ui/button';
import { Calendar, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToReservation, reservedItems } = useReservation();
  const { data: extraImages = [] } = useProductImages(product.id);

  const isInReservation = reservedItems.some((item) => item.id === product.id);

  const handleReserve = () => {
    addToReservation(product);
    toast.success(`${product.name} lisatud broneeringute nimekirja`);
  };

  // Combine main image with extra images
  const allImages = extraImages.length > 0
    ? extraImages.map((img) => img.image_url)
    : [product.image];

  return (
    <div className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
      <ProductImageGallery images={allImages} alt={product.name} />
      <div className="p-4">
        <span className="text-xs font-medium text-secondary uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="font-serif text-lg font-medium mt-1 text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-semibold text-foreground">
            {product.price} €
          </span>
          {isInReservation ? (
            <Button size="sm" variant="outline" disabled className="gap-2">
              <Check className="h-4 w-4" />
              Lisatud
            </Button>
          ) : (
            <Button onClick={handleReserve} size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              Broneeri
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
