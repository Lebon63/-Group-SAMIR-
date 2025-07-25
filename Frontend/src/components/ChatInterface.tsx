import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Globe, Heart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language?: string;
}

interface ChatInterfaceProps {
  className?: string;
}

export function ChatInterface({ className }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your patient support assistant. I'm here to help explain your diagnosis, treatments, and medications in simple terms. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'fu', name: 'Fufulde' },
    { code: 'pg', name: 'Pigin' },
  ];

  // Mock LLM response - replace with actual LLM integration
 const generateResponse = async (userMessage: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const message = userMessage.toLowerCase();

  if (message.includes('medication') || message.includes('pill')) {
    return "Your medication helps manage your condition. It's important to take it at the same time every day. Let me know the name of your medication for more details.";
  }

  if (message.includes('diagnosis') || message.includes('condition')) {
    return "Your diagnosis is the result of tests or symptoms you shared with your doctor. I can explain more if you tell me what condition you're referring to.";
  }

  if (message.includes('side effect')) {
    return "Common side effects include tiredness, nausea, or headaches. Let me know the specific drug you're concerned about.";
  }

  if (message.includes('treatment')) {
    return "Treatments are designed to manage or cure your condition. I can explain your treatment plan in simple terms. What treatment are you referring to?";
  }

  if (message.includes('blood pressure')) {
    return "Blood pressure measures the force of blood against your arteries. A normal reading is around 120/80. High blood pressure means the heart is working too hard.";
  }

  if (message.includes('diabetes')) {
    return "Diabetes affects how your body uses sugar. Managing it includes diet, exercise, and sometimes medication like insulin.";
  }

  if (message.includes('cancer')) {
    return "Cancer is when cells in the body grow out of control. Treatment options may include surgery, chemotherapy, or radiation depending on the type.";
  }

  if (message.includes('asthma')) {
    return "Asthma causes breathing problems due to inflamed airways. Inhalers help open the airways and make breathing easier.";
  }

  return "I'm here to help you understand medical information clearly. Please provide more specific questions about your health, medication, or treatment.";
};


  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await generateResponse(inputText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Sorry, I'm having trouble responding right now. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support voice input. Please type your message.",
      });
      return;
    }

    setIsListening(!isListening);
    
    if (!isListening) {
      // Start speech recognition (placeholder - implement actual speech recognition)
      toast({
        title: "Voice input started",
        description: "Speak now...",
      });
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`flex flex-col h-full max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-t-2xl shadow-chat">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-foreground rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-primary-foreground">Patient Support Assistant</h1>
              <p className="text-primary-foreground/80 text-sm">Explaining healthcare in simple terms</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
              <Shield className="w-3 h-3 mr-1" />
              Secure
            </Badge>
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-primary-foreground/20 text-primary-foreground text-sm rounded-md px-2 py-1 border-0"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code} className="text-foreground">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="bg-medical-accent/10 border-l-4 border-medical-accent p-4 m-4 rounded-r-lg">
        <p className="text-sm text-foreground">
          <strong>Medical Disclaimer:</strong> This AI assistant provides educational information only. 
          Always consult your healthcare provider for medical advice, diagnosis, or treatment decisions.
        </p>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <Card className={`max-w-xs md:max-w-md lg:max-w-lg p-4 shadow-message transition-all duration-300 ${
                message.isUser 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card'
              }`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
                <span className={`text-xs mt-2 block ${
                  message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </Card>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <Card className="p-4 bg-card max-w-xs">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-6 bg-gradient-to-r from-muted/50 to-accent/50 rounded-b-2xl">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about your diagnosis, treatment, or medications..."
              className="pr-12 shadow-input border-border/50 focus:border-primary transition-all"
              disabled={isTyping}
            />
            <Button
              onClick={toggleVoiceInput}
              variant="ghost"
              size="sm"
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${
                isListening ? 'text-destructive' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="bg-primary hover:bg-primary-hover shadow-input transition-all"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send • Click mic for voice input • Available in multiple languages
        </p>
      </div>
    </div>
  );
}