import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Heart, MessageSquare, Calendar, Star, Mic, Send, Clock, User,
  Phone, History, Pill, Headphones, Menu, X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { useTranslation } from "@/context/TranslationContext";

interface FeedbackForm {
  category: string;
  additionalCategories: { id: number; name: string }[];
  doctor: string;
  rating: number;
  comment: string;
  isRecording: boolean;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

interface Feedback {
  id: string;
  date: string;
  category: string;
  doctor: string;
  rating: number;
  comment: string;
  status: string;
}

interface Category {
  id: number;
  name: string;
}

const PatientDashboard = () => {
  const { translate } = useTranslation();
  const [activeTab, setActiveTab] = useState("submit");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm>({
    category: "",
    additionalCategories: [],
    doctor: "",
    rating: 0,
    comment: "",
    isRecording: false
  });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [feedbackHistory, setFeedbackHistory] = useState<Feedback[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [userName, setUserName] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

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

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/feedback/feedback_categories`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            "Accept": "application/json"
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch categories: ${errorData.detail || response.statusText}`);
        }
        const data = await response.json();
        setCategories(data.map((cat: any) => ({
          id: cat.id,
          name: cat.name
        })));
      } catch (error: any) {
        console.error("Fetch categories error:", error);
        toast({
          title: "Error",
          description: `Failed to load categories: ${error.message}`,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [toast, backendUrl]);

  // Fetch doctors by specialty
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!feedbackForm.category) return;
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/doctor?specialty=${encodeURIComponent(feedbackForm.category)}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            "Accept": "application/json"
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch doctors: ${errorData.detail || response.statusText}`);
        }
        const data = await response.json();
        setDoctors(data.map((doc: any) => ({
          id: doc.id.toString(),
          name: doc.name,
          specialty: doc.specialty
        })));
      } catch (error: any) {
        console.error("Fetch doctors error:", error);
        toast({
          title: "Error",
          description: `Failed to load doctors: ${error.message}`,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [feedbackForm.category, toast, backendUrl]);

  // Fetch feedback history
  useEffect(() => {
    const fetchFeedbackHistory = async () => {
      setLoading(true);
      try {
        // Default to "1" if patient_id not found in localStorage
        const patientId = localStorage.getItem("patient_id") || "1";
        // Store the patient ID for future use if it's not already there
        if (!localStorage.getItem("patient_id")) {
          localStorage.setItem("patient_id", patientId);
        }
        
        try {
          // Make request with proper patient_id parameter - ensuring we only get this patient's feedback
          const response = await fetch(`${backendUrl}/feedback?patient_id=${patientId}`, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
              "Accept": "application/json"
            }
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch feedback: ${response.statusText}`);
          }
          
          const data = await response.json();
          
          // Store the patientId-specific feedback key for better data isolation
          const storageKey = `feedbackHistory_${patientId}`;
          localStorage.setItem(storageKey, JSON.stringify(data));
          
          setFeedbackHistory(data.map((fb: any) => ({
            id: fb.id.toString(),
            date: fb.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
            category: fb.category?.name || "N/A",
            doctor: fb.doctor?.name || "Unknown",
            rating: fb.rating || 0,
            comment: fb.comment || "No comment",
            status: fb.rating >= 4 ? "Reviewed" : "Pending"
          })));
        } catch (error) {
          console.warn("API request failed, checking localStorage for cached data");
          // Try to load from localStorage if API fails - using patient-specific key
          const storageKey = `feedbackHistory_${patientId}`;
          const savedFeedback = localStorage.getItem(storageKey);
          
          if (savedFeedback) {
            const parsedFeedback = JSON.parse(savedFeedback);
            setFeedbackHistory(parsedFeedback.map((fb: any) => ({
              id: fb.id.toString(),
              date: fb.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
              category: fb.category?.name || "N/A",
              doctor: fb.doctor?.name || "Unknown",
              rating: fb.rating || 0,
              comment: fb.comment || "No comment",
              status: fb.rating >= 4 ? "Reviewed" : "Pending"
            })));
          } else {
            // If we have no cached data for this specific patient, start with empty array
            setFeedbackHistory([]);
          }
        }
      } catch (error: any) {
        console.error("Fetch feedback history error:", error);
        // Don't show toast for this error as it might be expected during initial setup
        setFeedbackHistory([]); // Set empty array instead of showing error
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbackHistory();
  }, [toast, backendUrl]);

  const staticCategories = [
    { value: "Cardiology", label: "Cardiology" },
    { value: "Neurology", label: "Neurology" },
    { value: "Pediatrics", label: "Pediatrics" },
    { value: "Orthopedics", label: "Orthopedics" },
    { value: "General Medicine", label: "General Medicine" },
    { value: "Surgery", label: "Surgery" }
  ];

  // Initialize with default medications
  const [medications, setMedications] = useState([
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
  ]);

  // Fetch medications from the API
  useEffect(() => {
    const fetchMedications = async () => {
      // Get patient ID from localStorage
      const patientId = localStorage.getItem("patient_id");
      if (!patientId) return; // Exit if no patient ID
      
      setLoading(true);
      try {
        // Try to get medications from the API
        const response = await fetch(`${backendUrl}/medications?patient_id=${patientId}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            "Accept": "application/json"
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setMedications(data);
            // Store in localStorage with patient-specific key
            localStorage.setItem(`medications_${patientId}`, JSON.stringify(data));
          }
        } else {
          // Try to get cached medications if API fails
          const cachedMedications = localStorage.getItem(`medications_${patientId}`);
          if (cachedMedications) {
            setMedications(JSON.parse(cachedMedications));
          }
          // If no cached data, keep the default medications
        }
      } catch (error) {
        console.error("Error fetching medications:", error);
        // Try to load from localStorage if API throws error
        const cachedMedications = localStorage.getItem(`medications_${patientId}`);
        if (cachedMedications) {
          setMedications(JSON.parse(cachedMedications));
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedications();
  }, [backendUrl]);

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
    const isCurrentlyRecording = feedbackForm.isRecording;
    setFeedbackForm(prev => ({ ...prev, isRecording: !prev.isRecording }));
    
    if (!isCurrentlyRecording) {
      // Start recording
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        toast({
          title: "Speech Recognition Not Available",
          description: "Your browser doesn't support speech recognition. Try using Chrome, Edge, or Safari.",
          variant: "destructive"
        });
        setFeedbackForm(prev => ({ ...prev, isRecording: false }));
        return;
      }
      
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US'; // Default language
      recognition.continuous = true;
      recognition.interimResults = true;
      
      let finalTranscript = feedbackForm.comment;
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update comment with transcribed text
        setFeedbackForm(prev => ({ 
          ...prev, 
          comment: finalTranscript + interimTranscript 
        }));
      };
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        toast({
          title: "Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive"
        });
        setFeedbackForm(prev => ({ ...prev, isRecording: false }));
        recognition.stop();
      };
      
      recognition.onend = () => {
        if (feedbackForm.isRecording) {
          // If still in recording state but recognition ended, restart it
          recognition.start();
        }
      };
      
      // Start recognition
      recognition.start();
      
      // Store recognition instance in window to access it when stopping
      window.speechRecognition = recognition;
      
      toast({
        title: "Recording Started",
        description: "Speak your feedback now. Click again to stop recording."
      });
    } else {
      // Stop recording
      if (window.speechRecognition) {
        window.speechRecognition.stop();
        window.speechRecognition = null;
      }
      
      toast({
        title: "Recording Stopped",
        description: "Your speech has been converted to text."
      });
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = categories.find(cat => cat.id.toString() === categoryId);
    if (!selectedCategory) return;
    setFeedbackForm(prev => {
      if (prev.additionalCategories.some(cat => cat.id === selectedCategory.id)) {
        return {
          ...prev,
          additionalCategories: prev.additionalCategories.filter(cat => cat.id !== selectedCategory.id)
        };
      }
      return {
        ...prev,
        additionalCategories: [...prev.additionalCategories, selectedCategory]
      };
    });
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackForm.category || !feedbackForm.doctor || !feedbackForm.rating) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Medical Category, Doctor, Rating)",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Ensure we have a patient_id, default to "1" if not found
      const patientId = localStorage.getItem("patient_id") || "1";
      if (!localStorage.getItem("patient_id")) {
        localStorage.setItem("patient_id", patientId);
      }
      
      const token = localStorage.getItem("authToken");
      if (!token) {
        // For demo, create a mock token if not available
        localStorage.setItem("authToken", "demo-token");
      }

      // Find selected doctor to get the ID
      const selectedDoctor = doctors.find(doc => doc.name === feedbackForm.doctor);
      if (!selectedDoctor) {
        throw new Error("Selected doctor not found");
      }

      // Find selected category to get the ID
      let primaryCategoryId;
      const matchingCategory = categories.find(cat => cat.name === feedbackForm.category);
      if (matchingCategory) {
        primaryCategoryId = matchingCategory.id;
      } else {
        // If there's no exact match, use the first category or create a default ID
        primaryCategoryId = categories.length > 0 ? categories[0].id : 1;
      }

      // Create payload with the correct structure matching backend expectations
      const payload = {
        // Use patient_id as expected by the backend
        patient_id: parseInt(patientId),
        // Use doctor_id as expected by the backend
        doctor_id: parseInt(selectedDoctor.id),
        category_id: primaryCategoryId,
        rating: feedbackForm.rating,
        comment: feedbackForm.comment
      };

      console.log("Submitting feedback payload:", payload);
      
      const response = await fetch(`${backendUrl}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to submit feedback: ${errorData.detail || response.statusText} (Status: ${response.status})`);
      }
      
      const newFeedback = await response.json();
      console.log("Feedback submission successful:", newFeedback);

      setFeedbackHistory(prev => [
        ...prev,
        {
          id: newFeedback.id.toString(),
          date: new Date(newFeedback.created_at).toISOString().split("T")[0],
          category: categories.find(cat => cat.id === newFeedback.category_id)?.name || "N/A",
          doctor: selectedDoctor.name,
          rating: newFeedback.rating,
          comment: newFeedback.comment,
          status: newFeedback.rating >= 4 ? "Reviewed" : "Pending"
        }
      ]);

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback. It helps us improve our services."
      });

      setFeedbackForm({
        category: "",
        additionalCategories: [],
        doctor: "",
        rating: 0,
        comment: "",
        isRecording: false
      });

      // Also submit any additional categories if selected
      for (const additionalCategory of feedbackForm.additionalCategories) {
        try {
          const additionalPayload = {
            patient_id: parseInt(patientId),
            doctor_id: parseInt(selectedDoctor.id),
            category_id: additionalCategory.id,
            rating: feedbackForm.rating,
            comment: feedbackForm.comment
          };

          await fetch(`${backendUrl}/feedback`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json"
            },
            body: JSON.stringify(additionalPayload)
          });
        } catch (additionalError) {
          console.error("Additional category submission error:", additionalError);
          // Don't block the main flow for additional categories
        }
      }
    } catch (error: any) {
      console.error("Feedback submission error:", error);
      toast({
        title: "Error",
        description: `Failed to submit feedback: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const [reminders, setReminders] = useState([
    {
      id: 1,
      medication: "Paracetamol",
      time: "08:00",
      frequency: "Daily"
    },
    {
      id: 2,
      medication: "Ibuprofen",
      time: "07:00",
      frequency: "Every 6 hours"
    }
  ]);

  const [newReminder, setNewReminder] = useState({
    medication: "",
    time: "",
    frequency: ""
  });
  
  // Fetch patient reminders
  useEffect(() => {
    const fetchReminders = async () => {
      const patientId = localStorage.getItem("patient_id");
      if (!patientId) return;
      
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/reminders?patient_id=${patientId}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            "Accept": "application/json"
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch reminders: ${errorData.detail || response.statusText}`);
        }
        
        const data = await response.json();
        if (data && data.length > 0) {
          setReminders(data.map((reminder: any) => ({
            id: reminder.id,
            medication: reminder.medication,
            time: reminder.time,
            frequency: reminder.frequency
          })));
        }
      } catch (error: any) {
        console.error("Error fetching reminders:", error);
        // Don't show toast for this error as it's not critical
      } finally {
        setLoading(false);
      }
    };
    
    fetchReminders();
  }, [backendUrl]);

  const handleContactSupport = () => {
    toast({
      title: "Support Message Sent",
      description: "Our support team will respond within 24 hours."
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
    <DashboardLayout userRole="patient" userName={userName}>
      <div className="flex">
        <Button
          variant="ghost"
          className="md:hidden fixed top-20 left-4 z-50 p-2 rounded-full shadow-md bg-white dark:bg-gray-800"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>

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

        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 transition-all duration-300">
          <div className="p-4 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{translate("Patient Dashboard")}</h1>
                  <p className="text-muted-foreground">{translate("Manage your healthcare feedback and appointments")}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-8 w-8 text-primary" />
                  <span className="text-lg font-semibold">DGH Care</span>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">{translate("Total Feedback")}</p>
                        <p className="text-2xl font-bold">{feedbackHistory.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-8 w-8 text-secondary" />
                      <div>
                        <p className="text-sm text-muted-foreground">{translate("Upcoming Appointments")}</p>
                        <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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

              {activeTab === "submit" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5" />
                      <span>{translate("Submit Feedback")}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{translate("Medical Department")}</label>
                        <Select onValueChange={(value) => setFeedbackForm(prev => ({ ...prev, category: value, doctor: "" }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {staticCategories.map(cat => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">{translate("Feedback Category")}</label>
                        <Select onValueChange={handleCategoryChange} disabled={loading}>
                          <SelectTrigger>
                            <SelectValue placeholder={loading ? "Loading categories..." : "Select categories"} />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat.id} value={cat.id.toString()}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {feedbackForm.additionalCategories.map(cat => (
                            <Badge
                              key={cat.id}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {cat.name}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0"
                                onClick={() => handleCategoryChange(cat.id.toString())}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Doctor</label>
                        <Select
                          onValueChange={(value) => setFeedbackForm(prev => ({ ...prev, doctor: value }))}
                          disabled={!feedbackForm.category || loading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={loading ? "Loading doctors..." : "Select doctor"} />
                          </SelectTrigger>
                          <SelectContent>
                            {doctors.map(doctor => (
                              <SelectItem key={doctor.id} value={doctor.name}>
                                {doctor.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">{translate("Rating")}</label>
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
                        <label className="text-sm font-medium">{translate("Comments")}</label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleVoiceRecording}
                          className={feedbackForm.isRecording ? "text-destructive border-destructive" : ""}
                          disabled={loading}
                        >
                          <Mic className="h-4 w-4 mr-2" />
                          {feedbackForm.isRecording ? translate("Stop Recording") : translate("Voice Input")}
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Share your experience with the doctor and hospital services..."
                        value={feedbackForm.comment}
                        onChange={(e) => setFeedbackForm(prev => ({ ...prev, comment: e.target.value }))}
                        rows={4}
                        disabled={loading}
                      />
                    </div>

                    <Button onClick={handleSubmitFeedback} variant="healthcare" className="w-full" disabled={loading}>
                      <Send className="h-4 w-4 mr-2" />
                      {translate("Submit Feedback")}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === "history" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Feedback History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {feedbackHistory.length > 0 ? (
                        feedbackHistory.map(feedback => (
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
                        ))
                      ) : (
                        <p className="text-muted-foreground">No feedback history available.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

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

              {activeTab === "reminders" && (
                <div className="space-y-6">
                  <Card data-testid="add-reminder-section">
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
                        onClick={async () => {
                          if (!newReminder.medication || !newReminder.time || !newReminder.frequency) {
                            toast({
                              title: "Missing Fields",
                              description: "Please fill out all fields.",
                              variant: "destructive"
                            });
                            return;
                          }
                          
                          const patientId = localStorage.getItem("patient_id");
                          if (!patientId) {
                            toast({
                              title: "Authentication Error",
                              description: "You must be logged in to create reminders.",
                              variant: "destructive"
                            });
                            return;
                          }
                          
                          setLoading(true);
                          try {
                            // Format time for API
                            const timeFormatted = newReminder.time;
                            
                            const response = await fetch(`${backendUrl}/reminders`, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                                "Accept": "application/json"
                              },
                              body: JSON.stringify({
                                patient_id: parseInt(patientId),
                                medication: newReminder.medication,
                                time: timeFormatted,
                                frequency: newReminder.frequency
                              })
                            });
                            
                            if (!response.ok) {
                              const errorData = await response.json();
                              throw new Error(`Failed to create reminder: ${errorData.detail || response.statusText}`);
                            }
                            
                            const newEntry = await response.json();
                            
                            setReminders(prev => [...prev, {
                              id: newEntry.id,
                              medication: newEntry.medication,
                              time: newEntry.time,
                              frequency: newEntry.frequency
                            }]);
                            
                            setNewReminder({ medication: "", time: "", frequency: "" });
                            toast({ 
                              title: "Reminder Added", 
                              description: "A SMS reminder will be sent to your registered phone number."
                            });
                          } catch (error: any) {
                            console.error("Error creating reminder:", error);
                            toast({
                              title: "Error",
                              description: `Failed to create reminder: ${error.message}`,
                              variant: "destructive"
                            });
                            
                            // Fallback to local storage if API fails
                            const newEntry = {
                              id: Date.now(),
                              ...newReminder
                            };
                            setReminders(prev => [...prev, newEntry]);
                            setNewReminder({ medication: "", time: "", frequency: "" });
                            toast({ 
                              title: "Reminder Added Locally", 
                              description: "The reminder was saved locally as the server is unavailable."
                            });
                          } finally {
                            setLoading(false);
                          }
                        }}
                        variant="healthcare"
                        disabled={loading}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Save Reminder {loading && "(Sending...)"}
                      </Button>
                    </CardContent>
                  </Card>

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
                              onClick={() => {
                                setNewReminder({
                                  medication: reminder.medication,
                                  time: reminder.time,
                                  frequency: reminder.frequency
                                });
                                // Scroll to add reminder section
                                document.querySelector('[data-testid="add-reminder-section"]')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={async () => {
                                try {
                                  // First try deleting from API
                                  const response = await fetch(`${backendUrl}/reminders/${reminder.id}`, {
                                    method: "DELETE",
                                    headers: {
                                      "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                                      "Accept": "application/json"
                                    }
                                  });
                                  
                                  if (!response.ok) {
                                    throw new Error("Failed to delete reminder");
                                  }
                                  
                                  // Remove from state
                                  setReminders(prev => prev.filter(r => r.id !== reminder.id));
                                  toast({ title: "Reminder Deleted" });
                                } catch (error) {
                                  console.error("Error deleting reminder:", error);
                                  // Fallback to local state only
                                  setReminders(prev => prev.filter(r => r.id !== reminder.id));
                                  toast({ 
                                    title: "Reminder Deleted Locally",
                                    description: "The reminder was removed locally. Server sync failed."
                                  });
                                }
                              }}
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