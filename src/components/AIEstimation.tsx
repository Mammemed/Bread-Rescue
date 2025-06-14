import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, Scale, CheckCircle, Loader2, Award, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AIEstimation = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [estimatedWeight, setEstimatedWeight] = useState<number | null>(null);
  const [earnedTokens, setEarnedTokens] = useState<number | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create a preview URL for the image
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl);
      
      // Reset analysis states
      setIsAnalyzed(false);
      setEstimatedWeight(null);
      setEarnedTokens(null);
    }
  };
  
  const handleAnalyze = () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis with a timeout
    setTimeout(() => {
      // Generate a random weight between 0.8 and 3.5 kg
      const weight = parseFloat((Math.random() * (3.5 - 0.8) + 0.8).toFixed(1));
      setEstimatedWeight(weight);
      
      // Calculate tokens (10 per kg)
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
    <section className="py-16 bg-bread-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-bread-800 mb-4">Upload Your Photo</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            After collecting your bread, take a photo and upload it here.
            Our AI system will estimate the weight and calculate your rewards.
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <Card className="border-bread-200">
            <CardHeader>
              <CardTitle className="text-bread-700">AI Estimation</CardTitle>
              <CardDescription>
                Upload a clear photo of the bread you've rescued
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {!previewUrl ? (
                <div className="border-2 border-dashed border-bread-200 rounded-lg p-6 flex flex-col items-center justify-center bg-bread-50/50 h-48">
                  <Camera className="h-12 w-12 text-bread-400 mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Click to add a photo</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
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
                    <span className="sr-only">Remove</span>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {isAnalyzed && estimatedWeight && earnedTokens && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <h4 className="font-medium">Analysis complete!</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="flex items-center">
                      <Scale className="h-4 w-4 text-bread-500 mr-2" />
                      <div>
                        <p className="text-xs text-muted-foreground">Estimated weight</p>
                        <p className="font-bold">{estimatedWeight} kg</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-bread-500 mr-2" />
                      <div>
                        <p className="text-xs text-muted-foreground">Tokens earned</p>
                        <p className="font-bold">{earnedTokens}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <Button
                className="w-full bg-bread-500 hover:bg-bread-600 gap-2"
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing || isAnalyzed}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : isAnalyzed ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Analyzed
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Analyze this photo
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AIEstimation;
