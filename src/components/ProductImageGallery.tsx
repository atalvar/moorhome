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
        <DialogContent className="max-w-3xl p-0 border-none bg-transparent shadow-none overflow-hidden [&>button]:hidden">
          <div className="relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-50 w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-background transition-colors border border-border"
            >
              <X className="h-4 w-4 text-foreground" />
            </button>

            {/* Main image area */}
            <div className="relative w-full bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-border">
              {/* Product name header */}
              <div className="px-6 py-4 border-b border-border/50">
                <h3 className="font-serif text-lg font-semibold text-foreground text-center">
                  {alt}
                </h3>
              </div>

              {/* Image */}
              <div className="relative flex items-center justify-center bg-muted/30 p-4" style={{ minHeight: '300px', maxHeight: '65vh' }}>
                <img
                  src={images[currentIndex]}
                  alt={`${alt} ${currentIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  style={{ maxHeight: '60vh' }}
                />

                {images.length > 1 && (
                  <>
                    <button
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background border border-border shadow-md flex items-center justify-center transition-colors"
                      onClick={() => goTo(currentIndex - 1)}
                    >
                      <ChevronLeft className="h-5 w-5 text-foreground" />
                    </button>
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background border border-border shadow-md flex items-center justify-center transition-colors"
                      onClick={() => goTo(currentIndex + 1)}
                    >
                      <ChevronRight className="h-5 w-5 text-foreground" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails & counter */}
              {images.length > 1 && (
                <div className="px-4 py-3 border-t border-border/50 flex items-center justify-center gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        i === currentIndex
                          ? 'border-primary ring-2 ring-primary/30 scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">
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
