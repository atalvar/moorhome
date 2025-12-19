import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    toast.success('Täname tellimuse eest! Võtame teiega peagi ühendust.');
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-sage-light rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-secondary" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              Ostukorv on tühi
            </h1>
            <p className="text-muted-foreground mb-8">
              Sirvi meie poodi ja leia endale sobiv restaureeritud mööbel.
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
            Ostukorv
          </h1>
          <p className="text-muted-foreground mt-4">
            {items.length} {items.length === 1 ? 'toode' : 'toodet'} ostukorvis
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-card p-4 rounded-lg border border-border animate-fade-in"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-semibold text-foreground truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-secondary">{item.category}</p>
                    <p className="text-lg font-semibold text-foreground mt-2">
                      {item.price} €
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card p-6 rounded-lg border border-border sticky top-24">
                <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
                  Tellimuse kokkuvõte
                </h2>
                
                <div className="space-y-3 border-b border-border pb-4 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-foreground">
                        {item.price * item.quantity} €
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-lg font-semibold mb-6">
                  <span>Kokku</span>
                  <span>{totalPrice} €</span>
                </div>

                <Button onClick={handleCheckout} className="w-full" size="lg">
                  Vormista tellimus
                </Button>

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

export default Cart;
