import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { LogOut, Plus, Trash2, Edit2, Package, ClipboardList, Loader2, X, RotateCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface ProductForm {
  name: string;
  category: string;
  description: string;
  image: string;
  price: string;
}

const emptyForm: ProductForm = { name: '', category: '', description: '', image: '', price: '' };

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const { data: products = [], isLoading: productsLoading } = useProducts(true);
  const queryClient = useQueryClient();

  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

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
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const productData = {
      name: form.name,
      category: form.category,
      description: form.description,
      image: form.image,
      price: parseFloat(form.price),
    };

    if (editingId) {
      const { error } = await supabase.from('products').update(productData).eq('id', editingId);
      if (error) {
        toast.error('Muutmine ebaõnnestus');
      } else {
        toast.success('Toode uuendatud');
      }
    } else {
      const { error } = await supabase.from('products').insert(productData);
      if (error) {
        toast.error('Lisamine ebaõnnestus');
      } else {
        toast.success('Toode lisatud');
      }
    }

    setSaving(false);
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const handleEdit = (product: any) => {
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      image: product.image,
      price: String(product.price),
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast.error('Kustutamine ebaõnnestus');
    } else {
      toast.success('Toode kustutatud');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  };

  const handleUnreserve = async (productId: string) => {
    const { error } = await supabase.from('products').update({ is_reserved: false }).eq('id', productId);
    if (error) {
      toast.error('Broneeringu tühistamine ebaõnnestus');
    } else {
      toast.success('Toode taas saadaval');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <h1 className="font-serif text-xl font-bold text-foreground">Admin paneel</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
              <LogOut className="h-4 w-4" /> Logi välja
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" /> Tooted
            </TabsTrigger>
            <TabsTrigger value="reservations" className="gap-2">
              <ClipboardList className="h-4 w-4" /> Broneeringud
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Tooted ({products.length})
              </h2>
              <Button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }} className="gap-2">
                <Plus className="h-4 w-4" /> Lisa toode
              </Button>
            </div>

            {showForm && (
              <form onSubmit={handleSave} className="bg-card p-6 rounded-lg border border-border mb-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-serif text-lg font-semibold">
                    {editingId ? 'Muuda toodet' : 'Uus toode'}
                  </h3>
                  <Button type="button" variant="ghost" size="icon" onClick={() => { setShowForm(false); setForm(emptyForm); setEditingId(null); }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Nimi</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Kategooria</Label>
                    <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required placeholder="nt. Toolid, Kapid" />
                  </div>
                  <div>
                    <Label>Hind (€)</Label>
                    <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Pildi URL</Label>
                    <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required placeholder="https://..." />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Kirjeldus</Label>
                    <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Salvestamine...' : editingId ? 'Salvesta muudatused' : 'Lisa toode'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => { setShowForm(false); setForm(emptyForm); setEditingId(null); }}>
                    Tühista
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
                {products.map((product) => (
                  <div key={product.id} className="bg-card p-4 rounded-lg border border-border flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{product.name}</h3>
                        {product.is_reserved && (
                          <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">Broneeritud</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{product.category} · {product.price} €</p>
                    </div>
                    <div className="flex gap-1">
                      {product.is_reserved && (
                        <Button variant="ghost" size="icon" onClick={() => handleUnreserve(product.id)} title="Tühista broneering">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reservations">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Broneeringud ({reservations.length})
            </h2>

            {reservationsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : reservations.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">Broneeringuid pole veel.</p>
            ) : (
              <div className="space-y-4">
                {reservations.map((res: any) => (
                  <div key={res.id} className="bg-card p-5 rounded-lg border border-border">
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
                      <span className="text-xs text-muted-foreground">
                        {new Date(res.created_at).toLocaleDateString('et-EE', {
                          day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
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
                              {item.delivery_method === 'delivery' ? '🚚 Kohaletoimetamine' : '🏪 Poest järgi'}
                            </span>
                          </div>
                          <span className="text-sm font-medium">{item.product?.price} €</span>
                        </div>
                      ))}
                    </div>
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
