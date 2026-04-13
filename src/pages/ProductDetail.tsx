import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, ShieldCheck, Truck, RotateCcw, ChevronRight, Minus, Plus, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProductCard } from '@/components/ecommerce/ProductCard';
import { doc, onSnapshot, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { Product, Review, ProductVariant } from '@/types';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    const unsubscribeProduct = onSnapshot(doc(db, 'products', id), (docSnap) => {
      if (docSnap.exists()) {
        setProduct({ ...docSnap.data(), productID: docSnap.id } as unknown as Product);
      } else {
        setProduct(null);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `products/${id}`);
      setLoading(false);
    });

    const variantsQuery = query(collection(db, 'products', id, 'variants'));
    const unsubscribeVariants = onSnapshot(variantsQuery, (snapshot) => {
      const vars = snapshot.docs.map(doc => ({ ...doc.data(), variantID: doc.id } as unknown as ProductVariant));
      setVariants(vars);
      if (vars.length > 0) setSelectedVariant(vars[0]);
    });

    const reviewsQuery = query(
      collection(db, 'products', id, 'reviews'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeReviews = onSnapshot(reviewsQuery, (snapshot) => {
      const revs = snapshot.docs.map(doc => ({ ...doc.data(), reviewID: doc.id } as unknown as Review));
      setReviews(revs);
    });

    return () => {
      unsubscribeProduct();
      unsubscribeVariants();
      unsubscribeReviews();
    };
  }, [id]);

  useEffect(() => {
    if (product?.categoryID) {
      const relatedQuery = query(
        collection(db, 'products'),
        where('categoryID', '==', product.categoryID),
        limit(4)
      );
      const unsubscribeRelated = onSnapshot(relatedQuery, (snapshot) => {
        const prods = snapshot.docs
          .map(doc => ({ ...doc.data(), productID: doc.id } as unknown as Product))
          .filter(p => String(p.productID) !== String(id));
        setRelatedProducts(prods);
      });
      return () => unsubscribeRelated();
    }
  }, [product, id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-28 pb-20 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 pt-32 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/products">
          <Button className="mt-4">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-28 pb-20">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-3xl overflow-hidden bg-muted"
          >
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer hover:ring-2 ring-primary transition-all">
                <img 
                  src={`https://picsum.photos/seed/prod-${id}-${i}/400/400`} 
                  alt={`${product.name} view ${i}`} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="rounded-full px-3">In Stock</Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">4.8</span>
                <span className="text-muted-foreground text-sm">({reviews.length} Reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">{product.name}</h1>
            <p className="text-3xl font-bold text-primary mt-2">
              ${(selectedVariant?.price || product.basePrice).toLocaleString()}
            </p>
          </div>

          <p className="text-muted-foreground text-lg leading-relaxed">
            {product.description}
          </p>

          <Separator />

          {/* Variants */}
          {variants.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="font-bold">Select Variant</h3>
              <div className="flex flex-wrap gap-3">
                {variants.map((v) => (
                  <button
                    key={v.variantID}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-xl border-2 transition-all ${
                      selectedVariant?.variantID === v.variantID
                        ? 'border-primary bg-primary/5 font-bold'
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    <div className="text-sm">{v.color}</div>
                    <div className="text-xs text-muted-foreground">{v.size}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-full px-2 py-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-8 w-8"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-bold">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-8 w-8"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button size="lg" className="flex-1 rounded-full h-14 text-lg gap-2">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-14 w-14">
                <Heart className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted/50 text-center">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted/50 text-center">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider">2 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted/50 text-center">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider">30 Day Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-20">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-8">
            <TabsTrigger 
              value="description" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-lg font-bold"
            >
              Description
            </TabsTrigger>
            <TabsTrigger 
              value="specifications" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-lg font-bold"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-lg font-bold"
            >
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-10">
            <div className="max-w-3xl flex flex-col gap-6">
              <h3 className="text-2xl font-bold">Product Overview</h3>
              <p className="text-muted-foreground leading-relaxed">
                Experience the pinnacle of craftsmanship with the {product.name}. 
                Every detail has been meticulously engineered to provide you with 
                unparalleled performance and style. Whether you're using it for 
                professional work or everyday tasks, this product delivers 
                consistency and reliability.
              </p>
              <ul className="list-disc pl-5 text-muted-foreground flex flex-col gap-2">
                <li>Premium quality materials and construction</li>
                <li>Innovative design for maximum performance</li>
                <li>Eco-friendly manufacturing process</li>
                <li>Comprehensive manufacturer warranty included</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="py-10">
            <div className="max-w-xl border rounded-2xl overflow-hidden">
              <div className="grid grid-cols-2 p-4 bg-muted/50 border-b">
                <span className="font-bold">Brand</span>
                <span className="text-muted-foreground">Shadow Premium</span>
              </div>
              <div className="grid grid-cols-2 p-4 border-b">
                <span className="font-bold">Model</span>
                <span className="text-muted-foreground">NX-2024-PRO</span>
              </div>
              <div className="grid grid-cols-2 p-4 bg-muted/50 border-b">
                <span className="font-bold">Material</span>
                <span className="text-muted-foreground">Aerospace Grade Titanium</span>
              </div>
              <div className="grid grid-cols-2 p-4">
                <span className="font-bold">Weight</span>
                <span className="text-muted-foreground">180g</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-10">
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Customer Reviews</h3>
                <Button>Write a Review</Button>
              </div>
              <div className="grid gap-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.reviewID} className="flex gap-4 p-6 rounded-2xl bg-muted/30">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.customerID}`} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{review.customerName || 'Verified Buyer'}</span>
                          <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                          ))}
                        </div>
                        <p className="text-muted-foreground mt-2">{review.reviewText}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    No reviews yet. Be the first to review this product!
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-10">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(prod => (
              <ProductCard key={String(prod.productID)} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
