import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  UserPlus, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Calendar,
  Droplet,
  Phone,
  AlertCircle
} from "lucide-react";

const RequestManagement = () => {
  const { toast } = useToast();
  
  // Mock pending requests data
  const [bloodRequests, setBloodRequests] = useState([
    {
      id: "BR005",
      doctorName: "Dr. Smith",
      date: "2024-01-16",
      patientName: "Emily Johnson",
      patientAge: 28,
      bloodGroup: "A+",
      urgency: "urgent",
      status: "pending"
    },
    {
      id: "BR006",
      doctorName: "Dr. Wilson",
      date: "2024-01-16",
      patientName: "Michael Brown",
      patientAge: 45,
      bloodGroup: "O-",
      urgency: "emergency",
      status: "pending"
    },
    {
      id: "BR007",
      doctorName: "Dr. Davis",
      date: "2024-01-15",
      patientName: "Sarah Miller",
      patientAge: 32,
      bloodGroup: "B+",
      urgency: "normal",
      status: "pending"
    }
  ]);

  const [donorRequests, setDonorRequests] = useState([
    {
      id: "DR004",
      doctorName: "Dr. Johnson",
      date: "2024-01-16",
      donorName: "Robert Wilson",
      donorAge: 29,
      contact: "+1234567890",
      bloodGroup: "A+",
      quantity: 450,
      status: "pending"
    },
    {
      id: "DR005",
      doctorName: "Dr. Brown",
      date: "2024-01-15",
      donorName: "Lisa Anderson",
      donorAge: 34,
      contact: "lisa@example.com",
      bloodGroup: "O-",
      quantity: 400,
      status: "pending"
    }
  ]);

  const handleApproveBloodRequest = (requestId: string) => {
    setBloodRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: "approved" } : req
      )
    );
    toast({
      title: "Request Approved",
      description: `Blood request ${requestId} has been approved and inventory updated.`,
      variant: "default"
    });
  };

  const handleRefuseBloodRequest = (requestId: string) => {
    setBloodRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: "refused" } : req
      )
    );
    toast({
      title: "Request Refused",
      description: `Blood request ${requestId} has been refused.`,
      variant: "destructive"
    });
  };

  const handleApproveDonorRequest = (requestId: string) => {
    setDonorRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: "approved" } : req
      )
    );
    toast({
      title: "Donor Approved",
      description: `Donor validation ${requestId} has been approved and added to inventory.`,
      variant: "default"
    });
  };

  const handleRefuseDonorRequest = (requestId: string) => {
    setDonorRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: "refused" } : req
      )
    );
    toast({
      title: "Donor Refused",
      description: `Donor validation ${requestId} has been refused.`,
      variant: "destructive"
    });
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return <Badge className="bg-destructive text-destructive-foreground">Emergency</Badge>;
      case "urgent":
        return <Badge className="bg-warning text-warning-foreground">Urgent</Badge>;
      case "normal":
        return <Badge variant="secondary">Normal</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const pendingBloodRequests = bloodRequests.filter(req => req.status === "pending");
  const pendingDonorRequests = donorRequests.filter(req => req.status === "pending");

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Blood Requests</p>
                <p className="text-2xl font-bold">{pendingBloodRequests.length}</p>
              </div>
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Donor Requests</p>
                <p className="text-2xl font-bold">{pendingDonorRequests.length}</p>
              </div>
              <UserPlus className="h-8 w-8 text-blood-available" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emergency Requests</p>
                <p className="text-2xl font-bold text-destructive">
                  {pendingBloodRequests.filter(req => req.urgency === "emergency").length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Request Management Tabs */}
      <Tabs defaultValue="blood-requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="blood-requests" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Blood Requests ({pendingBloodRequests.length})
          </TabsTrigger>
          <TabsTrigger value="donor-requests" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Donor Requests ({pendingDonorRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blood-requests">
          <Card>
            <CardHeader>
              <CardTitle>Pending Blood Retrieval Requests</CardTitle>
              <CardDescription>
                Review and approve/refuse blood requests from doctors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {pendingBloodRequests.map((request, index) => (
                    <div key={request.id}>
                      <div className="p-4 border rounded-lg space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-primary" />
                              <span className="font-medium">{request.id}</span>
                              {getUrgencyBadge(request.urgency)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>Doctor: {request.doctorName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{request.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>Patient: {request.patientName} ({request.patientAge}y)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Droplet className="h-4 w-4 text-muted-foreground" />
                                <span>Blood Type: {request.bloodGroup}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => handleRefuseBloodRequest(request.id)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Refuse
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-success text-success-foreground hover:bg-success/90"
                              onClick={() => handleApproveBloodRequest(request.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </div>
                      {index < pendingBloodRequests.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                  
                  {pendingBloodRequests.length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No pending blood requests</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donor-requests">
          <Card>
            <CardHeader>
              <CardTitle>Pending Donor Validation Requests</CardTitle>
              <CardDescription>
                Review and approve/refuse donor validation requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {pendingDonorRequests.map((request, index) => (
                    <div key={request.id}>
                      <div className="p-4 border rounded-lg space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <UserPlus className="h-4 w-4 text-primary" />
                              <span className="font-medium">{request.id}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>Doctor: {request.doctorName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{request.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>Donor: {request.donorName} ({request.donorAge}y)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{request.contact}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Droplet className="h-4 w-4 text-muted-foreground" />
                                <span>{request.bloodGroup} - {request.quantity}ml</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => handleRefuseDonorRequest(request.id)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Refuse
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-success text-success-foreground hover:bg-success/90"
                              onClick={() => handleApproveDonorRequest(request.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </div>
                      {index < pendingDonorRequests.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                  
                  {pendingDonorRequests.length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No pending donor requests</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequestManagement;