import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Brain, 
  Calendar,
  AlertTriangle,
  Target,
  Zap,
  Download
} from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const ForecastingDashboard = () => {
  const { toast } = useToast();
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [demandForecast, setDemandForecast] = useState([]);
  const [optimization, setOptimization] = useState(null);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const periods = ["7days", "30days"];

  const handleForecast = async () => {
    if (!selectedBloodType) {
      toast({
        title: "Missing Information",
        description: "Please select a blood type",
        variant: "destructive"
      });
      return;
    }
    try {
      const response = await axios.post("http://127.0.0.1:8000/forecast/predict", {
        blood_type: selectedBloodType,
        period: selectedPeriod
      });
      const newForecast = {
        bloodType: selectedBloodType,
        current: 0, // Update with actual inventory data if needed
        [`predicted${selectedPeriod === "7days" ? "7Days" : "30Days"}`]: response.data.predicted_demand,
        trend: response.data.predicted_demand > 0 ? "increasing" : "stable"
      };
      setDemandForecast(prev => [...prev.filter(f => f.bloodType !== selectedBloodType), newForecast]);
      toast({
        title: "Success",
        description: `Forecast for ${selectedBloodType} (${selectedPeriod}) generated`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate forecast",
        variant: "destructive"
      });
    }
  };

  const handleOptimization = async () => {
    if (!selectedBloodType) {
      toast({
        title: "Missing Information",
        description: "Please select a blood type",
        variant: "destructive"
      });
      return;
    }
    try {
      const response = await axios.post("http://127.0.0.1:8000/optimization/recommend", {
        blood_type: selectedBloodType
      });
      setOptimization(response.data);
      toast({
        title: "Success",
        description: `Optimization recommendation for ${selectedBloodType} generated`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate optimization",
        variant: "destructive"
      });
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-blood-critical" />;
      case "decreasing":
        return <TrendingUp className="h-4 w-4 text-blood-available rotate-180" />;
      default:
        return <Target className="h-4 w-4 text-blood-low" />;
    }
  };

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <Badge className="bg-blood-critical/10 text-blood-critical">Increasing</Badge>;
      case "decreasing":
        return <Badge className="bg-blood-available/10 text-blood-available">Decreasing</Badge>;
      default:
        return <Badge className="bg-blood-low/10 text-blood-low">Stable</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Blood Demand Forecasting
          </CardTitle>
          <CardDescription>
            Generate and review blood demand predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periods.map(period => (
                    <SelectItem key={period} value={period}>{period}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleForecast} className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Generate Forecast
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {demandForecast.map(item => (
              <Card key={item.bloodType} className="border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.bloodType}</CardTitle>
                    {getTrendBadge(item.trend)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current</span>
                    <span className="font-medium">{item.current} units</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">7-Day Prediction</span>
                    <span className="font-medium">{item.predicted7Days || "N/A"} units</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">30-Day Prediction</span>
                    <span className="font-medium">{item.predicted30Days || "N/A"} units</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Inventory Optimization
          </CardTitle>
          <CardDescription>
            AI-generated recommendations for inventory optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimization && (
              <div className="flex items-start gap-3 p-4 bg-blood-critical/10 border border-blood-critical/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-blood-critical mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blood-critical">Optimization Recommendation</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {optimization.message}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <Button onClick={handleOptimization} className="m-4">
          <Download className="h-4 w-4 mr-2" />
          Generate Recommendation
        </Button>
      </Card>
    </div>
  );
};

export default ForecastingDashboard;