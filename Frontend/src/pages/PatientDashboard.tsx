// PatientDashboard.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Heart, MessageSquare, Calendar, Star, Mic, Send, Clock, User,
  Phone, History, Pill, Headphones, Menu
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

interface FeedbackForm {
  category: string;
  doctor: string;
  rating: number;
  comment: string;
  isRecording: boolean;
}

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("submit");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm>({
    category: "",
    doctor: "",
    rating: 0,
    comment: "",
    isRecording: false
  });
  const { toast } = useToast();

  useEffect(() => {
    
  const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setSidebarOpen(!isMobileView); // Always closed on mobile, open on desktop
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = [
    { value: "cardiology", label: "Cardiology" },
    { value: "neurology", label: "Neurology" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "orthopedics", label: "Orthopedics" },
    { value: "general", label: "General Medicine" },
    { value: "surgery", label: "Surgery" }
  ];

  const doctorsByCategory = {
    cardiology: ["Dr. Nkomo Pierre", "Dr. Mbarga Sarah"],
    neurology: ["Dr. Fofie Jean", "Dr. Ateba Marie"],
    pediatrics: ["Dr. Kamga Paul", "Dr. Ndongo Claire"],
    orthopedics: ["Dr. Bessala Michel", "Dr. Eko Lilia"],
    general: ["Dr. Biya Jacques", "Dr. Fouda Agnes"],
    surgery: ["Dr. Mvogo Robert", "Dr. Tchinda Nina"]
  };

  const feedbackHistory = [
    {
      id: 1,
      date: "2024-01-15",
      category: "Cardiology",
      doctor: "Dr. Nkomo Pierre",
      rating: 5,
      comment: "Excellent care and very professional",
      status: "Reviewed"
    },
    {
      id: 2,
      date: "2024-01-10",
      category: "General Medicine",
      doctor: "Dr. Biya Jacques",
      rating: 4,
      comment: "Good consultation, but waiting time was long",
      status: "Pending"
    }
  ];

  const medications = [
    {
      id: 1,
      medication: "Paracetamol",
      dosage: "500mg",
      frequency: "Twice a day",
      instructions: "Take after meals with a glass of water"
    },
    {
      id: 2,
      medication: "Amoxicillin",
      dosage: "250mg",
      frequency: "Three times a day",
      instructions: "Take every 8 hours; complete full course"
    },
    {
      id: 3,
      medication: "Ibuprofen",
      dosage: "400mg",
      frequency: "Once every 6 hours as needed",
      instructions: "Take with food to avoid stomach upset"
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      doctorName: "Jean Fofie",
      category: "Pediatrics",
      date: "2024-01-16",
      time: "09:00",
      type: "Follow-up",
      status: "Attended"
    },
    {
      id: 2,
      doctorName: "Sarah Ateba",
      category: "Cardiology",
      date: "2024-01-16",
      time: "10:30",
      type: "Consultation",
      status: "Pending"
    },
    {
      id: 3,
      doctorName: "Michel Bessala",
      category: "General Medicine",
      date: "2024-01-17",
      time: "14:00",
      type: "Check-up",
      status: "Attended"
    }
  ];

  const handleRatingChange = (rating: number) => {
    setFeedbackForm(prev => ({ ...prev, rating }));
  };

  const handleVoiceRecording = () => {
    setFeedbackForm(prev => ({ ...prev, isRecording: !prev.isRecording }));
    toast({
      title: feedbackForm.isRecording ? "Recording stopped" : "Recording started",
      description: feedbackForm.isRecording ? "Processing voice input..." : "Speak your feedback now"
    });
  };

  const handleSubmitFeedback = () => {
    if (!feedbackForm.category || !feedbackForm.doctor || !feedbackForm.rating) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback. It helps us improve our services.",
    });

    setFeedbackForm({
      category: "",
      doctor: "",
      rating: 0,
      comment: "",
      isRecording: false
    });
  };

  const [reminders, setReminders] = useState([
  {
    id: 1,
    medication: "Paracetamol",
    time: "08:00 AM",
    frequency: "Daily"
  },
  {
    id: 1,
    medication: "Ibuprofen",
    time: "07:00 AM",
    frequency: "Every 6 hours"
  }
]);
const [newReminder, setNewReminder] = useState({ 
  medication: "", 
  time: "", 
  frequency: "" 
});


  const handleContactSupport = () => {
    toast({
      title: "Support Message Sent",
      description: "Our support team will respond within 24 hours.",
    });
  };

  const navItems = [
    { id: "submit", label: "Submit Feedback", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "history", label: "Feedback History", icon: <History className="h-4 w-4" /> },
    { id: "appointments", label: "Appointments", icon: <Calendar className="h-4 w-4" /> },
    { id: "medications", label: "Medication", icon: <Pill className="h-4 w-4" /> },
    { id: "reminders", label: "Reminder", icon: <Clock className="h-4 w-4" /> },
    { id: "support", label: "Contact Support", icon: <Headphones className="h-4 w-4" /> },
  ];

  return (
    <DashboardLayout userRole="patient" userName="John Doe">
      <div className="flex">
        {/* Mobile Toggle Button */}
        <Button
          variant="ghost"
          className="md:hidden fixed top-20 left-4 z-50 p-2 rounded-full shadow-md bg-white dark:bg-gray-800"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Sidebar Navigation */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
          fixed md:sticky
          top-0
          w-64 h-full
          transition-transform duration-300 ease-in-out
          bg-background border-r
          z-40
        `}>
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center mb-6 ">
              <Heart className="h-6 w-6 text-primary mr-2" />
              <span className="text-lg font-semibold">Patient Portal</span>
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
          <div className="p-4 md:p-8">
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Patient Dashboard</h1>
                  <p className="text-muted-foreground">Manage your healthcare feedback and appointments</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-8 w-8 text-primary" />
                  <span className="text-lg font-semibold">DGH Care</span>
                </div>
              </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
  {/* Total Feedback */}
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center space-x-3">
        <MessageSquare className="h-8 w-8 text-primary" />
        <div>
          <p className="text-sm text-muted-foreground">Total Feedback</p>
          <p className="text-2xl font-bold">{feedbackHistory.length}</p>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Upcoming Appointments */}
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center space-x-3">
        <Calendar className="h-8 w-8 text-secondary" />
        <div>
          <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
          <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Medications */}
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center space-x-3">
        <Pill className="h-8 w-8 text-green-600" />
        <div>
          <p className="text-sm text-muted-foreground">Medications</p>
          <p className="text-2xl font-bold">{medications.length}</p>
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Reminders */}
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center space-x-3">
        <Clock className="h-8 w-8 text-blue-600" />
        <div>
          <p className="text-sm text-muted-foreground">Reminders</p>
          <p className="text-2xl font-bold">{reminders.length}</p>
        </div>
      </div>
    </CardContent>
  </Card>
</div>


            {/* Main Content */}
            {activeTab === "submit" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Submit Feedback</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Medical Category</label>
                    <Select onValueChange={(value) => setFeedbackForm(prev => ({ ...prev, category: value, doctor: "" }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Doctor</label>
                    <Select
                      onValueChange={(value) => setFeedbackForm(prev => ({ ...prev, doctor: value }))}
                      disabled={!feedbackForm.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {feedbackForm.category && doctorsByCategory[feedbackForm.category as keyof typeof doctorsByCategory]?.map(doctor => (
                          <SelectItem key={doctor} value={doctor}>
                            {doctor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Button
                        key={star}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRatingChange(star)}
                        className="p-1"
                      >
                        <Star
                          className={`h-6 w-6 ${star <= feedbackForm.rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`}
                        />
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Comments</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleVoiceRecording}
                      className={feedbackForm.isRecording ? "text-destructive border-destructive" : ""}
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      {feedbackForm.isRecording ? "Stop Recording" : "Voice Input"}
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Share your experience with the doctor and hospital services..."
                    value={feedbackForm.comment}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                  />
                </div>

                <Button onClick={handleSubmitFeedback} variant="healthcare" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Feedback History Tab */}
          {activeTab === "history" && (
            <Card>
              <CardHeader>
                <CardTitle>Feedback History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedbackHistory.map(feedback => (
                    <div key={feedback.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{feedback.doctor}</p>
                            <p className="text-sm text-muted-foreground">{feedback.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= feedback.rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`}
                              />
                            ))}
                          </div>
                          <Badge variant={feedback.status === "Reviewed" ? "default" : "secondary"}>
                            {feedback.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{feedback.comment}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{feedback.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appointments Tab */}
          {activeTab === "appointments" && (
            <div className="space-y-4">

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingAppointments.map(appointment => (
                      <div key={appointment.id} className="border rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium">Dr {appointment.doctorName} - {appointment.category}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.date} at {appointment.time} - {appointment.type}
                          </p>
                        </div>
                        <Badge variant={appointment.status === "Attended" ? "default" : "secondary"}>
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
            <div className="space-y-4">

              <Card>
                <CardHeader>
                  <CardTitle>Medications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {medications.map(medication => (
                      <div key={medication.id} className="border rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{medication.medication} - {medication.dosage}</p>
                          <p className="text-sm text-muted-foreground">
                            {medication.frequency} 
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {medication.instructions} 
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Reminder Tab */}
{activeTab === "reminders" && (
  <div className="space-y-6">
    {/* Add New Reminder Card */}
    <Card>
      <CardHeader>
        <CardTitle>Add Medication Reminder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Medication</label>
            <Input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter medication name"
              value={newReminder.medication}
              onChange={(e) => setNewReminder(prev => ({ ...prev, medication: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Time</label>
            <Input
              type="time"
              className="w-full border rounded px-3 py-2"
              value={newReminder.time}
              onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Frequency</label>
            <Select onValueChange={(value) => setNewReminder(prev => ({ ...prev, frequency: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once-daily">Once daily</SelectItem>
                        <SelectItem value="twice-daily">Twice daily</SelectItem>
                        <SelectItem value="three-times">Three times daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
          </div>
        </div>
        <Button
          onClick={() => {
            if (!newReminder.medication || !newReminder.time || !newReminder.frequency) {
              toast({
                title: "Missing Fields",
                description: "Please fill out all fields.",
                variant: "destructive"
              });
              return;
            }
            const newEntry = {
              id: Date.now(),
              ...newReminder
            };
            setReminders(prev => [...prev, newEntry]);
            setNewReminder({ medication: "", time: "", frequency: "" });
            toast({ title: "Reminder Added" });
          }}
          variant="healthcare"
        >
          <Send className="h-4 w-4 mr-2" />
          Save Reminder
        </Button>
      </CardContent>
    </Card>

    {/* Existing Reminders */}
    <Card>
      <CardHeader>
        <CardTitle>Existing Reminders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {reminders.length === 0 && <p className="text-muted-foreground">No reminders yet.</p>}
        {reminders.map(reminder => (
          <div key={reminder.id} className="border rounded px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold">{reminder.medication}</p>
              <p className="text-sm text-muted-foreground">
                {reminder.time} — {reminder.frequency}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
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
                      <h3 className="font-semibold">Emergency Hotline</h3>
                      <p className="text-muted-foreground">+237 233 40 10 00</p>
                    </div>
                  </Card>

                  <Card className="p-4 bg-muted/30">
                    <div className="text-center space-y-2">
                      <MessageSquare className="h-8 w-8 text-secondary mx-auto" />
                      <h3 className="font-semibold">General Support</h3>
                      <p className="text-muted-foreground">support@dghcare.cm</p>
                    </div>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      placeholder="Describe your issue or question..."
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

export default PatientDashboard;
