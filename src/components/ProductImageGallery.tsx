import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
  containerClassName?: string;
  imageClassName?: string;
}

const ProductImageGallery = ({ images, alt, containerClassName, imageClassName }: ProductImageGalleryProps) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const goTo = useCallback((index: number) => {
    if (images.length === 0) return;
    setCurrentIndex((index + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
      if (e.key === 'ArrowRight') goTo(currentIndex + 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, currentIndex, goTo]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (images.length === 0) return null;

  return (
    <>
      <div
        className={`${containerClassName ?? 'aspect-square'} overflow-hidden bg-muted cursor-zoom-in relative group`}
        onClick={() => { setCurrentIndex(0); setOpen(true); }}
        style={{ height: '16rem', minHeight: '16rem' }}
      >
        <img
          src={images[0]}
          alt={alt}
          loading="lazy"
          className={imageClassName ?? 'block h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500'}
          style={{ height: '100%', width: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/55 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="inline-flex items-center justify-center rounded-full bg-black/45 text-white w-8 h-8 backdrop-blur-sm border border-white/20">
            <Maximize2 className="h-3.5 w-3.5" />
          </div>
        </div>
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/20">
            1/{images.length}
          </div>
        )}
      </div>

      {open && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in p-4 md:p-8"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

          <div
            className="relative z-10 w-full max-w-6xl h-[92vh] md:h-[88vh] rounded-2xl border border-border/60 bg-background/80 shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative z-20 flex items-center justify-between p-4 border-b border-border/60 bg-background/70 backdrop-blur-sm">
              <div className="min-w-0 pr-4">
                <h2 className="font-serif text-lg md:text-2xl font-semibold text-foreground truncate">
                  {alt}
                </h2>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="w-10 h-10 rounded-full bg-card/80 hover:bg-card flex items-center justify-center transition-colors border border-border/60"
                aria-label="Close gallery"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>
            </div>

            <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 md:px-16 py-4">
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-card/80 hover:bg-card flex items-center justify-center transition-colors border border-border/60"
                    onClick={() => goTo(currentIndex - 1)}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6 text-foreground" />
                  </button>
                  <button
                    className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-card/80 hover:bg-card flex items-center justify-center transition-colors border border-border/60"
                    onClick={() => goTo(currentIndex + 1)}
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6 text-foreground" />
                  </button>
                </>
              )}

              <img
                src={images[currentIndex]}
                alt={`${alt} ${currentIndex + 1}`}
                className="relative z-10 max-w-[92vw] max-h-full object-contain select-none rounded-lg"
              />
            </div>

            {images.length > 1 && (
              <div className="relative z-20 p-2.5 md:p-3 border-t border-border/60 bg-background/70 backdrop-blur-sm">
                <div className="mx-auto max-w-3xl flex items-center gap-2 overflow-x-auto no-scrollbar rounded-xl bg-card/80 p-2 border border-border/60 backdrop-blur-sm">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-md overflow-hidden flex-shrink-0 border transition-all ${
                        i === currentIndex
                          ? 'border-primary opacity-100 scale-105'
                          : 'border-border opacity-60 hover:opacity-90'
                      }`}
                      aria-label={`Open image ${i + 1}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ProductImageGallery;
