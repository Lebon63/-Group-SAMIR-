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

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("feedback");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [patientFeedback, setPatientFeedback] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: "",
    date: "",
    time: "",
    description: "",
    status: "Pending"
  });
  const [medicationForm, setMedicationForm] = useState({
    patientName: "",
    medication: "",
    dosage: "",
    frequency: "",
    instructions: ""
  });
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [medicationSearch, setMedicationSearch] = useState("");
  const [feedbackFilter, setFeedbackFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [feedbackRes, appointmentsRes, medsRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/feedback/"),
          fetch("http://127.0.0.1:8000/appointments/"),
          fetch("http://127.0.0.1:8000/medications/")
        ]);
        if (!feedbackRes.ok) throw new Error(`Feedback fetch failed: ${feedbackRes.status}`);
        if (!appointmentsRes.ok) throw new Error(`Appointments fetch failed: ${appointmentsRes.status}`);
        if (!medsRes.ok) throw new Error(`Medications fetch failed: ${medsRes.status}`);
        const feedbackData = await feedbackRes.json();
        const appointmentsData = await appointmentsRes.json();
        const medsData = await medsRes.json();
        console.log("Fetched data:", { feedbackData, appointmentsData, medsData }); // Debug log
        setPatientFeedback(feedbackData || []);
        setUpcomingAppointments(appointmentsData || []);
        setMedications(medsData || []);
      } catch (error) {
        console.error("Fetch error:", error);
        toast({
          title: "Error",
          description: `Failed to fetch data. Error: ${error.message}`,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

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
    if (!appointmentForm.patientName || !appointmentForm.date || !appointmentForm.time || !appointmentForm.description || !appointmentForm.status) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        patient_name: appointmentForm.patientName,
        date: appointmentForm.date,
        time: appointmentForm.time,
        description: appointmentForm.description,
        status: appointmentForm.status
      };
      const response = await fetch("http://127.0.0.1:8000/appointments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create appointment");
      }
      const newAppointment = await response.json();
      setUpcomingAppointments(prev => [...prev, newAppointment]);
      toast({
        title: "Appointment Created",
        description: `Appointment scheduled for ${newAppointment.patient_name} on ${newAppointment.date}`
      });
      setAppointmentForm({ patientName: "", date: "", time: "", description: "", status: "Pending" });
    } catch (error) {
      console.error("Appointment creation error:", error);
      toast({
        title: "Error",
        description: `Failed to create appointment. Error: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = async () => {
    if (!medicationForm.patientName || !medicationForm.medication || !medicationForm.dosage || !medicationForm.frequency || !medicationForm.instructions) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        patient_name: medicationForm.patientName,
        medication: medicationForm.medication,
        dosage: medicationForm.dosage,
        frequency: medicationForm.frequency,
        instructions: medicationForm.instructions
      };
      const response = await fetch("http://127.0.0.1:8000/medications/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to add medication");
      }
      const newMedication = await response.json();
      setMedications(prev => [...prev, newMedication]);
      toast({
        title: "Medication Added",
        description: `Prescription added for ${newMedication.patient_name}`
      });
      setMedicationForm({ patientName: "", medication: "", dosage: "", frequency: "", instructions: "" });
    } catch (error) {
      console.error("Medication creation error:", error);
      toast({
        title: "Error",
        description: `Failed to add medication. Error: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactSupport = () => {
    toast({
      title: "Support Message Sent",
      description: "Our support team will respond within 24 hours.",
    });
  };

  const navItems = [
    { id: "feedback", label: "Patient Feedback", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "appointments", label: "Manage Appointments", icon: <CalendarIcon className="h-4 w-4" /> },
    { id: "medications", label: "Patient Medications", icon: <Pill className="h-4 w-4" /> },
    { id: "support", label: "Contact Support", icon: <Phone className="h-4 w-4" /> },
  ];

  // Filter feedback based on search and star rating
  const filteredFeedback = patientFeedback.filter(feedback =>
    feedback?.patient_name?.toLowerCase().includes(feedbackSearch.toLowerCase()) ||
    feedback?.comment?.toLowerCase().includes(feedbackSearch.toLowerCase())
  ).filter(feedback => {
    if (feedbackFilter === "all") return true;
    return feedback?.rating === parseInt(feedbackFilter);
  });

  // Group appointments by date
  const groupedAppointments = upcomingAppointments.reduce((groups, appointment) => {
    const date = appointment?.date;
    if (date && !groups[date]) groups[date] = [];
    if (date) groups[date].push(appointment);
    return groups;
  }, {});
  const appointmentDates = Object.keys(groupedAppointments).sort();

  // Group medications by patient name
  const groupedMedications = medications.reduce((groups, med) => {
    const patient = med?.patient_name;
    if (patient && !groups[patient]) groups[patient] = [];
    if (patient) groups[patient].push(med);
    return groups;
  }, {});
  const medicationPatients = Object.keys(groupedMedications).sort();

  // Filter appointments based on search term
  const filteredAppointments = appointmentDates.reduce((filtered, date) => {
    const appointmentsForDate = groupedAppointments[date]?.filter(appointment =>
      appointment?.patient_name?.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      appointment?.date?.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      appointment?.time?.toLowerCase().includes(appointmentSearch.toLowerCase())
    ) || [];
    if (appointmentsForDate.length > 0) filtered[date] = appointmentsForDate;
    return filtered;
  }, {});

  // Filter medications based on search term
  const filteredMedications = medicationPatients.reduce((filtered, patient) => {
    const medsForPatient = groupedMedications[patient]?.filter(med =>
      med?.patient_name?.toLowerCase().includes(medicationSearch.toLowerCase()) ||
      med?.medication?.toLowerCase().includes(medicationSearch.toLowerCase()) ||
      med?.dosage?.toLowerCase().includes(medicationSearch.toLowerCase())
    ) || [];
    if (medsForPatient.length > 0) filtered[patient] = medsForPatient;
    return filtered;
  }, {});

  return (
    <DashboardLayout userRole="doctor" userName="Dr. Pierre Nkomo">
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
                        <p className="text-2xl font-bold">{patientFeedback.filter(f => f?.status === "New").length}</p>
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
                        <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
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
                        <p className="text-2xl font-bold">
                          {patientFeedback.length > 0 ? (patientFeedback.reduce((sum, f) => sum + (f?.rating || 0), 0) / patientFeedback.length).toFixed(1) : "0.0"}
                        </p>
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
                        <p className="text-2xl font-bold">{[...new Set([...patientFeedback, ...upcomingAppointments, ...medications].map(item => item?.patient_name))].length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feedback Tab */}
              {activeTab === "feedback" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-3">
                          <MessageSquare className="h-5 w-5" />
                          <span>Patient Feedback - Cardiology</span>
                        </CardTitle>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search feedback..."
                              value={feedbackSearch}
                              onChange={(e) => setFeedbackSearch(e.target.value)}
                              className="w-64"
                            />
                          </div>
                          <Select value={feedbackFilter} onValueChange={setFeedbackFilter}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Filter by Stars" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Ratings</SelectItem>
                              <SelectItem value="5">5 Stars</SelectItem>
                              <SelectItem value="4">4 Stars</SelectItem>
                              <SelectItem value="3">3 Stars</SelectItem>
                              <SelectItem value="2">2 Stars</SelectItem>
                              <SelectItem value="1">1 Star</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="max-h-96 overflow-y-auto">
                      <div className="space-y-4">
                        {filteredFeedback.length > 0 ? (
                          filteredFeedback.map(feedback => (
                            <div key={feedback.id} className="border rounded-lg p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <User className="h-5 w-5 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium">{feedback.patient_name || "Unknown"}</p>
                                    <p className="text-sm text-muted-foreground">{feedback.category || "N/A"}</p>
                                  </div>
                                </div>
                                <div className="text-right space-y-2">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map(star => (
                                      <Star 
                                        key={star}
                                        className={`h-4 w-4 ${star <= (feedback.rating || 0) ? 'fill-warning text-warning' : 'text-muted-foreground'}`} 
                                      />
                                    ))}
                                  </div>
                                  <Badge variant={feedback.status === "New" ? "destructive" : "default"}>
                                    {feedback.status || "N/A"}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-muted-foreground">{feedback.comment || "No comment"}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>{feedback.created_at?.split("T")[0] || "N/A"}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No feedback available or failed to load.</p>
                        )}
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

                      <Button onClick={handleCreateAppointment} variant="healthcare" className="w-full" disabled={loading}>
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Create & Send SMS Reminder
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 mb-4">
                        <ClipboardList className="h-5 w-5" />
                        <span>Upcoming Appointments</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search appointments..."
                          value={appointmentSearch}
                          onChange={(e) => setAppointmentSearch(e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="max-h-96 overflow-y-auto">
                      {appointmentDates.length > 0 ? (
                        appointmentDates.map(date => (
                          filteredAppointments[date] && (
                            <div key={date} className="mb-4">
                              <h3 className="text-lg font-semibold mb-2">{date}</h3>
                              <div className="space-y-3">
                                {filteredAppointments[date].map(appointment => (
                                  <div key={appointment.id} className="border rounded-lg p-3 flex items-center justify-between">
                                    <div>
                                      <p className="font-medium">{appointment.patient_name || "Unknown"}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {appointment.time || "N/A"} - {appointment.description || "No description"}
                                      </p>
                                    </div>
                                    <Badge variant={appointment.status === "Confirmed" ? "default" : "secondary"}>
                                      {appointment.status || "N/A"}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        ))
                      ) : (
                        <p className="text-muted-foreground">No appointments available or failed to load.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Medication Tab */}
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

                    <Button onClick={handleAddMedication} variant="healthcare" className="w-full" disabled={loading}>
                      <Pill className="h-4 w-4 mr-2" />
                      Add Prescription & Set Reminders
                    </Button>

                    <CardTitle className="flex items-center space-x-2">
                      <Pill className="h-5 w-5" />
                      <span>Patient Medications</span>
                    </CardTitle>

                    <div className="flex items-center space-x-2 mb-4">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search medications..."
                        value={medicationSearch}
                        onChange={(e) => setMedicationSearch(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {medicationPatients.length > 0 ? (
                        medicationPatients.map(patient => (
                          filteredMedications[patient] && (
                            <div key={patient} className="mb-4">
                              <h3 className="text-lg font-semibold mb-2">{patient}</h3>
                              <div className="space-y-3">
                                {filteredMedications[patient].map(med => (
                                  <div key={med.id} className="border rounded-lg p-3">
                                    <p><strong>Medication:</strong> {med.medication || "N/A"}</p>
                                    <p><strong>Dosage:</strong> {med.dosage || "N/A"}</p>
                                    <p><strong>Frequency:</strong> {med.frequency || "N/A"}</p>
                                    <p><strong>Instructions:</strong> {med.instructions || "N/A"}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        ))
                      ) : (
                        <p className="text-muted-foreground">No medications available or failed to load.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Support Tab */}
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