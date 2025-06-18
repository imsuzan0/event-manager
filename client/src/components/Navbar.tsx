import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        duration: 5000,
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while logging out",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-indigo-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
              <Calendar className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
              EventGhar
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                isActive("/")
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              Home
            </Link>

            {user && (
              <Link
                to="/my-events"
                className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  isActive("/my-events")
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                My Events
              </Link>
            )}

            {user ? (
              // User Icon with Dropdown
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="p-2 rounded-full bg-indigo-50 cursor-pointer hover:bg-indigo-100 hover:scale-105 transition-all duration-300">
                    <User className="h-6 w-6 text-indigo-600" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-sm border border-indigo-100 shadow-lg">
                  <div className="px-4 py-3 text-gray-800 font-semibold border-b border-indigo-50">
                    {user.name}
                  </div>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer px-4 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Login/Signup buttons
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-6 py-2.5 rounded-xl transition-all duration-300"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 rounded-xl text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300"
          >
            {isMenuOpen ? (
              <X className="h-7 w-7" />
            ) : (
              <Menu className="h-7 w-7" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-indigo-100 bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActive("/")
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                Home
              </Link>

              {user && (
                <Link
                  to="/my-events"
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive("/my-events")
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  My Events
                </Link>
              )}

              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="px-6 py-3 rounded-xl font-medium transition-all duration-300 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 text-left flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-6 py-3 rounded-xl font-medium transition-all duration-300 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-6 py-3 rounded-xl font-medium transition-all duration-300 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;