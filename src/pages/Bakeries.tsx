import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Exemple de données statiques (fallback)
const staticBakeries = [
  {
    id: 1,
    name: "Artisanal Bakery",
    address: "London, East End",
    publicKey: "0x1234...abcd",
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
  },
  {
    id: 2,
    name: "Market Bakehouse",
    address: "London, Camden",
    publicKey: "0x5678...efgh",
    imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
  },
  {
    id: 3,
    name: "Golden Crust",
    address: "London, Notting Hill",
    publicKey: "0x9abc...wxyz",
    imageUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
  },
];

const Bakeries = () => {
  const [bakeries, setBakeries] = useState(staticBakeries);

  useEffect(() => {
    const stored = localStorage.getItem('bakeries');
    if (stored) {
      // Les bakeries enregistrées n'ont pas d'id, on en ajoute un pour React
      const parsed = JSON.parse(stored).map((b: any, i: number) => ({ ...b, id: i + 1 }));
      setBakeries(parsed);
    }
  }, []);

  return (
    <div className="min-h-screen bg-bread-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-bread-800 text-center mb-8">Our Partner Bakeries</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {bakeries.map((bakery) => (
            <Card key={bakery.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={bakery.imageUrl}
                  alt={bakery.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
                <Badge className="absolute top-2 left-2 bg-bread-500 text-white" variant="secondary">
                  Bakery
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-bread-800">{bakery.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-bread-700 font-medium flex items-center gap-2">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4.5"/><path d="M3 10.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7.5"/><path d="M16 2v2"/><path d="M8 2v2"/></svg>
                  {bakery.address}
                </div>
                <div className="text-xs text-bread-400 break-all">
                  <span className="font-semibold text-bread-700">Public Key:</span> {bakery.publicKey}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bakeries; 