import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Database, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Droplet,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import axios from "axios";

const InventoryOverview = () => {
  const { toast } = useToast();
  const [bloodInventory, setBloodInventory] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/inventory/status");
        // Transform backend data to match frontend display
        const transformedData = response.data.map(item => ({
          bloodType: item.blood_type,
          available: item.collection_volume_ml || 0,
          capacity: 300, // Static capacity for demo
          expiringSoon: item.status === "near_expiry" ? 1 : 0,
          status: item.status === "available" ? "good" : item.status === "near_expiry" ? "low" : "critical"
        }));
        setBloodInventory(transformedData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch inventory",
          variant: "destructive"
        });
      }
    };
    fetchInventory();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-blood-available border-blood-available";
      case "low": return "text-blood-low border-blood-low";
      case "critical": return "text-blood-critical border-blood-critical";
      default: return "text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <CheckCircle className="h-4 w-4" />;
      case "low": return <AlertTriangle className="h-4 w-4" />;
      case "critical": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (available: number, capacity: number) => {
    const percentage = (available / capacity) * 100;
    return percentage > 75 ? (
      <TrendingUp className="h-4 w-4 text-blood-available" />
    ) : percentage < 25 ? (
      <TrendingDown className="h-4 w-4 text-blood-critical" />
    ) : (
      <TrendingUp className="h-4 w-4 text-blood-low rotate-45" />
    );
  };

  const handleUpdateInventory = async () => {
    // Example: Update a single record (replace with actual form or logic)
    try {
      await axios.put("http://127.0.0.1:8000/inventory/update", {
        blood_unit_id: "BB000001",
        donor_id: "D008748",
        donor_age: 21.0,
        donor_gender: "M",
        blood_type: "A-",
        collection_site: "Douala General",
        donation_date: "2024-10-02",
        expiry_date: "2025-04-02",
        collection_volume_ml: 450.0,
        hemoglobin_g_dl: 14.097,
        status: "available"
      });
      toast({
        title: "Success",
        description: "Inventory updated"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update inventory",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet className="h-5 w-5" />
            Blood Inventory Overview
          </CardTitle>
          <CardDescription>
            Current status of blood inventory by blood type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bloodInventory.map((item) => (
              <Card key={item.bloodType} className="border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.bloodType}</CardTitle>
                    <Badge
                      variant="outline"
                      className={getStatusColor(item.status)}
                    >
                      {getStatusIcon(item.status)} {item.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Available</span>
                      <span className="font-medium">{item.available}/{item.capacity}</span>
                    </div>
                    <Progress 
                      value={(item.available / item.capacity) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Expiring Soon</span>
                    <span className="font-medium text-warning">{item.expiringSoon} units</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common inventory management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Export Inventory Report
            </Button>
            <Button variant="outline">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Review Expiring Units
            </Button>
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Generate Reorder Report
            </Button>
            <Button onClick={handleUpdateInventory}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Update Inventory
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryOverview;