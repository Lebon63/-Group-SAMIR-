import { useState } from 'react';
import ChatHeader from './chat-header';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am MediAssist, your healthcare assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);

  const addMessage = (content: string, role: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, newMessage]);
    
    // Simulate assistant response
    if (role === 'user') {
      setTimeout(() => {
        const responses = [
          "I understand your concern. Based on your symptoms, it could be a number of things. I'd recommend consulting with your doctor for a proper diagnosis.",
          "That's a good question. The recommended dosage depends on several factors including your age, weight, and medical history.",
          "Regular exercise and a balanced diet are key components of a healthy lifestyle. Would you like some specific recommendations?",
          "I'd be happy to explain that medical term. It refers to...",
          "Your symptoms might indicate a common condition. Here's some information that might help you understand it better."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        addMessage(randomResponse, 'assistant');
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader />
      <ChatMessages messages={messages} />
      <ChatInput onSendMessage={(content) => addMessage(content, 'user')} />
    </div>
  );
}