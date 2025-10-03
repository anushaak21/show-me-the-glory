import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star } from "lucide-react";
import heroImage from "@/assets/hero-food.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] bg-warm-gradient overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Delicious gourmet food spread" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-hero-gradient opacity-60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <div className="max-w-4xl space-y-8">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground leading-tight">
            Authentic Biryani
            <span className="block text-primary-glow animate-float">Delivered Hot & Fresh</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
            Experience the taste of tradition with FoodCarvan.in - Your journey to delicious begins here!
            From aromatic biryanis to delightful combos, we bring authentic flavors to your doorstep.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 text-primary-foreground/80">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary-glow" />
              <span>30 min delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary-glow fill-current" />
              <span>4.9/5 rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary-glow" />
              <span>City-wide delivery</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-4 bg-primary text-primary-foreground hover:bg-primary-glow shadow-warm"
              onClick={() => window.location.href = '/menu'}
            >
              Explore Menu
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 bg-background/10 border-primary-foreground/30 text-primary-foreground hover:bg-background/20"
              onClick={() => document.getElementById('locations')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Find Locations
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};