import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Activity, UserCheck, Shield, Heart } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [doctorCredentials, setDoctorCredentials] = useState({
    username: "",
    password: ""
  });
  
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: ""
  });

  const handleDoctorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login validation
    if (doctorCredentials.username && doctorCredentials.password) {
      toast({
        title: "Doctor Login Successful",
        description: "Welcome to the Blood Bank System"
      });
      navigate("/doctor/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter valid credentials",
        variant: "destructive"
      });
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock admin login (default: admin/admin)
    if (adminCredentials.username === "admin" && adminCredentials.password === "admin") {
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the Blood Bank Management System"
      });
      navigate("/admin/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid admin credentials",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Blood Bank System
          </h1>
          <p className="text-muted-foreground">
            AI-Enhanced Stock Monitoring & Forecasting
          </p>
        </div>

        {/* Login Tabs */}
        <Tabs defaultValue="doctor" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="doctor" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Doctor
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin
            </TabsTrigger>
          </TabsList>

          {/* Doctor Login */}
          <TabsContent value="doctor">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Doctor Access
                </CardTitle>
                <CardDescription>
                  Access patient blood requests and donor validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDoctorLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-username">Username</Label>
                    <Input
                      id="doctor-username"
                      type="text"
                      placeholder="Enter your username"
                      value={doctorCredentials.username}
                      onChange={(e) => setDoctorCredentials(prev => ({
                        ...prev,
                        username: e.target.value
                      }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-password">Password</Label>
                    <Input
                      id="doctor-password"
                      type="password"
                      placeholder="Enter your password"
                      value={doctorCredentials.password}
                      onChange={(e) => setDoctorCredentials(prev => ({
                        ...prev,
                        password: e.target.value
                      }))}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Login as Doctor
                  </Button>
                </form>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Note: Doctors are registered by administrators</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Login */}
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Admin Access
                </CardTitle>
                <CardDescription>
                  Full system access and management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-username">Username</Label>
                    <Input
                      id="admin-username"
                      type="text"
                      placeholder="Enter admin username"
                      value={adminCredentials.username}
                      onChange={(e) => setAdminCredentials(prev => ({
                        ...prev,
                        username: e.target.value
                      }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter admin password"
                      value={adminCredentials.password}
                      onChange={(e) => setAdminCredentials(prev => ({
                        ...prev,
                        password: e.target.value
                      }))}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Login as Admin
                  </Button>
                </form>
                <div className="mt-4 p-3 bg-accent/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Default credentials:</strong><br />
                    Username: admin<br />
                    Password: admin
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;