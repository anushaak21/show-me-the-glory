import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Leaf, Clock, Flame, ShoppingCart, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  base_price: number;
  image_url: string;
  is_vegetarian: boolean;
  preparation_time: number;
  spice_levels?: string[];
  available_addons?: string[];
}

export default function MenuItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (id) {
      fetchMenuItem();
    }
  }, [id]);

  useEffect(() => {
    if (item) {
      let price = item.base_price;
      price += selectedAddons.length * 30; // ₹30 per addon
      setTotalPrice(price * quantity);
    }
  }, [item, quantity, selectedAddons]);

  const fetchMenuItem = async () => {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      setItem(data);
      if (data.spice_levels && data.spice_levels.length > 0) {
        setSelectedSpiceLevel(data.spice_levels[0]);
      }
    } catch (error) {
      console.error("Error fetching item:", error);
      toast({
        title: "Error",
        description: "Failed to load item details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart!",
      description: `${quantity}x ${item?.name} added to your cart`,
    });
    navigate("/cart");
  };

  const handleAddonToggle = (addon: string) => {
    setSelectedAddons(prev =>
      prev.includes(addon)
        ? prev.filter(a => a !== addon)
        : [...prev, addon]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-muted rounded-lg mb-6"></div>
            <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Item not found</h1>
          <Button onClick={() => navigate("/menu")}>Back to Menu</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{item.name} - FoodCarvan.in | Order Online</title>
        <meta name="description" content={item.description} />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/menu")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="relative rounded-lg overflow-hidden h-96 lg:h-full">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              {item.is_vegetarian && (
                <Badge className="absolute top-4 left-4 bg-fresh text-white">
                  <Leaf className="h-4 w-4 mr-1" />
                  Vegetarian
                </Badge>
              )}
            </div>

            {/* Details Section */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{item.name}</h1>
              <p className="text-lg text-muted-foreground mb-6">{item.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{item.preparation_time} mins</span>
                </div>
                {item.spice_levels && item.spice_levels.includes('Hot') && (
                  <div className="flex items-center text-spicy">
                    <Flame className="h-5 w-5 mr-2" />
                    <span>Spicy Available</span>
                  </div>
                )}
              </div>

              <Card className="mb-6">
                <CardContent className="p-6 space-y-6">
                  {/* Spice Level Selection */}
                  {item.spice_levels && item.spice_levels.length > 0 && (
                    <div>
                      <Label className="text-lg font-semibold mb-3 block">
                        Choose Spice Level
                      </Label>
                      <RadioGroup value={selectedSpiceLevel} onValueChange={setSelectedSpiceLevel}>
                        <div className="flex gap-4">
                          {item.spice_levels.map((level) => (
                            <div key={level} className="flex items-center space-x-2">
                              <RadioGroupItem value={level} id={level} />
                              <Label htmlFor={level}>{level}</Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Add-ons */}
                  {item.available_addons && item.available_addons.length > 0 && (
                    <div>
                      <Label className="text-lg font-semibold mb-3 block">
                        Add-ons (₹30 each)
                      </Label>
                      <div className="space-y-3">
                        {item.available_addons.map((addon) => (
                          <div key={addon} className="flex items-center space-x-2">
                            <Checkbox
                              id={addon}
                              checked={selectedAddons.includes(addon)}
                              onCheckedChange={() => handleAddonToggle(addon)}
                            />
                            <Label htmlFor={addon} className="cursor-pointer">
                              {addon}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <Label className="text-lg font-semibold mb-3 block">Quantity</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price and Add to Cart */}
              <div className="flex items-center justify-between bg-muted p-6 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Total Price</div>
                  <div className="text-3xl font-bold text-primary">₹{totalPrice}</div>
                </div>
                <Button size="lg" onClick={handleAddToCart} className="px-8">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
