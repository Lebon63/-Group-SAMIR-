import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

export default function SettingsPage() {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [historyEnabled, setHistoryEnabled] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState("normal");
  const [theme, setTheme] = useState("system");

  const handleClearHistory = () => {
    // In a real app, this would clear the conversation history
    toast.success("Conversation history has been cleared");
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-blue-600 to-orange-500 bg-clip-text text-transparent">
        {t.settingsTitle}
      </h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Accessibility</CardTitle>
            <CardDescription>Manage your accessibility preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="voice-enabled">Voice Input</Label>
                <p className="text-sm text-muted-foreground">Enable speech recognition for input</p>
              </div>
              <Switch 
                id="voice-enabled" 
                checked={voiceEnabled} 
                onCheckedChange={setVoiceEnabled} 
              />
            </div>

            <div className="space-y-2">
              <Label>Voice Speed</Label>
              <RadioGroup 
                value={voiceSpeed} 
                onValueChange={setVoiceSpeed}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="slow" id="slow" />
                  <Label htmlFor="slow">Slow</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="normal" />
                  <Label htmlFor="normal">Normal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fast" id="fast" />
                  <Label htmlFor="fast">Fast</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <RadioGroup 
                value={theme} 
                onValueChange={setTheme}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">System</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
            <CardDescription>Manage your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="save-history">Save Chat History</Label>
                <p className="text-sm text-muted-foreground">Store your conversations locally</p>
              </div>
              <Switch 
                id="save-history" 
                checked={historyEnabled} 
                onCheckedChange={setHistoryEnabled} 
              />
            </div>

            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleClearHistory}
            >
              Clear Conversation History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}