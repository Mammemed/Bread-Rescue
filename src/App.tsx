import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Surplus from "./pages/Surplus";
import BakeryProfile from "./pages/BakeryProfile";
import ReservationDetails from "./pages/ReservationDetails";
import Bakeries from "./pages/Bakeries";
import BakeryDashboard from "./pages/BakeryDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/surplus" element={<Surplus />} />
          <Route path="/bakery-profile" element={<BakeryProfile />} />
          <Route path="/reservation-details" element={<ReservationDetails />} />
          <Route path="/bakeries" element={<Bakeries />} />
          <Route path="/dashboard" element={<BakeryDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
