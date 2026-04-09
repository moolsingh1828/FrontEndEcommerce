import { ShoppingCart, Heart, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card className="group overflow-hidden border-none shadow-none bg-transparent">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
          <Link to={`/product/${product.productID}`}>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          </Link>
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Heart className="h-4 w-4" />
          </Button>
          {product.basePrice > 500 && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              Premium
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4 px-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Category
            </p>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">4.8</span>
            </div>
          </div>
          <Link to={`/product/${product.productID}`}>
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1 h-10">
            {product.description}
          </p>
        </CardContent>
        
        <CardFooter className="p-0 flex items-center justify-between">
          <p className="text-xl font-bold">
            ${product.basePrice.toLocaleString()}
          </p>
          <Button size="sm" className="rounded-full gap-2">
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
