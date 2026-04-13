import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { collection, onSnapshot, doc, deleteDoc, updateDoc, addDoc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { CartItem, Product } from '@/types';

export function Cart() {
  const { firebaseUser } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Record<string, Product>>({});

  useEffect(() => {
    if (!firebaseUser) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'users', firebaseUser.uid, 'cart'), async (snapshot) => {
      const cartItems = snapshot.docs.map(doc => ({ ...doc.data(), cartItemID: doc.id } as unknown as CartItem));
      
      // Fetch product details for each cart item if not already fetched
      const newProducts = { ...products };
      for (const item of cartItems) {
        if (!newProducts[item.productID]) {
          const pDoc = await getDoc(doc(db, 'products', String(item.productID)));
          if (pDoc.exists()) {
            newProducts[item.productID] = { ...pDoc.data(), productID: pDoc.id } as unknown as Product;
          }
        }
      }
      
      setProducts(newProducts);
      setItems(cartItems);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${firebaseUser.uid}/cart`);
    });

    return () => unsubscribe();
  }, [firebaseUser]);

  const subtotal = items.reduce((acc, item) => {
    const product = products[item.productID];
    return acc + (product?.basePrice || 0) * item.quantity;
  }, 0);
  
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const updateQuantity = async (itemId: string, delta: number) => {
    if (!firebaseUser) return;
    const item = items.find(i => i.cartItemID === itemId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid, 'cart', String(itemId)), {
        quantity: newQuantity
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${firebaseUser.uid}/cart/${itemId}`);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!firebaseUser) return;
    try {
      await deleteDoc(doc(db, 'users', firebaseUser.uid, 'cart', String(itemId)));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${firebaseUser.uid}/cart/${itemId}`);
    }
  };

  const handleCheckout = async () => {
    if (!firebaseUser) return;
    
    try {
      // Create order
      const orderData = {
        customerID: firebaseUser.uid,
        total_amount: total,
        order_status: 'pending',
        order_date: new Date().toISOString(),
        items: items.map(item => ({
          productID: item.productID,
          productName: products[item.productID]?.name || 'Unknown Product',
          quantity: item.quantity,
          unit_price: products[item.productID]?.basePrice || 0,
          sku: item.productID.slice(-8)
        }))
      };

      await addDoc(collection(db, 'orders'), orderData);

      // Clear cart
      for (const item of items) {
        await deleteDoc(doc(db, 'users', firebaseUser.uid, 'cart', String(item.cartItemID)));
      }

      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-40 pb-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="container mx-auto px-4 pt-40 pb-20 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Please login to view your cart</h1>
          <Link to="/">
            <Button size="lg" className="rounded-full px-8">Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            {items.map((item) => {
              const product = products[item.productID];
              return (
                <div key={item.cartItemID} className="flex gap-6 p-4 rounded-2xl bg-muted/30 border border-transparent hover:border-muted transition-all">
                  <div className="h-32 w-32 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    <img 
                      src={product?.imageUrl || 'https://picsum.photos/seed/placeholder/400/400'} 
                      alt={product?.name || 'Loading...'} 
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-xl">{product?.name || 'Loading...'}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.variantID ? 'Selected Variant' : 'Standard Edition'}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(String(item.cartItemID))}
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
                          onClick={() => updateQuantity(String(item.cartItemID), -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-full h-8 w-8"
                          onClick={() => updateQuantity(String(item.cartItemID), 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xl font-bold">
                        ${((product?.basePrice || 0) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
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
                <span className="text-foreground font-medium">
                  {shipping === 0 ? 'FREE' : `$${shipping.toLocaleString()}`}
                </span>
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

            <Button 
              className="w-full h-14 rounded-full text-lg gap-2 mt-4"
              onClick={handleCheckout}
            >
              Checkout
              <ArrowRight className="h-5 w-5" />
            </Button>
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
