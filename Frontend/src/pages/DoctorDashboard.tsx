import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Star, User, Clock, Pill, MessageSquare, Plus, Search, Send, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("feedback");
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
  const { toast } = useToast();

  const patientFeedback = [
    {
      id: 1,
      patientName: "Marie Ngono",
      date: "2024-01-15",
      rating: 5,
      comment: "Dr. Nkomo was very professional and took time to explain my condition clearly.",
      category: "Cardiology",
      status: "New"
    },
    {
      id: 2,
      patientName: "Paul Biya",
      date: "2024-01-14",
      rating: 4,
      comment: "Good treatment but the appointment was delayed by 30 minutes.",
      category: "Cardiology",
      status: "Reviewed"
    },
    {
      id: 3,
      patientName: "Grace Mbarga",
      date: "2024-01-13",
      rating: 5,
      comment: "Excellent care, very satisfied with the service.",
      category: "Cardiology",
      status: "Reviewed"
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      patientName: "Jean Fofie",
      date: "2024-01-16",
      time: "09:00",
      type: "Follow-up",
      status: "Confirmed"
    },
    {
      id: 2,
      patientName: "Sarah Ateba",
      date: "2024-01-16",
      time: "10:30",
      type: "Consultation",
      status: "Pending"
    },
    {
      id: 3,
      patientName: "Michel Bessala",
      date: "2024-01-17",
      time: "14:00",
      type: "Check-up",
      status: "Confirmed"
    }
  ];

  const handleCreateAppointment = () => {
    if (!appointmentForm.patientName || !appointmentForm.date || !appointmentForm.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Appointment Created",
      description: `Appointment scheduled for ${appointmentForm.patientName} on ${appointmentForm.date}`,
    });

    // Send SMS reminder
    toast({
      title: "SMS Reminder Sent",
      description: `Appointment reminder sent to ${appointmentForm.patientName}`,
    });

    setAppointmentForm({
      patientName: "",
      date: "",
      time: "",
      description: ""
    });
  };

  const handleAddMedication = () => {
    if (!medicationForm.patientName || !medicationForm.medication) {
      toast({
        title: "Missing Information",
        description: "Please fill in patient name and medication",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Medication Added",
      description: `Prescription added for ${medicationForm.patientName}`,
    });

    // Send medication reminder
    toast({
      title: "Medication Reminder Set",
      description: `Automated reminders activated for ${medicationForm.patientName}`,
    });

    setMedicationForm({
      patientName: "",
      medication: "",
      dosage: "",
      frequency: "",
      instructions: ""
    });
  };

  const handleContactSupport = () => {
    toast({
      title: "Support Message Sent",
      description: "Our support team will respond within 24 hours.",
    });
  };

  return (
    <DashboardLayout userRole="doctor" userName="Dr. Pierre Nkomo">
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
                  <p className="text-2xl font-bold">3</p>
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
                  <p className="text-2xl font-bold">8</p>
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
                  <p className="text-2xl font-bold">4.8</p>
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
                  <p className="text-2xl font-bold">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <div className="space-y-6">
          <div className="flex space-x-4 border-b">
            <Button
              variant={activeTab === "feedback" ? "default" : "ghost"}
              onClick={() => setActiveTab("feedback")}
            >
              Patient Feedback
            </Button>
            <Button
              variant={activeTab === "appointments" ? "default" : "ghost"}
              onClick={() => setActiveTab("appointments")}
            >
              Manage Appointments
            </Button>
            <Button
              variant={activeTab === "medications" ? "default" : "ghost"}
              onClick={() => setActiveTab("medications")}
            >
              Patient Medications
            </Button>
            <Button
              variant={activeTab === "support" ? "default" : "ghost"}
              onClick={() => setActiveTab("support")}
            >
              Contact Support
            </Button>
          </div>

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
                              <p className="font-medium">{feedback.patientName}</p>
                              <p className="text-sm text-muted-foreground">{feedback.category}</p>
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
                            <span>{feedback.date}</span>
                          </div>
                          {feedback.status === "New" && (
                            <Button variant="outline" size="sm">
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
                          <p className="font-medium">{appointment.patientName}</p>
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
    </DashboardLayout>
  );
};

export default DoctorDashboard;