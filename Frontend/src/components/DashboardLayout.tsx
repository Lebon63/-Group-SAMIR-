import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, LogOut, Settings, Bell, User, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: "patient" | "doctor" | "admin";
  userName: string;
}

const DashboardLayout = ({ children, userRole, userName }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been signed out of your account.",
    });
    navigate("/");
  };

  const getRoleColor = () => {
    switch (userRole) {
      case "patient": return "text-primary";
      case "doctor": return "text-secondary";
      case "admin": return "text-success";
      default: return "text-primary";
    }
  };

  const getRoleBadge = () => {
    switch (userRole) {
      case "patient": return "Patient";
      case "doctor": return "Doctor";
      case "admin": return "Administrator";
      default: return "User";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">DGH Care</span>
            </Link>

            {/* User Info & Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              
              <Card className="bg-muted/30">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <User className={`h-6 w-6 ${getRoleColor()}`} />
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{userName}</p>
                      <p className={`text-xs ${getRoleColor()}`}>{getRoleBadge()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Language Selector */}
      <div className="fixed bottom-4 right-4">
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardContent className="p-3">
            <select className="text-xs bg-transparent border-none outline-none">
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="douala">Douala</option>
              <option value="bassa">Bassa</option>
              <option value="ewondo">Ewondo</option>
            </select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardLayout;