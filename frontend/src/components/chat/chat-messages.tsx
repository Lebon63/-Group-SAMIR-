import { useEffect, useRef } from 'react';
import { Message } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
  error?: string | null;
}

export default function ChatMessages({ messages, isLoading, error }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-2 max-w-md">
            <div className="h-12 w-12 rounded-full bg-primary/20 mx-auto flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-6 w-6 text-primary"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium">Welcome to MediAssist</h3>
            <p className="text-muted-foreground text-sm">
              Ask me any health-related questions and I'll provide helpful information.
            </p>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card border border-border'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <div 
                className={`text-xs mt-2 ${
                  message.role === 'user' 
                    ? 'text-primary-foreground/70' 
                    : 'text-muted-foreground'
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))
      )}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg p-3 bg-muted border border-border shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 animate-pulse bg-primary/20 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="flex justify-center">
          <div className="max-w-[80%] rounded-lg p-3 bg-destructive/10 text-destructive border border-destructive/20">
            <p className="text-sm">Error: {error}</p>
            <p className="text-xs mt-1">Please try again or refresh the page.</p>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}