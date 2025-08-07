import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Users, 
  BarChart3, 
  Shield, 
  Database,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  LogOut,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import InventoryOverview from "@/components/admin/InventoryOverview";
import RequestManagement from "@/components/admin/RequestManagement";
import ForecastingDashboard from "@/components/admin/ForecastingDashboard";
import DoctorManagement from "@/components/admin/DoctorManagement";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inventory");

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Blood Bank System</h1>
                <p className="text-sm text-muted-foreground">Administrator Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Admin</span>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Units</p>
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-xs text-success">+12% from last week</p>
                </div>
                <Database className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-xs text-warning">Requires attention</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Doctors</p>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </div>
                <Users className="h-8 w-8 text-blood-available" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Efficiency Rate</p>
                  <p className="text-2xl font-bold">94%</p>
                  <p className="text-xs text-success">+2% improvement</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Requests
            </TabsTrigger>
            <TabsTrigger value="forecasting" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              AI Forecasting
            </TabsTrigger>
            <TabsTrigger value="doctors" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Doctors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <InventoryOverview />
          </TabsContent>

          <TabsContent value="requests">
            <RequestManagement />
          </TabsContent>

          <TabsContent value="forecasting">
            <ForecastingDashboard />
          </TabsContent>

          <TabsContent value="doctors">
            <DoctorManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;