import React, { useState } from 'react';
import { LandingHero } from '@/components/LandingHero';
import { ChatInterface } from '@/components/ChatInterface';

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-medical-light to-accent/30 p-4">
        <ChatInterface className="h-[calc(100vh-2rem)]" />
      </div>
    );
  }

  return <LandingHero onStartChat={() => setShowChat(true)} />;
};

export default Index;
