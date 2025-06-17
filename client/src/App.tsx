import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { EventProvider } from "@/contexts/EventContext";
import Navbar from "@/components/Navbar";

// Pages and Components
import Home from "@/components/Home";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import MyEvents from "@/components/MyEvents";
import EventDetail from "@/components/EventDetail";
import PostEvent from "@/components/PostEvent";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <EventProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main className="pt-16">
                {" "}
                {/* Add padding top for fixed navbar */}
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route
                    path="/my-events"
                    element={
                      <ProtectedRoute>
                        <MyEvents />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/events/new"
                    element={
                      <ProtectedRoute>
                        <PostEvent />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/events/:id" element={<EventDetail />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </EventProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
