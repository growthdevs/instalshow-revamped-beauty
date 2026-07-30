import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FeiraVirtual from "./pages/FeiraVirtual";
import ExpositorLogin from "./pages/ExpositorLogin";
import ExpositorResetPassword from "./pages/ExpositorResetPassword";
import ExpositorDashboard from "./pages/ExpositorDashboard";
import ExpositorSimulador from "./pages/ExpositorSimulador";
import AdminVendas from "./pages/AdminVendas";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminParametros from "./pages/AdminParametros";
import AdminExpositores from "./pages/AdminExpositores";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/feira-virtual" element={<FeiraVirtual />} />
          <Route path="/expositor/login" element={<ExpositorLogin />} />
          <Route path="/expositor/reset-password" element={<ExpositorResetPassword />} />
          <Route path="/expositor/dashboard" element={<ExpositorDashboard />} />
          <Route path="/expositor/simulador" element={<ExpositorSimulador />} />
          <Route path="/admin/vendas" element={<AdminVendas />} />
          <Route path="/admin/administradores" element={<AdminUsuarios />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
