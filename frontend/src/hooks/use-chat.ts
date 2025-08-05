import { useState, useEffect } from 'react';
import { Message, ChatSession } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

export function useChat() {
  const { language } = useLanguage();
  const [chatSession, setChatSession] = useState<ChatSession>(() => {
    const storedSession = localStorage.getItem('chat-session');
    if (storedSession) {
      return JSON.parse(storedSession);
    }
    
    return {
      id: crypto.randomUUID(),
      messages: [],
      title: 'MediAssist Chat',
      createdAt: Date.now(),
    };
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    localStorage.setItem('chat-session', JSON.stringify(chatSession));
  }, [chatSession]);
  
  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    
    setChatSession((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      title: prev.messages.length === 0 && message.role === 'user' 
        ? message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '')
        : prev.title,
    }));
    
    return newMessage;
  };
  
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    const userMessage = addMessage({
      role: 'user',
      content,
    });
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Make API call to the backend
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get response from the model');
      }
      
      const responseData = await response.json();
      
      // Apply language context if needed (you can integrate translation API here if required)
      let finalResponse = responseData.response;
      
      addMessage({
        role: 'assistant',
        content: finalResponse,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearChat = () => {
    setChatSession({
      id: crypto.randomUUID(),
      messages: [],
      title: 'MediAssist Chat',
      createdAt: Date.now(),
    });
  };
  
  return {
    messages: chatSession.messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}