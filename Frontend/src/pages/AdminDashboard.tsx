// AdminDashboard.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  UserPlus, 
  BarChart3, 
  Download, 
  MessageSquare, 
  Calendar, 
  Star, 
  TrendingUp, 
  Search, 
  Filter,
  Menu,
  ClipboardList,
  Settings,
  Shield,
  X,
  Eye,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDoctorForm, setShowAddDoctorForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: "",
    email: "",
    password: "",
    status: "Active"
  });
  const { toast } = useToast();

  // Responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setSidebarOpen(!isMobileView);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const doctors = [
    { id: 1, name: "Dr. Pierre Nkomo", specialty: "Cardiology", email: "pierre.nkomo@dgh.cm", status: "Active", patients: 156, rating: 4.8 },
    { id: 2, name: "Dr. Sarah Mbarga", specialty: "Cardiology", email: "sarah.mbarga@dgh.cm", status: "Active", patients: 134, rating: 4.7 },
    { id: 3, name: "Dr. Jean Fofie", specialty: "Neurology", email: "jean.fofie@dgh.cm", status: "Active", patients: 98, rating: 4.9 },
    { id: 4, name: "Dr. Marie Ateba", specialty: "Neurology", email: "marie.ateba@dgh.cm", status: "Inactive", patients: 0, rating: 4.6 }
  ];

  const patients = [
    { id: 1, name: "Marie Ngono", email: "marie.ngono@email.cm", phone: "+237 677 123 456", registrationDate: "2024-01-10", status: "Active" },
    { id: 2, name: "Paul Biya", email: "paul.biya@email.cm", phone: "+237 677 234 567", registrationDate: "2024-01-08", status: "Active" },
    { id: 3, name: "Grace Mbarga", email: "grace.mbarga@email.cm", phone: "+237 677 345 678", registrationDate: "2024-01-05", status: "Inactive" }
  ];

  const feedbackAnalytics = {
    totalFeedback: 1247,
    averageRating: 4.6,
    positivePercentage: 87,
    responseTime: "2.3 hours",
    recentFeedback: [
      { id: 1, patient: "Marie Ngono", doctor: "Dr. Pierre Nkomo", rating: 5, comment: "Excellent service", date: "2024-01-15", sentiment: "positive" },
      { id: 2, patient: "Paul Biya", doctor: "Dr. Jean Fofie", rating: 4, comment: "Good consultation but waiting time was long", date: "2024-01-14", sentiment: "neutral" },
      { id: 3, patient: "Grace Mbarga", doctor: "Dr. Sarah Mbarga", rating: 5, comment: "Very professional", date: "2024-01-13", sentiment: "positive" }
    ]
  };

  const handleExportData = (type: string) => {
    toast({
      title: "Export Started",
      description: `${type} data is being exported to CSV format.`,
    });
  };

  const handleCreateDoctor = () => {
    setShowAddDoctorForm(true);
  };

  const handleSubmitNewDoctor = () => {
    // In a real app, you would send this data to your backend
    toast({
      title: "Doctor Account Created",
      description: "New doctor account has been created successfully.",
    });
    setShowAddDoctorForm(false);
    setNewDoctor({
      name: "",
      specialty: "",
      email: "",
      password: "",
      status: "Active"
    });
  };

  const handleDeactivateUser = (userType: string, userName: string) => {
    toast({
      title: "User Status Updated",
      description: `${userName} has been deactivated.`,
    });
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "doctors", label: "Manage Doctors", icon: <UserPlus className="h-4 w-4" /> },
    { id: "patients", label: "Manage Patients", icon: <Users className="h-4 w-4" /> },
    { id: "analytics", label: "Analytics", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "appointments", label: "All Appointments", icon: <Calendar className="h-4 w-4" /> },
    { id: "settings", label: "System Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <DashboardLayout userRole="admin" userName="Admin User">
      <div className="flex relative min-h-screen">
        {/* Mobile Toggle Button */}
        <Button
          variant="ghost"
          className="md:hidden fixed top-20 left-4 z-50 p-2 rounded-full shadow-md bg-white dark:bg-gray-800"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Sidebar Navigation */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          fixed md:sticky
          top-0
          w-64 h-full
          transition-transform duration-300 ease-in-out
          bg-background border-r
          z-40
          md:flex
        `}>
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-primary mr-2" />
              <span className="text-lg font-semibold">Admin Portal</span>
            </div>
            <div className="space-y-1 flex-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab(item.id);
                    if (isMobile) setSidebarOpen(false);
                  }}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 transition-all duration-300">
          <div className="p-4 md:p-8 pt-20 md:pt-8">
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                  <p className="text-muted-foreground">Hospital management and analytics overview</p>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2 border-success text-success">
                  System Administrator
                </Badge>
              </div>

              {/* Key Metrics  */}
              <div className="grid md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <Users className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Doctors</p>
                        <p className="text-2xl font-bold">24</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <Users className="h-8 w-8 text-secondary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Active Patients</p>
                        <p className="text-2xl font-bold">1,247</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-8 w-8 text-warning" />
                      <div>
                        <p className="text-sm text-muted-foreground">Feedback Received</p>
                        <p className="text-2xl font-bold">{feedbackAnalytics.totalFeedback}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-8 w-8 text-success" />
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Rating</p>
                        <p className="text-2xl font-bold">{feedbackAnalytics.averageRating}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tab Content */}
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Patient Feedback</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {feedbackAnalytics.recentFeedback.map(feedback => (
                            <div key={feedback.id} className="border rounded-lg p-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{feedback.patient}</span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <Star 
                                      key={star}
                                      className={`h-4 w-4 ${star <= feedback.rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`} 
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{feedback.comment}</p>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{feedback.doctor}</span>
                                <Badge variant={feedback.sentiment === "positive" ? "default" : "secondary"}>
                                  {feedback.sentiment}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>System Health</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>System Uptime</span>
                          <Badge variant="default">99.9%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Active Sessions</span>
                          <Badge variant="secondary">156</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>SMS Service</span>
                          <Badge variant="default">Operational</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Database Status</span>
                          <Badge variant="default">Healthy</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Doctors Management Tab */}
              {activeTab === "doctors" && (
                <div className="space-y-6">
                  {showAddDoctorForm && (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Add New Doctor</CardTitle>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setShowAddDoctorForm(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Full Name</label>
                              <Input 
                                placeholder="Dr. Full Name" 
                                value={newDoctor.name}
                                onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Specialty</label>
                              <Input 
                                placeholder="Cardiology" 
                                value={newDoctor.specialty}
                                onChange={(e) => setNewDoctor({...newDoctor, specialty: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Email</label>
                              <Input 
                                placeholder="doctor@hospital.cm" 
                                type="email"
                                value={newDoctor.email}
                                onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Password</label>
                              <div className="relative">
                                <Input 
                                  placeholder="Create a password" 
                                  type={showPassword ? "text" : "password"}
                                  value={newDoctor.password}
                                  onChange={(e) => setNewDoctor({...newDoctor, password: e.target.value})}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setShowAddDoctorForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            variant="healthcare"
                            onClick={handleSubmitNewDoctor}
                          >
                            Add Doctor
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Doctor Management</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Button onClick={handleCreateDoctor} variant="healthcare">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Doctor
                          </Button>
                          <Button onClick={() => handleExportData("Doctors")} variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Search doctors..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                          />
                        </div>
                        
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Specialty</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Patients</TableHead>
                              <TableHead>Rating</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {doctors.map(doctor => (
                              <TableRow key={doctor.id}>
                                <TableCell className="font-medium">{doctor.name}</TableCell>
                                <TableCell>{doctor.specialty}</TableCell>
                                <TableCell>{doctor.email}</TableCell>
                                <TableCell>{doctor.patients}</TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 fill-warning text-warning" />
                                    <span>{doctor.rating}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={doctor.status === "Active" ? "default" : "secondary"}>
                                    {doctor.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">Edit</Button>
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      onClick={() => handleDeactivateUser("doctor", doctor.name)}
                                    >
                                      Deactivate
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Patients Management Tab */}
              {activeTab === "patients" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Patient Management</CardTitle>
                      <Button onClick={() => handleExportData("Patients")} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Patient Data
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search patients..." className="max-w-sm" />
                        <Select>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Patients</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Registration Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {patients.map(patient => (
                            <TableRow key={patient.id}>
                              <TableCell className="font-medium">{patient.name}</TableCell>
                              <TableCell>{patient.email}</TableCell>
                              <TableCell>{patient.phone}</TableCell>
                              <TableCell>{patient.registrationDate}</TableCell>
                              <TableCell>
                                <Badge variant={patient.status === "Active" ? "default" : "secondary"}>
                                  {patient.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">View</Button>
                                  <Button variant="outline" size="sm">Reset Access</Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleDeactivateUser("patient", patient.name)}
                                  >
                                    Deactivate
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Analytics Tab */}
              {activeTab === "analytics" && (
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5" />
                        <span>Feedback Analytics</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                          <p className="text-2xl font-bold text-primary">{feedbackAnalytics.positivePercentage}%</p>
                          <p className="text-sm text-muted-foreground">Positive Feedback</p>
                        </div>
                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                          <p className="text-2xl font-bold text-secondary">{feedbackAnalytics.responseTime}</p>
                          <p className="text-sm text-muted-foreground">Avg Response Time</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Satisfaction Rate</span>
                          <span>{feedbackAnalytics.positivePercentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${feedbackAnalytics.positivePercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <Button onClick={() => handleExportData("Analytics")} variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Export Analytics Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Department Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Cardiology</span>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 fill-warning text-warning" />
                            <span>4.8</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Neurology</span>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 fill-warning text-warning" />
                            <span>4.7</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Pediatrics</span>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 fill-warning text-warning" />
                            <span>4.6</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>General Medicine</span>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 fill-warning text-warning" />
                            <span>4.5</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Appointments Tab */}
              {activeTab === "appointments" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5" />
                        <span>All Appointments</span>
                      </CardTitle>
                      <Button onClick={() => handleExportData("Appointments")} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Schedule
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
                      <p className="text-muted-foreground mb-4">
                        Comprehensive calendar view of all hospital appointments would be displayed here.
                      </p>
                      <Button variant="healthcare">
                        <Calendar className="h-4 w-4 mr-2" />
                        Load Calendar View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* System Settings Tab */}
              {activeTab === "settings" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>System Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Maintenance Mode and Notifications */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Maintenance Mode</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enabled">Enabled</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">System Notifications</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enabled">Enabled</SelectItem>
                            <SelectItem value="disabled">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Limits Settings */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Max Appointments Per Day</label>
                        <Input type="number" defaultValue={20} min={1} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Feedback SLA (hrs)</label>
                        <Input type="number" defaultValue={24} min={1} />
                      </div>
                    </div>

                    {/* Save Button */}
                    <Button
                      className="mt-4"
                      onClick={() =>
                        toast({
                          title: "Settings Updated",
                          description: "Your changes have been saved successfully.",
                        })
                      }
                    >
                      Save Settings
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;