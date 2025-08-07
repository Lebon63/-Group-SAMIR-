import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserCheck } from "lucide-react";
import axios from "axios";

const DonorValidationForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    donorName: "",
    donorAge: "",
    contact: "",
    bloodGroup: "",
    quantity: "",
    doctor_id: 1 // Static for now; replace with dynamic value later
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.donorName || !formData.donorAge || !formData.contact || !formData.bloodGroup || !formData.quantity) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/requests/donor", {
        ...formData,
        donor_age: parseInt(formData.donorAge),
        quantity: parseInt(formData.quantity)
      });
      toast({
        title: "Donor Validation Submitted",
        description: `Donor validation for ${formData.donorName} (${formData.bloodGroup}, ${formData.quantity}ml) has been sent to admin for approval.`
      });
      setFormData({
        donorName: "",
        donorAge: "",
        contact: "",
        bloodGroup: "",
        quantity: "",
        doctor_id: 1
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit donor validation",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="donor-name">Donor Name *</Label>
          <Input
            id="donor-name"
            type="text"
            placeholder="Enter donor full name"
            value={formData.donorName}
            onChange={(e) => setFormData(prev => ({ ...prev, donorName: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="donor-age">Donor Age *</Label>
          <Input
            id="donor-age"
            type="number"
            placeholder="Enter donor age"
            value={formData.donorAge}
            onChange={(e) => setFormData(prev => ({ ...prev, donorAge: e.target.value }))}
            min="18"
            max="65"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact">Contact Information *</Label>
          <Input
            id="contact"
            type="tel"
            placeholder="Enter phone number or email"
            value={formData.contact}
            onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="donor-blood-group">Blood Group *</Label>
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

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="quantity">Donation Quantity (ml) *</Label>
          <Input
            id="quantity"
            type="number"
            placeholder="Enter donation quantity in ml"
            value={formData.quantity}
            onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
            min="250"
            max="500"
            step="50"
            required
          />
          <p className="text-sm text-muted-foreground">
            Standard donation: 450ml (range: 250-500ml)
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="flex items-center gap-2">
          <UserCheck className="h-4 w-4" />
          Submit for Validation
        </Button>
      </div>
    </form>
  );
};

export default DonorValidationForm;