import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Type pour une offre
interface BreadOffer {
  id: string;
  breadType: string;
  quantity: string;
  imageUrl: string;
  availableUntil: string;
}

// Récupérer la bakery connectée (depuis localStorage)
function getConnectedBakery() {
  const bakeries = JSON.parse(localStorage.getItem('bakeries') || '[]');
  // On prend la dernière inscrite comme "connectée"
  return bakeries.length > 0 ? bakeries[bakeries.length - 1] : null;
}

const BakeryDashboard: React.FC = () => {
  const bakery = getConnectedBakery();
  const [offers, setOffers] = useState<BreadOffer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [form, setForm] = useState({
    breadType: '',
    quantity: '',
    imageUrl: '',
    availableUntil: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger les offres de la bakery depuis localStorage
  useEffect(() => {
    const allOffers = JSON.parse(localStorage.getItem('offers') || '[]');
    if (bakery) {
      setOffers(allOffers.filter((o: any) => o.bakeryName === bakery.name));
    }
  }, [bakery]);

  // Gestion du formulaire d'ajout d'offre
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'imageUrl' && files && files[0]) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, imageUrl: url }));
      setImagePreview(url);
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };
  const handleImageClick = () => fileInputRef.current?.click();
  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const newOffer: BreadOffer & { bakeryName: string } = {
      id: Date.now().toString(),
      breadType: form.breadType,
      quantity: form.quantity,
      imageUrl: form.imageUrl,
      availableUntil: form.availableUntil,
      bakeryName: bakery.name,
    };
    const allOffers = JSON.parse(localStorage.getItem('offers') || '[]');
    allOffers.push(newOffer);
    localStorage.setItem('offers', JSON.stringify(allOffers));
    setOffers((prev) => [...prev, newOffer]);
    setShowForm(false);
    setForm({ breadType: '', quantity: '', imageUrl: '', availableUntil: '' });
    setImagePreview(null);
  };

  // Calcul du pain sauvé total (analytics simple)
  const totalKgSaved = offers.reduce((sum, o) => {
    const match = o.quantity.match(/([\d.]+)/);
    return sum + (match ? parseFloat(match[1]) : 0);
  }, 0);

  // Préparer les données pour le BarChart
  const chartData = offers.map(o => {
    const m = o.quantity.match(/([\d.]+)/);
    return {
      name: o.breadType,
      kg: m ? parseFloat(m[1]) : 0
    };
  });

  if (!bakery) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Aucune boulangerie connectée.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bread-50 to-bread-100 py-10 px-2">
      <div className="max-w-3xl mx-auto">
        {/* Infos bakery */}
        <Card className="mb-10 shadow-xl border-0 bg-gradient-to-r from-bread-100 to-white">
          <CardContent className="flex flex-col md:flex-row gap-8 items-center py-8">
            <div className="flex flex-col items-center md:items-start flex-1">
              <img src={bakery.imageUrl} alt={bakery.name} className="w-32 h-32 object-cover rounded-full border-4 border-bread-200 shadow-lg mb-4" />
              <div className="text-2xl font-bold text-bread-800 mb-1">{bakery.name}</div>
              <div className="text-bread-700 font-medium flex items-center gap-2 mb-1">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4.5"/><path d="M3 10.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7.5"/><path d="M16 2v2"/><path d="M8 2v2"/></svg>
                {bakery.address}
              </div>
              <div className="text-xs text-bread-400 break-all mb-2">
                <span className="font-semibold text-bread-700">Public Key:</span> {bakery.publicKey}
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Button variant="outline" className="!rounded-full shadow-md border-bread-200" onClick={() => setShowAnalytics((v) => !v)}>
                <BarChart2 className="mr-2" /> Analytics
              </Button>
              <Button onClick={() => setShowForm((v) => !v)} className="bg-bread-500 hover:bg-bread-600 text-lg font-bold px-8 py-3 rounded-full shadow-md flex items-center gap-2">
                <Plus className="mr-2" /> Ajouter une offre
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analytics (option) */}
        {showAnalytics && (
          <Card className="mb-10 shadow-lg border-0 bg-white/90">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-bread-700">Pain Sauvé Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-lg text-bread-700">Évolution des quantités par offre</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'kg', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(v: number) => `${v} kg`} />
                  <Bar dataKey="kg" fill="#10B981" radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="text-2xl font-bold text-green-600 mt-6 text-center">Total : {totalKgSaved.toFixed(1)} kg</div>
            </CardContent>
          </Card>
        )}

        {/* Ajouter une offre */}
        {showForm && (
          <Card className="mb-10 shadow-lg border-0 bg-white/90">
            <CardHeader>
              <CardTitle>Nouvelle Offre</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddOffer} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="breadType">Type de pain</Label>
                  <Input id="breadType" name="breadType" value={form.breadType} onChange={handleChange} required className="rounded-full px-4 py-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableUntil">Disponible jusqu'à</Label>
                  <Input id="availableUntil" name="availableUntil" type="time" value={form.availableUntil} onChange={handleChange} required className="rounded-full px-4 py-2" />
                </div>
                <div className="space-y-2">
                  <Label>Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-bread-100 rounded-xl flex items-center justify-center border-2 border-dashed border-bread-300 cursor-pointer hover:bg-bread-200 transition" onClick={handleImageClick}>
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-xl" />
                      ) : (
                        <span className="text-bread-400">Aucune image</span>
                      )}
                    </div>
                    <input type="file" name="imageUrl" accept="image/*" onChange={handleChange} ref={fileInputRef} className="hidden" required />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-bread-500 hover:bg-bread-600 rounded-full text-lg font-bold py-3">Ajouter</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Liste des offres */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-bread-800 mb-6 border-b border-bread-200 pb-2">Vos Offres</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offers.length === 0 && <div className="text-bread-400">Aucune offre pour le moment.</div>}
            {offers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border-0 bg-white/90">
                <div className="relative h-36 overflow-hidden">
                  <img src={offer.imageUrl} alt={offer.breadType} className="w-full h-full object-cover" />
                  <Badge className="absolute top-2 right-2 bg-bread-500" variant="secondary">{offer.breadType}</Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-bread-800">{offer.breadType}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-bread-700 font-medium">Jusqu'à : {offer.availableUntil}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BakeryDashboard; 