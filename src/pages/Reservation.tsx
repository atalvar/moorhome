import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReservation, DeliveryMethod, CustomerInfo } from '@/contexts/ReservationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Trash2, Calendar, ArrowLeft, Truck, Store } from 'lucide-react';
import { toast } from 'sonner';

const Reservation = () => {
  const { reservedItems, removeFromReservation, updateDeliveryMethod, confirmReservation, clearReservation } = useReservation();
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const needsAddress = reservedItems.some((item) => item.deliveryMethod === 'delivery');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (needsAddress && !customerInfo.address?.trim()) {
      toast.error('Palun sisesta kohaletoimetamise aadress');
      return;
    }

    confirmReservation(customerInfo);
    toast.success('Broneering kinnitatud! Võtame teiega peagi ühendust.');
    setCustomerInfo({ name: '', email: '', phone: '', address: '' });
  };

  if (reservedItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-sage-light rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-secondary" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              Broneeringuid pole
            </h1>
            <p className="text-muted-foreground mb-8">
              Sirvi meie poodi ja broneeri endale sobiv restaureeritud mööbel.
            </p>
            <Link to="/pood">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Mine poodi
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-cream-dark py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
            Broneering
          </h1>
          <p className="text-muted-foreground mt-4">
            {reservedItems.length} {reservedItems.length === 1 ? 'ese' : 'eset'} broneeringu nimekirjas
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Reserved Items */}
            <div className="lg:col-span-2 space-y-4">
              {reservedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-card p-4 rounded-lg border border-border animate-fade-in"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-serif font-semibold text-foreground">
                            {item.name}
                          </h3>
                          <p className="text-sm text-secondary">{item.category}</p>
                          <p className="text-lg font-semibold text-foreground mt-1">
                            {item.price} €
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

                      {/* Delivery Method Selection */}
                      <div className="mt-4">
                        <p className="text-sm font-medium text-foreground mb-2">Kättetoimetamine:</p>
                        <RadioGroup
                          value={item.deliveryMethod || 'pickup'}
                          onValueChange={(value) => updateDeliveryMethod(item.id, value as DeliveryMethod)}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pickup" id={`pickup-${item.id}`} />
                            <Label htmlFor={`pickup-${item.id}`} className="flex items-center gap-1 text-sm cursor-pointer">
                              <Store className="h-4 w-4" />
                              Tulen poodi järgi
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="delivery" id={`delivery-${item.id}`} />
                            <Label htmlFor={`delivery-${item.id}`} className="flex items-center gap-1 text-sm cursor-pointer">
                              <Truck className="h-4 w-4" />
                              Kohaletoimetamine
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reservation Form */}
            <div className="lg:col-span-1">
              <div className="bg-card p-6 rounded-lg border border-border sticky top-24">
                <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
                  Kinnita broneering
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nimi *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      placeholder="Sinu nimi"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">E-post *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      placeholder="sinu@email.ee"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefon *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      placeholder="+372 ..."
                      required
                    />
                  </div>

                  {needsAddress && (
                    <div>
                      <Label htmlFor="address">Kohaletoimetamise aadress *</Label>
                      <Textarea
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        placeholder="Täisaadress koos postiindeksiga"
                        rows={3}
                        required
                      />
                    </div>
                  )}

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-4">
                      Pärast broneeringu kinnitamist võtame teiega 24h jooksul ühendust.
                    </p>
                    <Button type="submit" className="w-full" size="lg">
                      Kinnita broneering
                    </Button>
                  </div>
                </form>

                <Link to="/pood" className="block mt-4">
                  <Button variant="outline" className="w-full gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Jätka sirvimist
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reservation;
