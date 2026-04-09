import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { MOCK_PRODUCTS } from '@/lib/mockData';

export function Cart() {
  const [items, setItems] = useState([
    { id: 1, product: MOCK_PRODUCTS[0], quantity: 1 },
    { id: 2, product: MOCK_PRODUCTS[1], quantity: 2 },
  ]);

  const subtotal = items.reduce((acc, item) => acc + item.product.basePrice * item.quantity, 0);
  const shipping = 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const updateQuantity = (id: number, delta: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-40 pb-20 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Looks like you haven't added anything to your cart yet. Start exploring our collections.
          </p>
          <Link to="/products">
            <Button size="lg" className="rounded-full px-8">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-20">
      <h1 className="text-4xl font-bold tracking-tight mb-10">Shopping Cart</h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-12">
        {/* Items List */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-6 p-4 rounded-2xl bg-muted/30 border border-transparent hover:border-muted transition-all">
                <div className="h-32 w-32 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.name} 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-xl">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Color: Space Gray | Size: 256GB</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border rounded-full px-2 py-1 bg-background">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full h-8 w-8"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full h-8 w-8"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xl font-bold">
                      ${(item.product.basePrice * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-bold">Have a coupon?</h3>
            <div className="flex gap-2">
              <Input placeholder="Enter code" className="max-w-[200px]" />
              <Button variant="outline">Apply</Button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="flex flex-col gap-6">
          <div className="p-8 rounded-[2rem] bg-muted/50 flex flex-col gap-6">
            <h3 className="text-2xl font-bold">Order Summary</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground font-medium">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-foreground font-medium">${shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Tax</span>
                <span className="text-foreground font-medium">${tax.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">${total.toLocaleString()}</span>
              </div>
            </div>

            <Link to="/checkout">
              <Button className="w-full h-14 rounded-full text-lg gap-2 mt-4">
                Checkout
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="p-6 rounded-2xl border border-dashed flex flex-col gap-2">
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Secure Checkout</p>
            <p className="text-xs text-muted-foreground">
              Your data is protected by industry-standard encryption. We accept all major credit cards, UPI, and digital wallets.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
