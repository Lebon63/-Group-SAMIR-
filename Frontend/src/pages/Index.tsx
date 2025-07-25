import React, { useState } from 'react';
import { LandingHero } from '@/components/LandingHero';
import { ChatInterface } from '@/components/ChatInterface';
import { AuthGuard } from '@/components/AuthGuard';

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  return showChat ? (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-medical-light to-accent/30 p-4">
        <ChatInterface className="h-[calc(100vh-2rem)]" />
      </div>
    </AuthGuard>
  ) : (
    <LandingHero onStartChat={() => setShowChat(true)} />
  );
};

export default Index;
