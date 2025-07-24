import React from 'react';
import { MessageCircle, Heart, Shield, Globe, Mic, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LandingHeroProps {
  onStartChat: () => void;
}

export function LandingHero({ onStartChat }: LandingHeroProps) {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Explanations",
      description: "Get complex medical information explained in simple, understandable terms"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multilingual Support",
      description: "Available in multiple languages to serve diverse patient populations"
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Voice & Text Input",
      description: "Speak or type your questions for maximum accessibility"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy & Security",
      description: "Your health information is protected with enterprise-grade security"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-medical-light to-accent/30">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mb-8 shadow-chat">
            <Heart className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Your Personal
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
              Health Assistant
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Get clear, compassionate explanations of your diagnoses, treatments, and medications. 
            Our AI assistant helps bridge the gap between complex medical information and patient understanding.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={onStartChat}
              size="lg"
              className="bg-primary hover:bg-primary-hover shadow-input text-lg px-8 py-6 transition-all transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Conversation
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6 border-primary/20 hover:bg-primary/5 transition-all"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 shadow-message hover:shadow-chat transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Medical Disclaimer */}
        <Card className="p-6 bg-medical-accent/10 border-l-4 border-medical-accent mb-12">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-medical-accent mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Important Medical Disclaimer</h3>
              <p className="text-sm text-foreground leading-relaxed">
                This AI assistant provides educational information only and is not a substitute for professional medical advice, 
                diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any 
                questions you may have regarding a medical condition. Never disregard professional medical advice or delay 
                seeking it because of something you have read here.
              </p>
            </div>
          </div>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">Trusted by healthcare professionals worldwide</p>
          <div className="flex justify-center items-center space-x-8 text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm">HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span className="text-sm">Patient-Centered</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span className="text-sm">Evidence-Based</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}