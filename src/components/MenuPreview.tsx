import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Leaf, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import pastaImage from "@/assets/pasta-dish.jpg";
import burgerImage from "@/assets/burger-dish.jpg";
import saladImage from "@/assets/salad-dish.jpg";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  base_price: number;
  is_vegetarian: boolean;
  preparation_time: number;
  image_url: string | null;
  category_name?: string;
}

export const MenuPreview = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fallback images for when database doesn't have images
  const fallbackImages = [pastaImage, burgerImage, saladImage];

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('active', true)
        .order('display_order');

      if (categoriesError) throw categoriesError;

      // Fetch menu items with category info
      const { data: itemsData, error: itemsError } = await supabase
        .from('menu_items')
        .select(`
          *,
          menu_categories!inner(name)
        `)
        .eq('is_available', true)
        .limit(6)
        .order('display_order');

      if (itemsError) throw itemsError;

      setCategories(categoriesData || []);
      setMenuItems(itemsData || []);
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast({
        title: "Unable to load menu",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Menu</h2>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/3 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-muted rounded-lg h-64"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Featured Menu</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our chef's special selections, crafted with the finest ingredients and delivered fresh to your door.
          </p>
        </div>

        {menuItems.length === 0 ? (
          // Sample menu when database is empty
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: "1",
                name: "Gourmet Pasta Primavera",
                description: "Fresh seasonal vegetables tossed with perfectly cooked pasta and our signature herb sauce",
                base_price: 18.99,
                is_vegetarian: true,
                preparation_time: 15,
                image: pastaImage,
                category: "Italian"
              },
              {
                id: "2", 
                name: "Classic Gourmet Burger",
                description: "Juicy beef patty with fresh lettuce, tomato, cheese, and our special sauce on an artisanal bun",
                base_price: 15.99,
                is_vegetarian: false,
                preparation_time: 12,
                image: burgerImage,
                category: "American"
              },
              {
                id: "3",
                name: "Fresh Garden Salad",
                description: "Mixed greens with seasonal vegetables, nuts, and your choice of house-made dressing",
                base_price: 12.99,
                is_vegetarian: true,
                preparation_time: 8,
                image: saladImage,
                category: "Healthy"
              }
            ].map((item) => (
              <Card key={item.id} className="group hover:shadow-warm transition-all duration-300 overflow-hidden border-border bg-card">
                <div className="relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    {item.is_vegetarian && (
                      <Badge variant="secondary" className="bg-fresh/20 text-fresh border-fresh">
                        <Leaf className="h-3 w-3 mr-1" />
                        Vegetarian
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-lg font-bold text-primary">${item.base_price}</span>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{item.preparation_time} min</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{item.category}</Badge>
                    </div>
                    <Button variant="appetizing" size="sm">Add to Cart</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Dynamic menu from database
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <Card key={item.id} className="group hover:shadow-warm transition-all duration-300 overflow-hidden border-border bg-card">
                <div className="relative overflow-hidden">
                  <img 
                    src={item.image_url || fallbackImages[index % fallbackImages.length]} 
                    alt={item.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    {item.is_vegetarian && (
                      <Badge variant="secondary" className="bg-fresh/20 text-fresh border-fresh">
                        <Leaf className="h-3 w-3 mr-1" />
                        Vegetarian
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-lg font-bold text-primary">${item.base_price}</span>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{item.preparation_time} min</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{(item as any).menu_categories?.name || 'Specialty'}</Badge>
                    </div>
                    <Button variant="appetizing" size="sm">Add to Cart</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="default" size="lg">
            View Full Menu
          </Button>
        </div>
      </div>
    </section>
  );
};