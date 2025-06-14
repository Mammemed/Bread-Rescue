import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Info, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Camera, Scale, Loader2, Award, X } from "lucide-react";

const ReservationDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [estimatedWeight, setEstimatedWeight] = useState<number | null>(null);
  const [earnedTokens, setEarnedTokens] = useState<number | null>(null);

  // Get the bread listing data from location state
  const breadListing = location.state?.breadListing;

  // If no bread listing data, redirect to home
  if (!breadListing) {
    navigate("/");
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl);
      setIsAnalyzed(false);
      setEstimatedWeight(null);
      setEarnedTokens(null);
    }
  };

  const handleAnalyze = () => {
    if (!file) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const weight = parseFloat((Math.random() * (3.5 - 0.8) + 0.8).toFixed(1));
      setEstimatedWeight(weight);
      const tokens = Math.round(weight * 10);
      setEarnedTokens(tokens);
      setIsAnalyzing(false);
      setIsAnalyzed(true);
      toast({
        title: "Analysis Complete!",
        description: `Our AI has estimated that you've rescued ${weight} kg of bread. Well done!`,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-bread-50 py-8 px-2">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale : Offre + Upload */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Bread Listing Details */}
          <Card className="overflow-hidden">
            <div className="relative h-56 overflow-hidden rounded-t-lg">
              <img 
                src={breadListing.imageUrl} 
                alt={`Available bread at ${breadListing.bakeryName}`}
                className="w-full h-full object-cover"
              />
              <Badge 
                className="absolute top-2 right-2 bg-bread-500"
                variant="secondary"
              >
                {breadListing.breadType}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-bread-800 text-center">{breadListing.bakeryName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-center">
              <div className="flex justify-center gap-4 text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{breadListing.bakeryLocation}</span>
                </div>
                <div className="flex items-center">
                  <Info className="h-4 w-4 mr-1 text-bread-400" />
                  <span>Type: {breadListing.breadType}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-bread-400" />
                  <span>Jusqu'à: {breadListing.availableUntil}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Title and Description */}
          <div className="w-full text-center mb-2 mt-4">
            <h1 className="text-3xl font-bold text-bread-800 mb-2">Upload Your Photo</h1>
            <p className="text-lg text-bread-700 mb-6">
              Après avoir récupéré votre pain, prenez une photo et uploadez-la ici. Notre système estimera le poids et calculera vos récompenses.
            </p>
          </div>

          {/* Upload Section */}
          <Card className="w-full p-6 bg-white/90 border border-bread-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-bread-700">AI Estimation</CardTitle>
              <p className="text-bread-700 text-base mt-1">Upload a clear photo of the bread you've rescued</p>
            </CardHeader>
            <CardContent>
              {!previewUrl ? (
                <div className="border-2 border-dashed border-bread-300 rounded-lg p-6 flex flex-col items-center justify-center bg-bread-50/50 h-48 mb-6 relative">
                  <Camera className="h-12 w-12 text-bread-400 mb-2" />
                  <p className="text-base text-bread-700 mb-2">Click to add a photo</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Rescued bread"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      className="absolute top-2 right-2 bg-white/90 p-1 rounded-full"
                      onClick={() => {
                        setFile(null);
                        setPreviewUrl(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Analyze Button */}
              {!isAnalyzed && (
                <Button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !file}
                  className="w-full bg-bread-400 hover:bg-bread-500 text-lg py-3 flex items-center justify-center gap-2 mt-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <span className="mr-2"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2"/><polyline points="8 6 10 4 12 6"/><line x1="10" x2="10" y1="4" y2="12"/></svg></span>
                      Analyze this photo
                    </>
                  )}
                </Button>
              )}

              {/* Results */}
              {isAnalyzed && (
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between p-4 bg-bread-50 rounded-lg">
                    <div className="flex items-center">
                      <Scale className="h-5 w-5 text-bread-500 mr-2" />
                      <span>Estimated Weight:</span>
                    </div>
                    <span className="font-bold">{estimatedWeight} kg</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-bread-50 rounded-lg">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-bread-500 mr-2" />
                      <span>Earned Tokens:</span>
                    </div>
                    <span className="font-bold">{earnedTokens}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne Chatbot */}
        <div className="flex flex-col gap-4">
          <Card className="h-full flex flex-col justify-between shadow-lg border-0 bg-white/90">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-bread-700">Chatbot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex flex-col justify-end">
                {/* Placeholder chatbot */}
                <div className="flex-1 flex flex-col justify-end">
                  <div className="bg-bread-100 rounded-lg p-4 text-bread-700 text-center mb-2">
                    Ici, votre assistant peut répondre à vos questions sur la réservation, la collecte, etc.
                  </div>
                  <input type="text" placeholder="Écrivez un message..." className="w-full border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-bread-400" disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails; 