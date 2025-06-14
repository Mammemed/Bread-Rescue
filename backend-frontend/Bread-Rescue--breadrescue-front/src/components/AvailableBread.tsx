
import { useState } from 'react';
import BreadListing, { BreadListingType } from './BreadListing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';

// Sample data
const breadListings: BreadListingType[] = [
  {
    id: '1',
    bakeryName: 'Artisanal Bakery',
    bakeryLocation: 'London, East End',
    breadType: 'Traditional Baguette',
    quantity: '3-4 kg',
    imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
    postedTime: '30 minutes',
    availableUntil: '7:30 PM',
  },
  {
    id: '2',
    bakeryName: 'Market Bakehouse',
    bakeryLocation: 'London, Camden',
    breadType: 'Sourdough Loaf',
    quantity: '2-3 kg',
    imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    postedTime: '1 hour',
    availableUntil: '8:00 PM',
  },
  {
    id: '3',
    bakeryName: 'Golden Crust',
    bakeryLocation: 'London, Notting Hill',
    breadType: 'Whole Wheat Bread',
    quantity: '4-5 kg',
    imageUrl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    postedTime: '45 minutes',
    availableUntil: '7:00 PM',
  },
];

const AvailableBread = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredListings = breadListings.filter(listing => 
    listing.bakeryName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    listing.breadType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.bakeryLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-bread-800 mb-4">Bread Available Today</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover bread rescues near you. Reserve and collect them before the deadline.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search by bakery, bread type or location..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <BreadListing key={listing.id} listing={listing} />
          ))}
        </div>
        
        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No bread available matching your search.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AvailableBread;
