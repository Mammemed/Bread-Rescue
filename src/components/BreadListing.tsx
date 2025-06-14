import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "./ui/card";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from "./ui/button";
import { ShoppingBag, MapPin, Clock, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export type BreadListingType = {
  id: string;
  bakeryName: string;
  bakeryLocation: string;
  breadType: string;
  quantity: string;
  imageUrl: string;
  postedTime: string;
  availableUntil: string;
};

interface BreadListingProps {
  listing: BreadListingType;
}

const BreadListing = ({ listing }: BreadListingProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isReserved, setIsReserved] = useState(false);
  
  const handleReserve = () => {
    // Vérifier le rôle de l'utilisateur
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'Bakery') {
      toast({
        title: "Reservation not allowed",
        description: "Only Saver accounts can reserve bread.",
        variant: "destructive"
      });
      return;
    }
    const isAuthenticated = userRole === 'Saver';
    if (!isAuthenticated) {
      navigate('/auth', { state: { breadListing: listing, forceSaver: true } });
      return;
    }
    setIsReserved(true);
    toast({
      title: "Bread successfully reserved!",
      description: `You have reserved bread from ${listing.bakeryName}. Please collect before ${listing.availableUntil}.`,
    });
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={listing.imageUrl} 
          alt={`Available bread at ${listing.bakeryName}`}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <Badge 
          className="absolute top-2 right-2 bg-bread-500"
          variant="secondary"
        >
          {listing.breadType}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-bread-800">{listing.bakeryName}</h3>
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{listing.bakeryLocation}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-1 text-bread-400" />
            <span className="text-sm">Quantity: {listing.quantity}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-bread-400" />
            <span className="text-sm">Until: {listing.availableUntil}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Posted {listing.postedTime} ago</p>
      </CardContent>
      
      <CardFooter>
        <Button 
          className={isReserved ? "bg-green-500 hover:bg-green-600 w-full" : "bg-bread-500 hover:bg-bread-600 w-full"}
          onClick={handleReserve}
          disabled={isReserved}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          {isReserved ? "Reserved" : "Reserve this bread"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BreadListing;
