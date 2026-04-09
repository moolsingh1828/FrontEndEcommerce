import { motion } from 'motion/react';
import { ArrowRight, Zap, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/ecommerce/ProductCard';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mockData';

export function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-muted/30">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold w-fit">
              <Zap className="h-4 w-4 fill-primary" />
              <span>New Season Arrival</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
              FUTURE OF <br />
              <span className="text-primary">COMMERCE.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              Experience the next generation of online shopping with Shadow Mart. 
              Premium products, lightning-fast delivery, and curated collections.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Button size="lg" className="rounded-full px-8 h-14 text-lg">
                Shop Now
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg gap-2">
                View Collections
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-3">
              <img 
                src="https://picsum.photos/seed/commerce-hero/1000/1000" 
                alt="Hero" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <p className="text-sm font-medium uppercase tracking-widest opacity-80">Featured Product</p>
                  <h3 className="text-3xl font-bold">Premium Tech Collection</h3>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -left-10 bg-background p-6 rounded-2xl shadow-xl border max-w-[200px] -rotate-6">
              <p className="text-xs font-bold text-primary uppercase mb-1">Limited Offer</p>
              <p className="text-sm font-medium">Get 20% off on your first order with code SHADOW20</p>
            </div>
          </motion.div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Features */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Truck className="h-6 w-6" />
            </div>
            <h4 className="font-bold">Free Shipping</h4>
            <p className="text-xs text-muted-foreground">On orders over $100</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="font-bold">Secure Payment</h4>
            <p className="text-xs text-muted-foreground">100% secure transactions</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <RotateCcw className="h-6 w-6" />
            </div>
            <h4 className="font-bold">Easy Returns</h4>
            <p className="text-xs text-muted-foreground">30-day return policy</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Zap className="h-6 w-6" />
            </div>
            <h4 className="font-bold">Fast Delivery</h4>
            <p className="text-xs text-muted-foreground">Next day delivery available</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">Shop by Category</h2>
            <p className="text-muted-foreground mt-2">Explore our wide range of collections</p>
          </div>
          <Button variant="ghost" className="gap-2">
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_CATEGORIES.filter(c => !c.parentCategoryID).slice(0, 4).map((category, idx) => (
            <Link 
              key={category.categoryID} 
              to={`/products?category=${category.categoryID}`}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-muted"
            >
              <img 
                src={`https://picsum.photos/seed/cat-${idx}/600/800`} 
                alt={category.Cname} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white">{category.Cname}</h3>
                <p className="text-white/60 text-sm">Explore Collection</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">Featured Products</h2>
            <p className="text-muted-foreground mt-2">Our most popular items this week</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full">New</Button>
            <Button variant="outline" size="sm" className="rounded-full">Trending</Button>
            <Button variant="outline" size="sm" className="rounded-full">Best Sellers</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.map(product => (
            <div key={product.productID}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4">
        <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-primary-foreground flex flex-col items-center text-center gap-8 overflow-hidden relative">
          <div className="relative z-10 max-w-2xl flex flex-col gap-6">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Join the Shadow Club</h2>
            <p className="text-lg opacity-80">
              Subscribe to our newsletter and get 15% off your first purchase. 
              Be the first to know about new drops and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Input 
                placeholder="Enter your email" 
                className="h-14 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/50 px-8 text-lg focus-visible:ring-white"
              />
              <Button size="lg" variant="secondary" className="h-14 rounded-full px-10 text-lg font-bold">
                Subscribe
              </Button>
            </div>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>
      </section>
    </div>
  );
}
