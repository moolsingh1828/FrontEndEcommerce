import { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProductCard } from '@/components/ecommerce/ProductCard';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS } from '@/lib/mockData';

export function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('Featured');

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.categoryID === selectedCategory : true;
    const matchesBrand = selectedBrand ? product.brandID === selectedBrand : true;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  return (
    <div className="container mx-auto px-4 pt-28 pb-20">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">All Products</h1>
            <p className="text-muted-foreground mt-2">Showing {filteredProducts.length} results</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid lg:grid-cols-[240px_1fr] gap-10">
          {/* Sidebar Filters */}
          <aside className="hidden lg:flex flex-col gap-8">
            <div>
              <h3 className="font-bold mb-4">Categories</h3>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className={`text-sm text-left px-2 py-1.5 rounded-md transition-colors ${!selectedCategory ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted'}`}
                >
                  All Categories
                </button>
                {MOCK_CATEGORIES.filter(c => !c.parentCategoryID).map(category => (
                  <button 
                    key={category.categoryID}
                    onClick={() => setSelectedCategory(category.categoryID)}
                    className={`text-sm text-left px-2 py-1.5 rounded-md transition-colors ${selectedCategory === category.categoryID ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted'}`}
                  >
                    {category.Cname}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Brands</h3>
              <div className="flex flex-wrap gap-2">
                {MOCK_BRANDS.map(brand => (
                  <Badge 
                    key={brand.brandID}
                    variant={selectedBrand === brand.brandID ? 'default' : 'outline'}
                    className="cursor-pointer px-3 py-1"
                    onClick={() => setSelectedBrand(selectedBrand === brand.brandID ? null : brand.brandID)}
                  >
                    {brand.bName}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Price Range</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Input placeholder="Min" type="number" className="h-8" />
                  <span className="text-muted-foreground">-</span>
                  <Input placeholder="Max" type="number" className="h-8" />
                </div>
                <Button size="sm">Apply</Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger 
                    render={<Button variant="outline" size="sm" className="gap-2" />}
                  >
                    Sort by: {sortBy}
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setSortBy('Featured')}>Featured</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('Newest')}>Newest</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('Price: Low to High')}>Price: Low to High</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('Price: High to Low')}>Price: High to Low</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-muted">
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map(product => (
                  <div key={product.productID}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold">No products found</h3>
                <p className="text-muted-foreground max-w-xs">
                  We couldn't find any products matching your current filters. Try adjusting your search or filters.
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                  setSelectedBrand(null);
                }}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
