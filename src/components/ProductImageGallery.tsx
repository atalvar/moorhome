import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

const ProductImageGallery = ({ images, alt }: ProductImageGalleryProps) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goTo = (index: number) => {
    setCurrentIndex((index + images.length) % images.length);
  };

  // Close on Escape & arrow keys
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
      if (e.key === 'ArrowRight') goTo(currentIndex + 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, currentIndex]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (images.length === 0) return null;

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

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

          {/* Close button */}
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); }}
            className="absolute top-5 right-5 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-5 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                onClick={(e) => { e.stopPropagation(); goTo(currentIndex - 1); }}
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button
                className="absolute right-5 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                onClick={(e) => { e.stopPropagation(); goTo(currentIndex + 1); }}
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </>
          )}

          {/* Image */}
          <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[currentIndex]}
              alt={`${alt} ${currentIndex + 1}`}
              className="max-w-[85vw] max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-full"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    i === currentIndex
                      ? 'border-white scale-110 opacity-100'
                      : 'border-transparent opacity-40 hover:opacity-80'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProductImageGallery;
