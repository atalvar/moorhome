import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        onClick={() => setOpen(true)}
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
        <DialogContent className="max-w-4xl p-0 border-none bg-transparent shadow-none [&>button]:hidden">
          <div className="relative flex flex-col items-center">
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-2 -right-2 z-50 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>

            {/* Product name */}
            <div className="w-full text-center mb-3">
              <h3 className="font-serif text-xl font-semibold text-card-foreground bg-card/90 backdrop-blur-sm inline-block px-6 py-2 rounded-full border border-border">
                {alt}
              </h3>
            </div>

            {/* Main image */}
            <div className="relative w-full bg-card/95 backdrop-blur-sm rounded-2xl border border-border overflow-hidden shadow-2xl">
              <img
                src={images[currentIndex]}
                alt={`${alt} ${currentIndex + 1}`}
                className="w-full max-h-[70vh] object-contain p-4"
              />

              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card border border-border shadow-md h-10 w-10 rounded-full"
                    onClick={(e) => { e.stopPropagation(); goTo(currentIndex - 1); }}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-card/80 hover:bg-card border border-border shadow-md h-10 w-10 rounded-full"
                    onClick={(e) => { e.stopPropagation(); goTo(currentIndex + 1); }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}

              {/* Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-foreground/60 text-background text-sm px-3 py-1 rounded-full">
                  {currentIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto justify-center px-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all shadow-md ${
                      i === currentIndex ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-border opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductImageGallery;
