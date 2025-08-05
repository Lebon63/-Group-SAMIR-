import { Chat } from '@/components/chat';
import { useEffect } from 'react';

export default function ChatPage() {
  useEffect(() => {
    // Update page title
    document.title = 'MediAssist - Chat';
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Chat />
    </div>
  );
}