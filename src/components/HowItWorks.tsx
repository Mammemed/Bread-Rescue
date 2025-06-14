import { 
  Camera, 
  ShoppingBag, 
  Upload, 
  BadgeCheck, 
  Store 
} from 'lucide-react';

const steps = [
  {
    icon: <Store className="h-10 w-10 text-bread-500" />,
    title: "Bakery Posts",
    description: "Partner bakeries post their unsold bread with a photo and quantity estimate."
  },
  {
    icon: <ShoppingBag className="h-10 w-10 text-bread-500" />,
    title: "You Reserve and Collect",
    description: "Reserve the bread you want to save and pick it up from the bakery."
  },
  {
    icon: <Camera className="h-10 w-10 text-bread-500" />,
    title: "Take a Photo",
    description: "After collecting the bread, take a photo to document your rescue."
  },
  {
    icon: <Upload className="h-10 w-10 text-bread-500" />,
    title: "Upload the Image",
    description: "Upload the photo to our platform for verification by our AI system."
  },
  {
    icon: <BadgeCheck className="h-10 w-10 text-bread-500" />,
    title: "Receive Rewards",
    description: "Our AI estimates the weight of the rescued bread and awards you accordingly."
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 bg-bread-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-bread-800 mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our simple process allows you to save unsold bread and earn rewards.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="rounded-full bg-bread-100 p-4 mb-4">
                {step.icon}
              </div>
              <h3 className="font-bold text-lg mb-2 text-bread-700">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                  <div className="h-0.5 w-8 bg-bread-200"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
