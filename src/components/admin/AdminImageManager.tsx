import { useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Upload, Loader2, X, GripVertical } from 'lucide-react';

export interface ImageItem {
  id?: string;
  image_url: string;
  sort_order: number;
}

interface AdminImageManagerProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
}

const AdminImageManager = ({ images, onChange }: AdminImageManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage.from('product-images').upload(fileName, file);
    if (error) {
      toast.error('Pildi üleslaadimine ebaõnnestus');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
    const newImages = [...images, { image_url: urlData.publicUrl, sort_order: images.length }];
    onChange(newImages);
    setUploading(false);
    toast.success('Pilt üles laetud');
  };

  const addUrl = () => {
    if (!urlInput.trim()) return;
    const newImages = [...images, { image_url: urlInput.trim(), sort_order: images.length }];
    onChange(newImages);
    setUrlInput('');
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index).map((img, i) => ({ ...img, sort_order: i }));
    onChange(newImages);
  };

  const handleDragStart = (index: number) => setDragIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const newImages = [...images];
    const [moved] = newImages.splice(dragIndex, 1);
    newImages.splice(index, 0, moved);
    const reordered = newImages.map((img, i) => ({ ...img, sort_order: i }));
    onChange(reordered);
    setDragIndex(index);
  };

  const handleDragEnd = () => setDragIndex(null);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Pildi URL"
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
        />
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={addUrl} disabled={!urlInput.trim()}>
          Lisa
        </Button>
      </div>

      {images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => (
            <div
              key={i}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragEnd={handleDragEnd}
              className={`relative w-20 h-20 rounded-lg overflow-hidden bg-muted border-2 transition-all cursor-grab active:cursor-grabbing ${
                dragIndex === i ? 'border-primary opacity-50' : 'border-border'
              } ${i === 0 ? 'ring-2 ring-primary' : ''}`}
            >
              <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs hover:scale-110 transition-transform"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-0.5 left-0.5 bg-foreground/70 text-background text-[10px] px-1 rounded">
                {i === 0 ? 'Peamine' : i + 1}
              </div>
              <GripVertical className="absolute top-0.5 left-0.5 h-3 w-3 text-background/70" />
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <p className="text-sm text-muted-foreground">Lisa vähemalt üks pilt</p>
      )}
    </div>
  );
};

export default AdminImageManager;
