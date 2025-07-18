import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar as CalendarIcon, 
  Star, 
  User, 
  Clock, 
  Pill, 
  MessageSquare, 
  Plus, 
  Search, 
  Send, 
  Phone,
  Menu,
  ClipboardList,
  Stethoscope
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

interface Feedback {
  id: number;
  patient_name: string;
  created_at: string;
  rating: number;
  comment: string;
  category_name: string;
  status: string;
}

interface Appointment {
  id: number;
  patient_name: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("feedback");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: "",
    date: "",
    time: "",
    description: ""
  });
  const [medicationForm, setMedicationForm] = useState({
    patientName: "",
    medication: "",
    dosage: "",
    frequency: "",
    instructions: ""
  });
  const [patientFeedback, setPatientFeedback] = useState<Feedback[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    newFeedback: 0,
    todayAppointments: 0,
    averageRating: 0,
    activePatients: 0
  });
  const { toast } = useToast();

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        
        // Fetch feedback
        const feedbackRes = await fetch(`${backendUrl}/feedback`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        // Fetch appointments
        const appointmentsRes = await fetch(`${backendUrl}/appointments`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        // Fetch stats
        const statsRes = await fetch(`${backendUrl}/doctors/stats`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (!feedbackRes.ok || !appointmentsRes.ok || !statsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const feedbackData = await feedbackRes.json();
        const appointmentsData = await appointmentsRes.json();
        const statsData = await statsRes.json();

        setPatientFeedback(feedbackData);
        setUpcomingAppointments(appointmentsData);
        setStats({
          newFeedback: statsData.new_feedback,
          todayAppointments: statsData.today_appointments,
          averageRating: statsData.average_rating,
          activePatients: statsData.active_patients
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Error",
          description: "Failed to load data from server",
          variant: "destructive"
        });
      }
    };

    fetchData();
  }, [backendUrl, toast]);

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

  const handleCreateAppointment = async () => {
    if (!appointmentForm.patientName || !appointmentForm.date || !appointmentForm.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${backendUrl}/appointments`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          patient_name: appointmentForm.patientName,
          date: appointmentForm.date,
          time: appointmentForm.time,
          description: appointmentForm.description,
          type: "Consultation"
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create appointment");
      }

      toast({
        title: "Appointment Created",
        description: `Appointment scheduled for ${appointmentForm.patientName} on ${appointmentForm.date}`,
      });

      // Refresh appointments
      const updated = await fetch(`${backendUrl}/appointments`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await updated.json();
      setUpcomingAppointments(data);

      setAppointmentForm({
        patientName: "",
        date: "",
        time: "",
        description: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create appointment",
        variant: "destructive"
      });
    }
  };

  const handleAddMedication = async () => {
    if (!medicationForm.patientName || !medicationForm.medication) {
      toast({
        title: "Missing Information",
        description: "Please fill in patient name and medication",
        variant: "destructive"
      });
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${backendUrl}/medications`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          patient_name: medicationForm.patientName,
          medication: medicationForm.medication,
          dosage: medicationForm.dosage,
          frequency: medicationForm.frequency,
          instructions: medicationForm.instructions
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add medication");
      }

      toast({
        title: "Medication Added",
        description: `Prescription added for ${medicationForm.patientName}`,
      });

      setMedicationForm({
        patientName: "",
        medication: "",
        dosage: "",
        frequency: "",
        instructions: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add medication",
        variant: "destructive"
      });
    }
  };

  const handleContactSupport = () => {
    toast({
      title: "Support Message Sent",
      description: "Our support team will respond within 24 hours.",
    });
  };

  const handleMarkFeedbackAsReviewed = async (feedbackId: number) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${backendUrl}/feedback/${feedbackId}/reviewed`, {
        method: "PATCH",
        headers: { 
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to update feedback status");
      }

      // Refresh feedback
      const updated = await fetch(`${backendUrl}/feedback`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await updated.json();
      setPatientFeedback(data);

      toast({
        title: "Feedback Updated",
        description: "Feedback marked as reviewed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update feedback",
        variant: "destructive"
      });
    }
  };

  const navItems = [
    { id: "feedback", label: "Patient Feedback", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "appointments", label: "Manage Appointments", icon: <CalendarIcon className="h-4 w-4" /> },
    { id: "medications", label: "Patient Medications", icon: <Pill className="h-4 w-4" /> },
    { id: "support", label: "Contact Support", icon: <Phone className="h-4 w-4" /> },
  ];

  return (
    <DashboardLayout userRole="doctor" userName={localStorage.getItem('userName') || 'Doctor'}>
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
              <Stethoscope className="h-6 w-6 text-primary mr-2" />
              <span className="text-lg font-semibold">Doctor Portal</span>
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
                  <h1 className="text-3xl font-bold text-foreground">Doctor Dashboard</h1>
                  <p className="text-muted-foreground">Cardiology Department - Manage your patients and appointments</p>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  Cardiology Specialist
                </Badge>
              </div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">New Feedback</p>
                        <p className="text-2xl font-bold">{stats.newFeedback}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="h-8 w-8 text-secondary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Today's Appointments</p>
                        <p className="text-2xl font-bold">{stats.todayAppointments}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <Star className="h-8 w-8 text-warning" />
                      <div>
                        <p className="text-sm text-muted-foreground">Average Rating</p>
                        <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <User className="h-8 w-8 text-success" />
                      <div>
                        <p className="text-sm text-muted-foreground">Active Patients</p>
                        <p className="text-2xl font-bold">{stats.activePatients}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tab Content */}
              {/* Patient Feedback Tab */}
              {activeTab === "feedback" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Patient Feedback - Cardiology</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search feedback..." className="w-64" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {patientFeedback.map(feedback => (
                          <div key={feedback.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">{feedback.patient_name}</p>
                                  <p className="text-sm text-muted-foreground">{feedback.category_name}</p>
                                </div>
                              </div>
                              <div className="text-right space-y-2">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <Star 
                                      key={star}
                                      className={`h-4 w-4 ${star <= feedback.rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`} 
                                    />
                                  ))}
                                </div>
                                <Badge variant={feedback.status === "New" ? "destructive" : "default"}>
                                  {feedback.status}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-muted-foreground">{feedback.comment}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{new Date(feedback.created_at).toLocaleDateString()}</span>
                              </div>
                              {feedback.status === "New" && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleMarkFeedbackAsReviewed(feedback.id)}
                                >
                                  Mark as Reviewed
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Appointments Tab */}
              {activeTab === "appointments" && (
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Plus className="h-5 w-5" />
                        <span>Create New Appointment</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Patient Name</label>
                        <Input
                          value={appointmentForm.patientName}
                          onChange={(e) => setAppointmentForm(prev => ({ ...prev, patientName: e.target.value }))}
                          placeholder="Enter patient name"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Date</label>
                          <Input
                            type="date"
                            value={appointmentForm.date}
                            onChange={(e) => setAppointmentForm(prev => ({ ...prev, date: e.target.value }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Time</label>
                          <Input
                            type="time"
                            value={appointmentForm.time}
                            onChange={(e) => setAppointmentForm(prev => ({ ...prev, time: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={appointmentForm.description}
                          onChange={(e) => setAppointmentForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Appointment details..."
                          rows={3}
                        />
                      </div>

                      <Button onClick={handleCreateAppointment} variant="healthcare" className="w-full">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Create & Send SMS Reminder
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {upcomingAppointments.map(appointment => (
                          <div key={appointment.id} className="border rounded-lg p-3 flex items-center justify-between">
                            <div>
                              <p className="font-medium">{appointment.patient_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.date} at {appointment.time} - {appointment.type}
                              </p>
                            </div>
                            <Badge variant={appointment.status === "Confirmed" ? "default" : "secondary"}>
                              {appointment.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Medications Tab */}
              {activeTab === "medications" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Pill className="h-5 w-5" />
                      <span>Manage Patient Medications</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Patient Name</label>
                        <Input
                          value={medicationForm.patientName}
                          onChange={(e) => setMedicationForm(prev => ({ ...prev, patientName: e.target.value }))}
                          placeholder="Enter patient name"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Medication</label>
                        <Input
                          value={medicationForm.medication}
                          onChange={(e) => setMedicationForm(prev => ({ ...prev, medication: e.target.value }))}
                          placeholder="Enter medication name"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Dosage</label>
                        <Input
                          value={medicationForm.dosage}
                          onChange={(e) => setMedicationForm(prev => ({ ...prev, dosage: e.target.value }))}
                          placeholder="e.g., 500mg"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Frequency</label>
                        <Select onValueChange={(value) => setMedicationForm(prev => ({ ...prev, frequency: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="once-daily">Once daily</SelectItem>
                            <SelectItem value="twice-daily">Twice daily</SelectItem>
                            <SelectItem value="three-times">Three times daily</SelectItem>
                            <SelectItem value="as-needed">As needed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Special Instructions</label>
                      <Textarea
                        value={medicationForm.instructions}
                        onChange={(e) => setMedicationForm(prev => ({ ...prev, instructions: e.target.value }))}
                        placeholder="Additional instructions for the patient..."
                        rows={3}
                      />
                    </div>

                    <Button onClick={handleAddMedication} variant="healthcare" className="w-full">
                      <Pill className="h-4 w-4 mr-2" />
                      Add Prescription & Set Reminders
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Contact Support Tab */}
              {activeTab === "support" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Phone className="h-5 w-5" />
                      <span>Contact Support</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="p-4 bg-muted/30">
                        <div className="text-center space-y-2">
                          <Phone className="h-8 w-8 text-primary mx-auto" />
                          <h3 className="font-semibold">IT Support</h3>
                          <p className="text-muted-foreground">+237 233 40 10 01</p>
                        </div>
                      </Card>
                      
                      <Card className="p-4 bg-muted/30">
                        <div className="text-center space-y-2">
                          <MessageSquare className="h-8 w-8 text-secondary mx-auto" />
                          <h3 className="font-semibold">Medical Support</h3>
                          <p className="text-muted-foreground">medical@dghcare.cm</p>
                        </div>
                      </Card>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Message</label>
                        <Textarea
                          placeholder="Describe your technical issue or question..."
                          rows={5}
                        />
                      </div>
                      <Button onClick={handleContactSupport} variant="healthcare" className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
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

export default DoctorDashboard;