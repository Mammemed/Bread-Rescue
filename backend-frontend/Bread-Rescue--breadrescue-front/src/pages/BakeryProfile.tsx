import { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { MapContainer as MapContainerType } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

interface Location {
  lat: number;
  lng: number;
}

interface BakeryForm {
  name: string;
  address: string;
  publicKey: string;
  image: File | null;
  lat: number;
  lng: number;
}

const DEFAULT_POSITION: Location = { lat: 48.8566, lng: 2.3522 }; // Paris par défaut

function LocationSelector({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const BakeryProfile = () => {
  const [form, setForm] = useState<BakeryForm>({
    name: '',
    address: '',
    publicKey: '',
    image: null,
    lat: DEFAULT_POSITION.lat,
    lng: DEFAULT_POSITION.lng,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      setForm(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleMapSelect = async (lat: number, lng: number) => {
    setForm(prev => ({ ...prev, lat, lng }));
    setAddressLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'BreadRescueRewards/1.0'
          }
        }
      );
      if (!res.ok) throw new Error('Failed to fetch address');
      const data = await res.json();
      setForm(prev => ({ ...prev, address: data.display_name || `${lat}, ${lng}` }));
    } catch (error) {
      console.error('Error fetching address:', error);
      setForm(prev => ({ ...prev, address: `${lat}, ${lng}` }));
      toast.error("Failed to fetch address. Using coordinates instead.");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement actual form submission
      setSubmitted(true);
      toast.success("Profile saved successfully!");
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Failed to save profile. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bread-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Profile Saved!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {imagePreview && (
              <div className="flex justify-center">
                <img 
                  src={imagePreview} 
                  alt="Bakery" 
                  className="w-40 h-40 object-cover rounded-full border-4 border-bread-200" 
                />
              </div>
            )}
            <div className="text-center">
              <h2 className="text-xl font-bold text-bread-700">{form.name}</h2>
              <p className="text-bread-500">{form.address}</p>
              <p className="text-bread-700 mt-2">Public Key: {form.publicKey}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bread-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Bakery Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-40 h-40 flex items-center justify-center bg-bread-100 rounded-full border-2 border-dashed border-bread-300 cursor-pointer hover:bg-bread-200 transition"
                onClick={handleImageClick}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-full" />
                ) : (
                  <span className="text-bread-400">No image selected</span>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleImageClick}
                className="w-full"
              >
                Upload Bakery Image
              </Button>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                ref={fileInputRef}
                className="hidden"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Bakery Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your bakery name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Bakery Location</Label>
              <div className="h-[200px] w-full rounded-md overflow-hidden border">
                <MapContainer 
                  center={[form.lat, form.lng]} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }}
                  className="z-0"
                >
                  <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[form.lat, form.lng]} />
                  <LocationSelector onSelect={handleMapSelect} />
                </MapContainer>
              </div>
              <p className="text-sm text-bread-700">
                {addressLoading ? 'Loading address...' : (form.address ? `Selected: ${form.address}` : 'Click on the map to select your location.')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publicKey">Wallet Public Key</Label>
              <Input
                id="publicKey"
                name="publicKey"
                placeholder="Enter your wallet public key"
                value={form.publicKey}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full">
                Save Profile
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/")}
                className="w-full"
              >
                Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BakeryProfile; 
