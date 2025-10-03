import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Menu, X, MapPin, Phone, ShoppingCart, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemsCount] = useState(3); // This will be connected to actual cart later
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="h-8 w-8 bg-hero-gradient rounded-full animate-pulse-glow"></div>
            <span className="text-xl font-bold text-foreground">FoodCarvan.in</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <span onClick={() => navigate("/menu")} className="cursor-pointer text-foreground hover:text-primary transition-smooth">Menu</span>
            <a href="#locations" className="text-foreground hover:text-primary transition-smooth">Locations</a>
            <a href="#franchise" className="text-foreground hover:text-primary transition-smooth">Franchise</a>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span className="text-sm">1800-FOODCARVAN</span>
            </div>
            
            {/* Auth & Cart Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {/* Cart Icon */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative"
                    onClick={() => navigate("/cart")}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {cartItemsCount}
                      </Badge>
                    )}
                  </Button>
                  
                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        My Orders
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate("/auth")}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={() => navigate("/auth")}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4 space-y-4">
            <span 
              className="block cursor-pointer text-foreground hover:text-primary transition-smooth"
              onClick={() => {
                navigate("/menu");
                setIsMenuOpen(false);
              }}
            >
              Menu
            </span>
            <a 
              href="#locations" 
              className="block text-foreground hover:text-primary transition-smooth"
              onClick={() => setIsMenuOpen(false)}
            >
              Locations
            </a>
            <a 
              href="#franchise" 
              className="block text-foreground hover:text-primary transition-smooth"
              onClick={() => setIsMenuOpen(false)}
            >
              Franchise
            </a>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span className="text-sm">1800-FOODCARVAN</span>
            </div>
            
            {/* Mobile Auth Section */}
            {user ? (
              <div className="space-y-2 pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/cart");
                    setIsMenuOpen(false);
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t border-border">
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => {
                    navigate("/auth");
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => {
                    navigate("/auth");
                    setIsMenuOpen(false);
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};