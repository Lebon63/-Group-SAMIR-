import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  UserPlus, 
  User, 
  Mail, 
  Phone,
  Calendar,
  Activity,
  Search,
  Plus
} from "lucide-react";
import axios from "axios";

const DoctorManagement = () => {
  const { toast } = useToast();
  
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    registered_date: new Date().toISOString().split("T")[0]
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/donors/list");
        setDoctors(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch doctors",
          variant: "destructive"
        });
      }
    };
    fetchDoctors();
  }, []);

  const handleRegisterDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDoctor.name || !newDoctor.email || !newDoctor.department) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/donors/register", newDoctor);
      setDoctors([...doctors, { ...newDoctor, id: response.data.doctor_id, total_requests: 0, status: "active" }]);
      setNewDoctor({
        name: "",
        email: "",
        phone: "",
        department: "",
        registered_date: new Date().toISOString().split("T")[0]
      });
      toast({
        title: "Success",
        description: "Doctor registered successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register doctor",
        variant: "destructive"
      });
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Doctor Management
          </CardTitle>
          <CardDescription>
            Register new doctors and manage existing ones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegisterDoctor} className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newDoctor.email}
                  onChange={(e) => setNewDoctor(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={newDoctor.phone}
                  onChange={(e) => setNewDoctor(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  placeholder="Enter department"
                  value={newDoctor.department}
                  onChange={(e) => setNewDoctor(prev => ({ ...prev, department: e.target.value }))}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Register Doctor
            </Button>
          </form>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search doctors by name, email, or department"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {filteredDoctors.map((doctor, index) => (
                <div key={doctor.id}>
                  <div className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{doctor.name}</span>
                          <Badge
                            variant="outline"
                            className={doctor.status === "active" ? "text-success border-success" : ""}
                          >
                            {doctor.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">ID: {doctor.id}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{doctor.email}</span>
                      </div>
                      {doctor.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{doctor.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{doctor.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Registered: {doctor.registered_date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span>Total Requests: {doctor.total_requests}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredDoctors.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No doctors found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorManagement;