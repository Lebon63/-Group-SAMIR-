import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Brain, Activity, Users, Clock, BarChart3, ArrowRight, Heart } from "lucide-react";

const LandingPage = () => {
  const tracks = [
    {
      id: 1,
      title: "Patient Feedback & Reminder System",
      description: "Multilingual patient feedback interface with automated reminders and real-time hospital performance dashboard.",
      icon: MessageSquare,
      features: ["Multilingual Support", "Automated Reminders", "Real-time Dashboard", "Sentiment Analysis"],
      color: "healthcare",
      route: "/track1",
       link: "https://cerulean-sundae-b9837e.netlify.app/"
    },
    {
      id: 2,
      title: "AI Patient Education Assistant",
      description: "Large Language Model powered chatbot for enhanced patient education and diagnostic support.",
      icon: Brain,
      features: ["LLM Chatbot", "Medical Explanations", "Multilingual", "Clinical Validation"],
      color: "orange",
      route: "/track2",
      link: "https://statuesque-bienenstitch-849638.netlify.app/"
    },
    {
      id: 3,
      title: "AI Blood Bank Management",
      description: "AI-enhanced blood bank stock monitoring with demand forecasting and inventory optimization.",
      icon: Activity,
      features: ["Real-time Monitoring", "Demand Forecasting", "Inventory Optimization", "DHIS2 Integration"],
      color: "track",
      route: "/track3",
      link: "https://ai-bloodbank123.netlify.app/"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with logos */}
      <header className="bg-white border-b border-border shadow-soft">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <img 
                src="/images/b76d9432-da2f-4187-8999-63ed1c4341e8.png" 
                alt="APHRC Logo" 
                className="h-12 object-contain"
              />
              <img 
                src="/images/528f9fd0-a6a7-40d8-95ca-0ad1918dd9ef.png" 
                alt="Hôpital Général de Douala" 
                className="h-12 object-contain"
              />
              <img 
                src="/images/1a79d6c7-201e-4409-9a6c-20d485472999.png" 
                alt="Data Science Without Borders" 
                className="h-12 object-contain"
              />
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground"></p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-healthcare-orange rounded-full animate-pulse-slow delay-500"></div>
          <div className="absolute top-1/2 right-20 w-16 h-16 bg-healthcare-teal rounded-full animate-pulse-slow delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 mr-3 text-healthcare-orange" fill="currentColor" />
              <span className="text-lg font-medium">Douala HealthTech Forge</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-bounce-in">
              Co-creating AI Solutions for
              <span className="block text-healthcare-orange mt-2">
                Douala General Hospital
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-slide-up">
              Transforming healthcare through innovative AI-powered solutions designed for 
              Sub-Saharan Africa's healthcare challenges
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm animate-slide-up delay-200">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-healthcare-orange" />
                <span>Multilingual Support</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-healthcare-orange" />
                <span>Real-time Solutions</span>
              </div>
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-healthcare-orange" />
                <span>Data-Driven Insights</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Three Innovation Tracks
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Each track addresses critical healthcare challenges with AI-powered solutions 
              designed for immediate deployment at Douala General Hospital
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {tracks.map((track, index) => {
              const Icon = track.icon;
              return (
                <Card 
                  key={track.id} 
                  className="group hover:shadow-hover transition-all duration-300 hover:-translate-y-2 bg-white border-0 shadow-soft animate-slide-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      Track {track.id}
                    </CardTitle>
                    <CardDescription className="text-lg font-semibold text-healthcare-blue">
                      {track.title}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {track.description}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground text-sm uppercase tracking-wide">
                        Key Features
                      </h4>
                      <ul className="space-y-1">
                        {track.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-healthcare-orange rounded-full mr-3"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      variant={track.color as any}
                      className="w-full group/btn"
                      onClick={() => {
                        window.open(track.link, "_blank"); 
                      }}
                    >
                      Explore Track {track.id}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-healthcare-blue">3</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Innovation Tracks</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-healthcare-orange">AI</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Powered Solutions</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-healthcare-teal">5+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Languages Supported</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-healthcare-green">24/7</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">System Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Heart className="w-6 h-6 mr-2 text-healthcare-orange" fill="currentColor" />
              <span className="text-lg font-semibold">Douala HealthTech Forge</span>
            </div>
            <p className="text-primary-foreground/80 mb-4">
              Bridging healthcare gaps through innovative AI solutions
            </p>
            <div className="flex justify-center space-x-8 text-sm text-primary-foreground/60">
              <span>© 2025 African Population and Health Research Center</span>
              <span>•</span>
              <span>Data Science Without Borders</span>
              <span>•</span>
              <span>Hôpital Général de Douala</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;