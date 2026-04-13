import { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, Menu, X, Heart, LogOut, Settings, Package, LayoutDashboard, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/lib/AuthContext';
import { loginWithGoogle, logout } from '@/lib/firebase';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const { user, firebaseUser, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md border-bottom py-2 shadow-sm' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-primary">
            SHADOW MART
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">Shop</Link>
            <Link to="/categories" className="text-sm font-medium hover:text-primary transition-colors">Categories</Link>
            <Link to="/deals" className="text-sm font-medium hover:text-primary transition-colors">Deals</Link>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8 hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-10 bg-muted/50 border-none focus-visible:ring-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="h-5 w-5" />
          </Button>

          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>

          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          {firebaseUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger 
                render={<Button variant="ghost" size="icon" className="rounded-full" />}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`} />
                  <AvatarFallback>{firebaseUser.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.name || firebaseUser.displayName}</span>
                    <span className="text-xs text-muted-foreground font-normal">{firebaseUser.email}</span>
                    {user?.role && (
                      <Badge variant="outline" className="w-fit mt-1 text-[10px] py-0 h-4">
                        {user.role}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/orders')}>
                  <Package className="mr-2 h-4 w-4" />
                  Orders
                </DropdownMenuItem>
                {user?.role === 'ADMIN' || user?.role === 'VENDOR' ? (
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleLogin} className="gap-2 rounded-full">
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          )}

          <Sheet>
            <SheetTrigger 
              render={<Button variant="ghost" size="icon" className="md:hidden" />}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <Link to="/products" className="text-lg font-medium">Shop</Link>
                <Link to="/categories" className="text-lg font-medium">Categories</Link>
                <Link to="/deals" className="text-lg font-medium">Deals</Link>
                <Link to="/wishlist" className="text-lg font-medium">Wishlist</Link>
                {!firebaseUser && (
                  <Button onClick={handleLogin} className="mt-4">Login</Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
