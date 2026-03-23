import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReservationProvider } from "@/contexts/ReservationContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";

const Shop = lazy(() => import("./pages/Shop"));
const Contact = lazy(() => import("./pages/Contact"));
const Reservation = lazy(() => import("./pages/Reservation"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <ReservationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<PublicLayout><Index /></PublicLayout>} />
              <Route path="/pood" element={<Suspense fallback={null}><PublicLayout><Shop /></PublicLayout></Suspense>} />
              <Route path="/kontakt" element={<Suspense fallback={null}><PublicLayout><Contact /></PublicLayout></Suspense>} />
              <Route path="/broneering" element={<Suspense fallback={null}><PublicLayout><Reservation /></PublicLayout></Suspense>} />
              <Route path="/admin/login" element={<Suspense fallback={null}><AdminLogin /></Suspense>} />
              <Route path="/admin" element={<Suspense fallback={null}><PublicLayout><Admin /></PublicLayout></Suspense>} />
              <Route path="*" element={<Suspense fallback={null}><PublicLayout><NotFound /></PublicLayout></Suspense>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ReservationProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
