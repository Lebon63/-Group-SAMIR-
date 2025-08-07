import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, UserPlus, Calendar, User, Droplet, Phone } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const RequestHistory = () => {
  const { toast } = useToast();
  const [bloodRequests, setBloodRequests] = useState([]);
  const [donorRequests, setDonorRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/requests/history");
        setBloodRequests(response.data.blood_requests);
        setDonorRequests(response.data.donor_requests);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch request history",
          variant: "destructive"
        });
      }
    };
    fetchRequests();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="outline" className="text-success border-success">Approved</Badge>;
      case "refused":
        return <Badge variant="outline" className="text-destructive border-destructive">Refused</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Request History
          </CardTitle>
          <CardDescription>
            View history of all blood and donor validation requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="blood" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="blood">Blood Requests</TabsTrigger>
              <TabsTrigger value="donor">Donor Validation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="blood">
              <Card>
                <CardContent className="pt-6">
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {bloodRequests.map((request, index) => (
                        <div key={request.id}>
                          <div className="flex items-start justify-between p-4 border rounded-lg">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <Heart className="h-4 w-4 text-primary" />
                                <span className="font-medium">{request.id}</span>
                                {getStatusBadge(request.status)}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>{new Date(request.requested_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span>{request.patient_name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Droplet className="h-4 w-4 text-muted-foreground" />
                                  <span>Requested: {request.blood_group}</span>
                                </div>
                                {request.received_blood_group && (
                                  <div className="flex items-center gap-2">
                                    <Droplet className="h-4 w-4 text-muted-foreground" />
                                    <span>Received: {request.received_blood_group}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {index < bloodRequests.length - 1 && <Separator className="my-4" />}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="donor">
              <Card>
                <CardContent className="pt-6">
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {donorRequests.map((request, index) => (
                        <div key={request.id}>
                          <div className="flex items-start justify-between p-4 border rounded-lg">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <UserPlus className="h-4 w-4 text-primary" />
                                <span className="font-medium">{request.id}</span>
                                {getStatusBadge(request.status)}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>{new Date(request.requested_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span>{request.donor_name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Droplet className="h-4 w-4 text-muted-foreground" />
                                  <span>{request.blood_group} - {request.quantity}ml</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{request.contact}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {index < donorRequests.length - 1 && <Separator className="my-4" />}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestHistory;