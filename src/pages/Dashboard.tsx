import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Plus, 
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Trash2,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { collection, onSnapshot, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { Product, Order } from '@/types';

export function Dashboard() {
  const { user, firebaseUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!firebaseUser) return;

    // Only show products created by this vendor (if vendor)
    const productsQuery = user?.role === 'VENDOR' 
      ? query(collection(db, 'products'), where('createdBy', '==', firebaseUser.uid), orderBy('createdAt', 'desc'))
      : query(collection(db, 'products'), orderBy('createdAt', 'desc'));

    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ ...doc.data(), productID: doc.id } as unknown as Product));
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    const ordersQuery = query(collection(db, 'orders'), orderBy('order_date', 'desc'));
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ords = snapshot.docs.map(doc => ({ ...doc.data(), order_id: doc.id } as unknown as unknown as Order));
      setOrders(ords);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, [firebaseUser, user]);

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-28 pb-20 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-20">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              {user?.role === 'VENDOR' ? 'Vendor Dashboard' : 'Admin Dashboard'}
            </h1>
            <p className="text-muted-foreground mt-1">Manage your products, inventory and sales.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Export Report</Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <span className="text-emerald-500 flex items-center">
                  <ArrowUpRight className="h-3 w-3" /> +20.1%
                </span>
                from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{orders.length}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <span className="text-emerald-500 flex items-center">
                  <ArrowUpRight className="h-3 w-3" /> +180.1%
                </span>
                from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <span className="text-rose-500 flex items-center">
                  <ArrowDownRight className="h-3 w-3" /> -4%
                </span>
                from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <span className="text-emerald-500 flex items-center">
                  <ArrowUpRight className="h-3 w-3" /> +201
                </span>
                since last week
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid lg:grid-cols-[1fr_400px] gap-8">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>You made {orders.length} sales recently.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.order_id} className="flex items-center">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.customerID}`} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">Order #{order.order_id.toString().slice(-6)}</p>
                          <p className="text-sm text-muted-foreground">{new Date(order.order_date).toLocaleDateString()}</p>
                        </div>
                        <div className="ml-auto font-medium">+${order.total_amount.toLocaleString()}</div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <p className="text-center text-muted-foreground py-10">No recent sales.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Alerts</CardTitle>
                  <CardDescription>Items running low on stock.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    {products.slice(0, 3).map((product) => (
                      <div key={product.productID} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-muted overflow-hidden">
                            <img src={product.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <p className="text-sm font-bold">{product.name}</p>
                            <p className="text-xs text-muted-foreground">SKU: {product.productID.toString().slice(-4)}</p>
                          </div>
                        </div>
                        <Badge variant="destructive">5 Left</Badge>
                      </div>
                    ))}
                    {products.length === 0 && (
                      <p className="text-center text-muted-foreground py-10">No products listed.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Product Catalog</CardTitle>
                    <CardDescription>Manage your product listings and variants.</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search products..." 
                      className="pl-10" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative w-full overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-muted-foreground">
                        <th className="h-12 px-4 text-left font-medium">Product</th>
                        <th className="h-12 px-4 text-left font-medium">Status</th>
                        <th className="h-12 px-4 text-left font-medium">Price</th>
                        <th className="h-12 px-4 text-left font-medium">Stock</th>
                        <th className="h-12 px-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.productID} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded bg-muted overflow-hidden">
                                <img src={product.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
                          </td>
                          <td className="p-4 font-medium">${product.basePrice.toLocaleString()}</td>
                          <td className="p-4">45</td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteProduct(String(product.productID))}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>View and manage customer orders.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-muted-foreground">
                        <th className="h-12 px-4 text-left font-medium">Order ID</th>
                        <th className="h-12 px-4 text-left font-medium">Customer</th>
                        <th className="h-12 px-4 text-left font-medium">Date</th>
                        <th className="h-12 px-4 text-left font-medium">Amount</th>
                        <th className="h-12 px-4 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.order_id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4 font-mono">#{order.order_id.toString().slice(-8)}</td>
                          <td className="p-4">{order.customerID.slice(0, 8)}...</td>
                          <td className="p-4">{new Date(order.order_date).toLocaleDateString()}</td>
                          <td className="p-4 font-medium">${order.total_amount.toLocaleString()}</td>
                          <td className="p-4">
                            <Badge variant="secondary">{order.order_status}</Badge>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-10 text-center text-muted-foreground">No orders found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
