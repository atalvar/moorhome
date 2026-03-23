import { useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { useAllProductImages, ProductImage } from '@/hooks/useProductImages';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, Package, ClipboardList, Loader2, X, RotateCcw, ShieldAlert } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import AdminImageManager, { ImageItem } from '@/components/admin/AdminImageManager';
import { PRODUCT_CATEGORIES } from '@/data/products';

interface ProductForm {
  name: string;
  category: string;
  description: string;
  price: string;
  sale_price: string;
  images: ImageItem[];
}

const emptyForm: ProductForm = { name: '', category: '', description: '', price: '', sale_price: '', images: [] };

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: isAdmin, isLoading: roleLoading } = useQuery({
    queryKey: ['admin-role', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
      return !!data;
    },
    enabled: !!user,
  });

  const { data: products = [], isLoading: productsLoading } = useProducts(true);
  const { data: allImages = [] } = useAllProductImages();

  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const { data: reservations = [], isLoading: reservationsLoading } = useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const { data: res } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });
      if (!res) return [];
      const withItems = await Promise.all(
        res.map(async (r) => {
          const { data: items } = await supabase
            .from('reservation_items')
            .select('*, product:products(*)')
            .eq('reservation_id', r.id);
          return { ...r, items: items || [] };
        })
      );
      return withItems;
    },
    enabled: !!isAdmin,
  });

  const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name, 'et'));

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">{t.admin_no_access}</h1>
          <p className="text-muted-foreground mb-6">{t.admin_no_rights}</p>
          <Button onClick={signOut} variant="outline">{t.auth_logout}</Button>
        </div>
      </div>
    );
  }

  const getProductImages = (productId: string): string => {
    const imgs = allImages.filter((img) => img.product_id === productId);
    if (imgs.length > 0) return imgs[0].image_url;
    const product = products.find((p) => p.id === productId);
    return product?.image || '/placeholder.svg';
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.images.length === 0) {
      toast.error(t.admin_add_image);
      return;
    }
    setSaving(true);

    const productData: any = {
      name: form.name,
      category: form.category,
      description: form.description,
      image: form.images[0].image_url,
      price: parseFloat(form.price),
      sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
    };

    let productId = editingId;

    if (editingId) {
      const { error } = await supabase.from('products').update(productData).eq('id', editingId);
      if (error) { toast.error(t.admin_edit_fail); setSaving(false); return; }
    } else {
      const { data, error } = await supabase.from('products').insert(productData).select().single();
      if (error || !data) { toast.error(t.admin_add_fail); setSaving(false); return; }
      productId = data.id;
    }

    if (productId) {
      await supabase.from('product_images').delete().eq('product_id', productId);
      const imageRecords = form.images.map((img, i) => ({
        product_id: productId!,
        image_url: img.image_url,
        sort_order: i,
      }));
      await supabase.from('product_images').insert(imageRecords);
    }

    toast.success(editingId ? t.admin_updated : t.admin_added);
    setSaving(false);
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['all-product-images'] });
    queryClient.invalidateQueries({ queryKey: ['product-images'] });
  };

  const handleEdit = (product: any) => {
    const productImgs = allImages
      .filter((img) => img.product_id === product.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => ({ id: img.id, image_url: img.image_url, sort_order: img.sort_order }));

    const images = productImgs.length > 0 ? productImgs : [{ image_url: product.image, sort_order: 0 }];

    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      price: String(product.price),
      sale_price: product.sale_price ? String(product.sale_price) : '',
      images,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const deleteStorageImages = async (productId: string) => {
    const { data: imgs } = await supabase.from('product_images').select('image_url').eq('product_id', productId);
    if (imgs && imgs.length > 0) {
      const paths = imgs
        .map(img => {
          const parts = img.image_url.split('/product-images/');
          return parts.length > 1 ? parts[parts.length - 1] : null;
        })
        .filter(Boolean) as string[];
      if (paths.length > 0) {
        await supabase.storage.from('product-images').remove(paths);
      }
    }
  };

  const handleDelete = async (id: string) => {
    await deleteStorageImages(id);
    await supabase.from('product_images').delete().eq('product_id', id);
    await supabase.from('reservation_items').delete().eq('product_id', id);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error(t.admin_delete_fail);
    else {
      toast.success(t.admin_deleted);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['all-product-images'] });
    }
  };

  const handleDeleteReservation = async (reservationId: string, items: any[]) => {
    await supabase.from('reservation_items').delete().eq('reservation_id', reservationId);
    await supabase.from('reservations').delete().eq('id', reservationId);
    for (const item of items) {
      if (item.product_id) {
        await deleteStorageImages(item.product_id);
        await supabase.from('product_images').delete().eq('product_id', item.product_id);
        await supabase.from('products').delete().eq('id', item.product_id);
      }
    }
    toast.success(t.admin_order_deleted);
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['reservations'] });
    queryClient.invalidateQueries({ queryKey: ['all-product-images'] });
  };

  const handleReturnToSale = async (reservationId: string, items: any[]) => {
    for (const item of items) {
      if (item.product_id) {
        await supabase.from('products').update({ is_reserved: false }).eq('id', item.product_id);
      }
    }
    await supabase.from('reservation_items').delete().eq('reservation_id', reservationId);
    await supabase.from('reservations').delete().eq('id', reservationId);
    toast.success(t.admin_back_sale_success);
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['reservations'] });
  };

  const handleReturnItemToSale = async (reservationId: string, item: any, totalItems: number) => {
    if (item.product_id) {
      await supabase.from('products').update({ is_reserved: false }).eq('id', item.product_id);
    }
    await supabase.from('reservation_items').delete().eq('id', item.id);
    if (totalItems <= 1) {
      await supabase.from('reservations').delete().eq('id', reservationId);
    }
    toast.success(`${item.product?.name || t.admin_products} ${t.admin_back_sale_success.toLowerCase()}`);
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['reservations'] });
  };

  const handleDeleteItem = async (reservationId: string, item: any, totalItems: number) => {
    await supabase.from('reservation_items').delete().eq('id', item.id);
    if (item.product_id) {
      await deleteStorageImages(item.product_id);
      await supabase.from('product_images').delete().eq('product_id', item.product_id);
      await supabase.from('products').delete().eq('id', item.product_id);
    }
    if (totalItems <= 1) {
      await supabase.from('reservations').delete().eq('id', reservationId);
    }
    toast.success(`${item.product?.name || t.admin_products} ${t.admin_deleted.toLowerCase()}`);
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['reservations'] });
    queryClient.invalidateQueries({ queryKey: ['all-product-images'] });
  };

  const CategorySelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={t.admin_category} />
      </SelectTrigger>
      <SelectContent>
        {PRODUCT_CATEGORIES.map((cat) => (
          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="products" className="gap-2">
                <Package className="h-4 w-4" /> {t.admin_products}
              </TabsTrigger>
              <TabsTrigger value="reservations" className="gap-2">
                <ClipboardList className="h-4 w-4" /> {t.admin_orders}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="products">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                {t.admin_products} ({products.length})
              </h2>
              <Button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }} className="gap-2">
                <Plus className="h-4 w-4" /> {t.admin_add}
              </Button>
            </div>

            {showForm && !editingId && (
              <form ref={formRef} onSubmit={handleSave} className="bg-card p-6 rounded-lg border border-border mb-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-serif text-lg font-semibold">{t.admin_new}</h3>
                  <Button type="button" variant="ghost" size="icon" onClick={() => { setShowForm(false); setForm(emptyForm); setEditingId(null); }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>{t.admin_name}</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label>{t.admin_category}</Label>
                    <CategorySelect value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
                  </div>
                  <div>
                    <Label>{t.admin_price}</Label>
                    <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                  </div>
                  <div>
                    <Label>{t.admin_sale_price}</Label>
                    <Input type="number" step="0.01" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} placeholder={t.admin_sale_placeholder} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>{t.admin_images}</Label>
                    <AdminImageManager
                      images={form.images}
                      onChange={(images) => setForm({ ...form, images })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>{t.admin_description}</Label>
                    <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button type="submit" disabled={saving}>
                    {saving ? t.admin_saving : t.admin_save}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => { setShowForm(false); setForm(emptyForm); setEditingId(null); }}>
                    {t.admin_cancel}
                  </Button>
                </div>
              </form>
            )}

            {productsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-3">
                {sortedProducts.map((product) => {
                  const thumbUrl = getProductImages(product.id);
                  const imgCount = allImages.filter((img) => img.product_id === product.id).length;
                  const hasSale = product.sale_price != null && product.sale_price < product.price;
                  return (
                    <div key={product.id}>
                      <div className="bg-card p-4 rounded-lg border border-border flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img src={thumbUrl} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground">{product.name}</h3>
                            {product.is_reserved && (
                              <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">{t.admin_reserved}</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {product.category} · {hasSale ? (
                              <>
                                <span className="line-through">{product.price} €</span>
                                {' '}
                                <span className="text-destructive font-medium">{product.sale_price} €</span>
                              </>
                            ) : (
                              <>{product.price} €</>
                            )}
                            {imgCount > 1 && ` · ${imgCount} ${t.admin_photos}`}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t.admin_delete_product}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t.admin_delete_confirm.replace('{name}', product.name)}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t.admin_cancel}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                  {t.admin_delete}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      {editingId === product.id && showForm && (
                        <form ref={formRef} onSubmit={handleSave} className="bg-card p-6 rounded-lg border-2 border-primary/30 mt-1 mb-2 animate-fade-in">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-serif text-lg font-semibold">{t.admin_edit}</h3>
                            <Button type="button" variant="ghost" size="icon" onClick={() => { setShowForm(false); setForm(emptyForm); setEditingId(null); }}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <Label>{t.admin_name}</Label>
                              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                            </div>
                            <div>
                              <Label>{t.admin_category}</Label>
                              <CategorySelect value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
                            </div>
                            <div>
                              <Label>{t.admin_price}</Label>
                              <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                            </div>
                            <div>
                              <Label>{t.admin_sale_price}</Label>
                              <Input type="number" step="0.01" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} placeholder={t.admin_sale_placeholder} />
                            </div>
                            <div className="sm:col-span-2">
                              <Label>{t.admin_images}</Label>
                              <AdminImageManager
                                images={form.images}
                                onChange={(images) => setForm({ ...form, images })}
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <Label>{t.admin_description}</Label>
                              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} />
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button type="submit" disabled={saving}>
                              {saving ? t.admin_saving : t.admin_save_edit}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => { setShowForm(false); setForm(emptyForm); setEditingId(null); }}>
                              {t.admin_cancel}
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reservations">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
              {t.admin_orders} ({reservations.length})
            </h2>
            {reservationsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : reservations.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">{t.admin_no_orders}</p>
            ) : (
              <div className="space-y-4">
                {reservations.map((res: any) => (
                  <div key={res.id} className="bg-card p-5 rounded-lg border border-border">
                    {(() => {
                      const itemCount = res.items?.length || 0;
                      const isSingle = itemCount === 1;
                      const resTotal = (res.items || []).reduce((sum: number, it: any) => {
                        const p = it.product;
                        if (!p) return sum;
                        return sum + (p.sale_price != null && p.sale_price < p.price ? p.sale_price : p.price);
                      }, 0);
                      return (
                        <>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div>
                              <h3 className="font-medium text-foreground">{res.customer_name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {res.customer_email} · {res.customer_phone}
                              </p>
                              {res.customer_address && (
                                <p className="text-sm text-muted-foreground">📍 {res.customer_address}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-muted-foreground block">
                                {new Date(res.created_at).toLocaleDateString('et-EE', {
                                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                              </span>
                              <span className="text-sm font-semibold text-foreground">
                                {itemCount} {isSingle ? t.order_product : t.order_products} · {t.order_total}: {resTotal} €
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {res.items?.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-3 bg-muted/50 p-2 rounded">
                                <div className="w-10 h-10 rounded overflow-hidden bg-muted">
                                  <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-sm font-medium">{item.product?.name}</span>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {item.delivery_method === 'delivery' ? t.admin_delivery : t.admin_pickup}
                                  </span>
                                </div>
                                <span className="text-sm font-medium mr-2">
                                  {item.product?.sale_price != null && item.product?.sale_price < item.product?.price
                                    ? item.product.sale_price : item.product?.price} €
                                </span>
                                {!isSingle && (
                                <div className="flex gap-1">
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8" title={t.admin_back_to_sale}>
                                        <RotateCcw className="h-3.5 w-3.5" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>"{item.product?.name}" {t.admin_back_to_sale.toLowerCase()}?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          {t.admin_return_item}
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>{t.admin_cancel}</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleReturnItemToSale(res.id, item, itemCount)}>
                                          {t.admin_back_to_sale}
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" title={t.admin_delete}>
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>{t.admin_delete} "{item.product?.name}"?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          {t.admin_delete_order_desc_single}
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>{t.admin_cancel}</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteItem(res.id, item, itemCount)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                          {t.admin_delete}
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2">
                                  <RotateCcw className="h-4 w-4" /> {isSingle ? t.admin_back_to_sale : t.admin_all_back}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{isSingle ? t.admin_return_single : t.admin_return_multi}</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {isSingle ? t.admin_return_confirm_single : t.admin_return_confirm_multi}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{t.admin_cancel}</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleReturnToSale(res.id, res.items || [])}>
                                    {t.admin_back_to_sale}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" /> {isSingle ? t.admin_delete : t.admin_delete_all}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{isSingle ? t.admin_delete_order_single : t.admin_delete_order_multi}</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {isSingle ? t.admin_delete_order_desc_single : t.admin_delete_order_desc_multi}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{t.admin_cancel}</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteReservation(res.id, res.items || [])} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    {t.admin_delete}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
