import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import "leaflet/dist/leaflet.css";

// Définir les rôles possibles
const ROLES = {
  BAKERY: "Bakery",
  SAVER: "Saver"
};

type UserRole = keyof typeof ROLES | null;

interface SaverFormData {
  name: string;
  publicKey: string;
}

interface BakeryFormData {
  name: string;
  address: string;
  publicKey: string;
  image: File | null;
  lat: number;
  lng: number;
}

const DEFAULT_POSITION = { lat: 48.8566, lng: 2.3522 };

function LocationSelector({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const Auth = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [saverForm, setSaverForm] = useState<SaverFormData>({
    name: "",
    publicKey: "",
  });
  const [bakeryForm, setBakeryForm] = useState<BakeryFormData>({
    name: "",
    address: "",
    publicKey: "",
    image: null,
    lat: DEFAULT_POSITION.lat,
    lng: DEFAULT_POSITION.lng,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const breadListing = location.state?.breadListing;
  const forceSaver = location.state?.forceSaver;
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');

  // Si on force le Saver, on saute la sélection du rôle
  useEffect(() => {
    if (forceSaver) setRole("SAVER");
  }, [forceSaver]);

  // Gestion du formulaire Saver
  const handleSaverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSaverForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSaverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('userRole', 'Saver');
      if (breadListing) {
        navigate('/reservation-details', { state: { breadListing } });
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  // Gestion du formulaire Bakery
  const handleBakeryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setBakeryForm(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setBakeryForm(prev => ({ ...prev, [name]: value }));
    }
  };
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  const handleMapSelect = async (lat: number, lng: number) => {
    setBakeryForm(prev => ({ ...prev, lat, lng }));
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
      setBakeryForm(prev => ({ ...prev, address: data.display_name || `${lat}, ${lng}` }));
    } catch (error) {
      console.error('Error fetching address:', error);
      setBakeryForm(prev => ({ ...prev, address: `${lat}, ${lng}` }));
      toast.error("Failed to fetch address. Using coordinates instead.");
    } finally {
      setAddressLoading(false);
    }
  };
  const handleBakerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Enregistrer la nouvelle bakery dans localStorage
      const bakeries = JSON.parse(localStorage.getItem('bakeries') || '[]');
      bakeries.push({
        name: bakeryForm.name,
        address: bakeryForm.address,
        publicKey: bakeryForm.publicKey,
        imageUrl: imagePreview, // on stocke l'URL de prévisualisation (base64 ou blob)
      });
      localStorage.setItem('bakeries', JSON.stringify(bakeries));
      localStorage.setItem('userRole', 'Bakery');
      navigate('/dashboard');
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  // Sélection du rôle
  if (!role && !forceSaver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bread-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Welcome to Bread Rescue Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-6">Choose your role to continue</p>
            <div className="flex flex-col gap-4">
              <Button
                variant="default"
                size="lg"
                onClick={() => setRole("BAKERY")}
                className="w-full"
              >
                I am a Bakery
              </Button>
              <Separator className="my-2" />
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setRole("SAVER")}
                className="w-full"
              >
                I am a Saver
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Bakery form with image and map
  if (role === "BAKERY") {
    if (authMode === 'login') {
      // Formulaire de connexion Bakery
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bread-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Bakery Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={e => { e.preventDefault(); localStorage.setItem('userRole', 'Bakery'); navigate('/dashboard'); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Bakery Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your bakery name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publicKey">Wallet Public Key</Label>
                  <Input
                    id="publicKey"
                    name="publicKey"
                    placeholder="Enter your wallet public key"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-bread-500 hover:bg-bread-600">
                  Login
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setAuthMode('register')}
                  className="w-full"
                >
                  Pas encore de compte ? S'inscrire
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setRole(null)}
                  className="w-full"
                >
                  Back
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      );
    }
    // Formulaire d'inscription Bakery (déjà existant)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bread-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Bakery Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBakerySubmit} className="space-y-4">
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
                  onChange={handleBakeryChange}
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
                  value={bakeryForm.name}
                  onChange={handleBakeryChange}
                  required
                />
              </div>
              <div>
                <Label>Bakery Location</Label>
                <div className="h-[200px] w-full rounded-md overflow-hidden border">
                  <MapContainer 
                    center={[bakeryForm.lat, bakeryForm.lng]} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                  >
                    <TileLayer 
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[bakeryForm.lat, bakeryForm.lng]} />
                    <LocationSelector onSelect={handleMapSelect} />
                  </MapContainer>
                </div>
                <p className="text-sm text-bread-700">
                  {addressLoading ? 'Loading address...' : (bakeryForm.address ? `Selected: ${bakeryForm.address}` : 'Click on the map to select your location.')}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="publicKey">Wallet Public Key</Label>
                <Input
                  id="publicKey"
                  name="publicKey"
                  placeholder="Enter your wallet public key"
                  value={bakeryForm.publicKey}
                  onChange={handleBakeryChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-bread-500 hover:bg-bread-600">
                Register
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAuthMode('login')}
                className="w-full"
              >
                Déjà un compte ? Se connecter
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setRole(null)}
                className="w-full"
              >
                Back
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Saver form
  if (role === "SAVER") {
    if (authMode === 'login') {
      // Formulaire de connexion Saver
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bread-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Saver Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={e => { e.preventDefault(); localStorage.setItem('userRole', 'Saver'); if (breadListing) { navigate('/reservation-details', { state: { breadListing } }); } else { navigate('/'); } }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publicKey">Wallet Public Key</Label>
                  <Input
                    id="publicKey"
                    name="publicKey"
                    placeholder="Enter your wallet public key"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-bread-500 hover:bg-bread-600">
                  Login
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setAuthMode('register')}
                  className="w-full"
                >
                  Pas encore de compte ? S'inscrire
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setRole(null)}
                  className="w-full"
                >
                  Back
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      );
    }
    // Formulaire d'inscription Saver (déjà existant)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bread-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Saver Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaverSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={saverForm.name}
                  onChange={handleSaverChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publicKey">Wallet Public Key</Label>
                <Input
                  id="publicKey"
                  name="publicKey"
                  placeholder="Enter your wallet public key"
                  value={saverForm.publicKey}
                  onChange={handleSaverChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-bread-500 hover:bg-bread-600">
                Register
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAuthMode('login')}
                className="w-full"
              >
                Déjà un compte ? Se connecter
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setRole(null)}
                className="w-full"
              >
                Back
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default Auth; 