import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MessageSquare, Calendar, Star, Mic, Send, Clock, User, Stethoscope, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

const PatientDashboard = () => {
  const [feedbackForm, setFeedbackForm] = useState({
    category: "",
    doctor: "",
    rating: 0,
    comment: "",
    isRecording: false
  });
  const [activeTab, setActiveTab] = useState("submit");
  const { toast } = useToast();

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

  const handleContactSupport = () => {
    toast({
      title: "Support Message Sent",
      description: "Our support team will respond within 24 hours.",
    });
  };

  return (
    <DashboardLayout userRole="patient" userName="John Doe">
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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Feedback</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
                  <p className="text-2xl font-bold">3</p>
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
                  <p className="text-2xl font-bold">4.5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <div className="space-y-6">
          <div className="flex space-x-4 border-b">
            <Button
              variant={activeTab === "submit" ? "default" : "ghost"}
              onClick={() => setActiveTab("submit")}
            >
              Submit Feedback
            </Button>
            <Button
              variant={activeTab === "history" ? "default" : "ghost"}
              onClick={() => setActiveTab("history")}
            >
              Feedback History
            </Button>
            <Button
              variant={activeTab === "support" ? "default" : "ghost"}
              onClick={() => setActiveTab("support")}
            >
              Contact Support
            </Button>
          </div>

          {/* Submit Feedback Tab */}
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
    </DashboardLayout>
  );
};

export default PatientDashboard;