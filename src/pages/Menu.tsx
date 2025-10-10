import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Clock, Flame, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { useCart } from "@/contexts/CartContext";
import { toast as sonnerToast } from "sonner";
import { uploadMuttonBiryaniImage } from "@/utils/uploadMuttonBiryani";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  base_price: number;
  image_url: string;
  is_vegetarian: boolean;
  preparation_time: number;
  spice_levels?: string[];
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function Menu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<{ [key: string]: MenuItem[] }>({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchMenuData();
    uploadMuttonBiryaniImage();
  }, []);

  const fetchMenuData = async () => {
    try {
      const { data: categoriesData, error: catError } = await supabase
        .from("menu_categories")
        .select("*")
        .eq("active", true)
        .order("display_order");

      if (catError) throw catError;

      const { data: itemsData, error: itemsError } = await supabase
        .from("menu_items")
        .select("*")
        .eq("is_available", true)
        .order("display_order");

      if (itemsError) throw itemsError;

      setCategories(categoriesData || []);
      
      const groupedItems: { [key: string]: MenuItem[] } = {};
      (itemsData || []).forEach((item) => {
        if (!groupedItems[item.category_id]) {
          groupedItems[item.category_id] = [];
        }
        groupedItems[item.category_id].push(item);
      });
      
      setMenuItems(groupedItems);
      
      if (categoriesData && categoriesData.length > 0) {
        setActiveCategory(categoriesData[0].id);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (itemId: string) => {
    navigate(`/menu/${itemId}`);
  };

  const handleAddToCart = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: item.id,
      name: item.name,
      price: item.base_price,
      image: item.image_url,
      category: categories.find(c => c.id === item.category_id)?.name || "Unknown",
    });
    
    sonnerToast.success("Added to Cart!", {
      description: `${item.name} has been added to your cart`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-muted"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Menu - FoodCarvan.in | Order Biryani, Combos, Desserts Online</title>
        <meta name="description" content="Explore FoodCarvan.in's delicious menu featuring authentic Hyderabadi Biryani, value combos, desserts, and beverages. Order online for home delivery." />
        <meta name="keywords" content="biryani online, food delivery, chicken biryani, veg biryani, combos, desserts, FoodCarvan" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover authentic flavors crafted with love. From aromatic biryanis to delightful combos.
            </p>
          </div>

          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-sm md:text-base">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2">{category.name}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems[category.id]?.map((item) => (
                    <Card 
                      key={item.id} 
                      className="overflow-hidden hover:shadow-warm transition-all cursor-pointer group"
                      onClick={() => handleItemClick(item.id)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {item.is_vegetarian && (
                          <Badge className="absolute top-2 left-2 bg-fresh text-white">
                            <Leaf className="h-3 w-3 mr-1" />
                            Veg
                          </Badge>
                        )}
                        {item.spice_levels && item.spice_levels.includes('Hot') && (
                          <Badge className="absolute top-2 right-2 bg-spicy text-white">
                            <Flame className="h-3 w-3 mr-1" />
                            Spicy
                          </Badge>
                        )}
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold text-primary">
                              ₹{item.base_price}
                            </span>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {item.preparation_time} mins
                            </div>
                          </div>
                          
                          <Button 
                            size="sm" 
                            className="group-hover:bg-primary-glow"
                            onClick={(e) => handleAddToCart(item, e)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </main>

        <Footer />
      </div>
    </>
  );
}
