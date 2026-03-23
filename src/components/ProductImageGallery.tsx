import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

const ProductImageGallery = ({ images, alt }: ProductImageGalleryProps) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null;

  const goTo = (index: number) => {
    setCurrentIndex((index + images.length) % images.length);
  };

  return (
    <>
      <div
        className="aspect-square overflow-hidden bg-muted cursor-pointer relative group"
        onClick={() => { setCurrentIndex(0); setOpen(true); }}
      >
        <img
          src={images[0]}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-foreground/70 text-background text-xs px-2 py-1 rounded-full">
            1/{images.length}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0 border-none bg-transparent shadow-none overflow-visible [&>button]:hidden">
          <div className="relative flex items-center justify-center">
            {/* Navigation arrows - outside the card */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute -left-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background border border-border shadow-lg flex items-center justify-center transition-colors z-10"
                  onClick={() => goTo(currentIndex - 1)}
                >
                  <ChevronLeft className="h-5 w-5 text-foreground" />
                </button>
                <button
                  className="absolute -right-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background border border-border shadow-lg flex items-center justify-center transition-colors z-10"
                  onClick={() => goTo(currentIndex + 1)}
                >
                  <ChevronRight className="h-5 w-5 text-foreground" />
                </button>
              </>
            )}

            {/* Card */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-border bg-gradient-to-b from-background via-background to-muted/40">
              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 z-50 w-9 h-9 rounded-full bg-muted/80 backdrop-blur-sm flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4 text-foreground" />
              </button>

              {/* Product name header */}
              <div className="px-6 pt-5 pb-3">
                <h3 className="font-serif text-xl font-semibold text-foreground text-center tracking-tight">
                  {alt}
                </h3>
              </div>

              {/* Image */}
              <div className="relative flex items-center justify-center px-8 pb-4" style={{ minHeight: '320px' }}>
                <img
                  src={images[currentIndex]}
                  alt={`${alt} ${currentIndex + 1}`}
                  className="max-w-full object-contain rounded-xl"
                  style={{ maxHeight: '58vh' }}
                />
              </div>

              {/* Thumbnails & counter */}
              {images.length > 1 && (
                <div className="px-6 py-4 border-t border-border/40 bg-muted/20 flex items-center justify-center gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        i === currentIndex
                          ? 'border-primary ring-2 ring-primary/30 scale-105'
                          : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  <span className="text-xs text-muted-foreground ml-3">
                    {currentIndex + 1}/{images.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductImageGallery;
