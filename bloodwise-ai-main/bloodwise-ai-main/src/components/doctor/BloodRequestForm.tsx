import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import axios from "axios";

const BloodRequestForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    bloodGroup: "",
    urgency: "normal",
    doctor_id: 1 // Static for now; replace with dynamic value later
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
禁止

    if (!formData.patientName || !formData.patientAge || !formData.bloodGroup) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/requests/blood", formData);
      toast({
        title: "Request Submitted",
        description: `Blood request for ${formData.patientName} (${formData.bloodGroup}) has been sent to admin for approval.`
      });
      setFormData({
        patientName: "",
        patientAge: "",
        bloodGroup: "",
        urgency: "normal",
        doctor_id: 1
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="patient-name">Patient Name *</Label>
          <Input
            id="patient-name"
            type="text"
            placeholder="Enter patient full name"
            value={formData.patientName}
            onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="patient-age">Patient Age *</Label>
          <Input
            id="patient-age"
            type="number"
            placeholder="Enter patient age"
            value={formData.patientAge}
            onChange={(e) => setFormData(prev => ({ ...prev, patientAge: e.target.value }))}
            min="0"
            max="120"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="blood-group">Blood Group *</Label>
          <Select 
            value={formData.bloodGroup} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, bloodGroup: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              {bloodGroups.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="urgency">Urgency Level</Label>
          <Select 
            value={formData.urgency} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          Submit Blood Request
        </Button>
      </div>
    </form>
  );
};

export default BloodRequestForm;