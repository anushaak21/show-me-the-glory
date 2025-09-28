import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Location {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  operating_hours: any;
  is_active: boolean;
}

export const Locations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast({
        title: "Unable to load locations",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sample locations when database is empty
  const sampleLocations = [
    {
      id: "1",
      name: "Downtown Location",
      address: "123 Main Street, Downtown City, ST 12345",
      phone: "(555) 123-4567",
      operating_hours: { 
        monday: "9:00 AM - 10:00 PM",
        tuesday: "9:00 AM - 10:00 PM",
        wednesday: "9:00 AM - 10:00 PM",
        thursday: "9:00 AM - 10:00 PM",
        friday: "9:00 AM - 11:00 PM",
        saturday: "10:00 AM - 11:00 PM",
        sunday: "10:00 AM - 9:00 PM"
      }
    },
    {
      id: "2",
      name: "Westside Kitchen", 
      address: "456 Oak Avenue, Westside District, ST 12346",
      phone: "(555) 234-5678",
      operating_hours: {
        monday: "10:00 AM - 9:00 PM",
        tuesday: "10:00 AM - 9:00 PM", 
        wednesday: "10:00 AM - 9:00 PM",
        thursday: "10:00 AM - 9:00 PM",
        friday: "10:00 AM - 10:00 PM",
        saturday: "10:00 AM - 10:00 PM",
        sunday: "11:00 AM - 8:00 PM"
      }
    },
    {
      id: "3",
      name: "Northside Express",
      address: "789 Pine Road, Northside Plaza, ST 12347", 
      phone: "(555) 345-6789",
      operating_hours: {
        monday: "8:00 AM - 9:00 PM",
        tuesday: "8:00 AM - 9:00 PM",
        wednesday: "8:00 AM - 9:00 PM", 
        thursday: "8:00 AM - 9:00 PM",
        friday: "8:00 AM - 10:00 PM",
        saturday: "9:00 AM - 10:00 PM",
        sunday: "9:00 AM - 8:00 PM"
      }
    }
  ];

  const displayLocations = locations.length > 0 ? locations : sampleLocations;

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Locations</h2>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-muted rounded-lg h-48"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="locations" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Locations</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find a FoodieDelights location near you. All our kitchens are equipped to serve you the freshest meals with the fastest delivery times.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayLocations.map((location) => (
            <Card key={location.id} className="hover:shadow-soft transition-all duration-300 bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-card-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>{location.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{location.address}</p>
                
                {location.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{location.phone}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">Hours</span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {location.operating_hours && typeof location.operating_hours === 'object' ? (
                      Object.entries(location.operating_hours).slice(0, 3).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="capitalize">{day}:</span>
                          <span>{hours as string}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-between">
                        <span>Mon-Sun:</span>
                        <span>9:00 AM - 10:00 PM</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Get Directions
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Don't see a location near you?</p>
          <Button variant="default">
            Request New Location
          </Button>
        </div>
      </div>
    </section>
  );
};