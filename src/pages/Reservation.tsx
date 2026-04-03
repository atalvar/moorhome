import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReservation, DeliveryMethod, CustomerInfo } from '@/contexts/ReservationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Trash2, ShoppingBag, ArrowLeft, Truck, Store, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const Reservation = () => {
  const { reservedItems, removeFromReservation, deliveryMethod, setDeliveryMethod, confirmReservation } = useReservation();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const needsAddress = deliveryMethod === 'delivery';
  const itemCount = reservedItems.length;
  const total = reservedItems.reduce((sum, item) => sum + (item.sale_price != null && item.sale_price < item.price ? item.sale_price : item.price), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (needsAddress && !customerInfo.address?.trim()) {
      toast.error(t.order_address_required);
      return;
    }

    setIsSubmitting(true);
    const success = await confirmReservation(customerInfo);
    setIsSubmitting(false);

    if (success) {
      setCustomerInfo({ name: '', email: '', phone: '', address: '' });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setShowSuccess(true);
    } else {
      toast.error(t.order_error);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/pood');
  };

  if (reservedItems.length === 0 && !showSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-sage-light rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-secondary" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              {t.order_empty}
            </h1>
            <p className="text-muted-foreground mb-8">
              {t.order_empty_subtitle}
            </p>
            <Link to="/pood">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t.order_go_shop}
              </Button>
            </Link>
          </div>
        </div>

        <Dialog open={showSuccess} onOpenChange={(open) => { if (!open) handleSuccessClose(); }}>
          <DialogContent className="max-w-md text-center">
            <div className="flex flex-col items-center py-6">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
                {t.order_confirmed}
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: t.order_confirmed_msg }} />
              <Button onClick={handleSuccessClose} size="lg" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t.order_back_shop}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-cream-dark py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            {t.order_title}
          </h1>
          <p className="text-muted-foreground mt-4">
            {itemCount} {itemCount === 1 ? t.order_product : t.order_products} {t.order_items_in}
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                {reservedItems.map((item, index) => (
                  <div key={item.id} className={`p-4 animate-fade-in ${index > 0 ? 'border-t border-border/50' : ''}`}>
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-serif font-semibold text-foreground">{item.name}</h3>
                            <p className="text-sm text-secondary">{item.category}</p>
                            <p className="text-lg font-semibold text-foreground mt-1">
                              {item.sale_price != null && item.sale_price < item.price ? (
                                <>
                                  <span className="text-sm text-muted-foreground line-through mr-2">{item.price} €</span>
                                  <span className="text-destructive">{item.sale_price} €</span>
                                </>
                              ) : (
                                <>{item.price} €</>
                              )}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromReservation(item.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Delivery method */}
                <div className="p-4 border-t border-border/50 bg-muted/30">
                  <p className="text-sm font-medium text-foreground mb-2">{t.order_delivery}</p>
                  <RadioGroup
                    value={deliveryMethod}
                    onValueChange={(value) => setDeliveryMethod(value as DeliveryMethod)}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup-all" />
                      <Label htmlFor="pickup-all" className="flex items-center gap-1.5 text-sm cursor-pointer">
                        <Store className="h-4 w-4" /> {t.order_pickup}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery-all" />
                      <Label htmlFor="delivery-all" className="flex items-center gap-1.5 text-sm cursor-pointer">
                        <Truck className="h-4 w-4" /> {t.order_delivery_opt}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card p-6 rounded-lg border border-border sticky top-24">
                <h2 className="font-serif text-xl font-semibold text-foreground mb-4">{t.order_confirm}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t.order_name}</Label>
                    <Input id="name" value={customerInfo.name} onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })} placeholder={t.contact_your_name} required />
                  </div>
                  <div>
                    <Label htmlFor="email">{t.order_email}</Label>
                    <Input id="email" type="email" value={customerInfo.email} onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} placeholder={t.contact_your_email} required />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t.order_phone}</Label>
                    <Input id="phone" type="tel" value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} placeholder="+372 ..." required />
                  </div>
                  {needsAddress && (
                    <div>
                      <Label htmlFor="address">{t.order_address}</Label>
                      <Textarea id="address" value={customerInfo.address} onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })} placeholder={t.order_address_placeholder} rows={3} required />
                    </div>
                  )}
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">{itemCount} {itemCount === 1 ? t.order_product : t.order_products}</span>
                      <span className="text-lg font-semibold text-foreground">{total} €</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{t.order_after}</p>
                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? t.order_confirming : t.order_confirm_btn}
                    </Button>
                  </div>
                </form>
                <Link to="/pood" className="block mt-4">
                  <Button variant="outline" className="w-full gap-2">
                    <ArrowLeft className="h-4 w-4" /> {t.order_continue}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={showSuccess} onOpenChange={(open) => { if (!open) handleSuccessClose(); }}>
        <DialogContent className="max-w-md text-center">
          <div className="flex flex-col items-center py-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
              {t.order_confirmed}
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: t.order_confirmed_msg }} />
            <Button onClick={handleSuccessClose} size="lg" className="w-full gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t.order_back_shop}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reservation;
