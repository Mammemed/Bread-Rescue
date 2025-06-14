import { Button } from "./ui/button";
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate("/auth");
  };

  const handleHowItWorks = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bread-pattern">
      <div className="container px-4 py-16 md:py-24 flex flex-col items-center text-center relative z-10">
        <div className="absolute -right-20 top-10 w-40 h-40 bg-bread-200 rounded-full blur-3xl opacity-50" />
        <div className="absolute -left-20 bottom-10 w-40 h-40 bg-bread-300 rounded-full blur-3xl opacity-50" />
        
        <span className="inline-flex items-center rounded-full bg-bread-100 px-3 py-1 text-sm font-medium text-bread-800 mb-6">
          <Leaf className="mr-1 h-4 w-4" />
          Let's reduce food waste together
        </span>
        
        <h1 className="text-4xl md:text-6xl font-bold text-bread-800 mb-6 leading-tight">
          Save bread, <br />
          <span className="text-bread-500">earn rewards</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-8">
          Connecting bakeries with leftover bread to people ready to save it.
          Every kilogram of bread saved generates rewards for everyone.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            size="lg" 
            className="bg-bread-500 text-white hover:bg-bread-600 gap-2"
            onClick={handleGetStarted}
          >
            <Sparkles className="h-5 w-5" />
            Get Started Now
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-bread-300 text-bread-700 hover:bg-bread-50"
            onClick={handleHowItWorks}
          >
            How It Works
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
