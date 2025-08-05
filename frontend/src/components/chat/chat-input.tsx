import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSpeechToText } from '@/hooks/use-speech';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript,
    error,
    browserSupportsSpeechRecognition
  } = useSpeechToText();

  // Update message when transcript changes
  useEffect(() => {
    if (transcript) {
      setMessage(prev => prev + (prev ? ' ' : '') + transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="border-t p-4 bg-background">
      {error && (
        <div className="text-sm text-destructive mb-2">
          Voice recognition error: {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message or use voice input..."
          className="min-h-10 flex-1 resize-none"
        />
        
        {browserSupportsSpeechRecognition && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                onClick={toggleListening}
                className="flex-shrink-0"
              >
                <span className="sr-only">{isListening ? 'Stop recording' : 'Start recording'}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  {isListening ? (
                    <>
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="22"></line>
                    </>
                  ) : (
                    <>
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="22"></line>
                    </>
                  )}
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {isListening ? 'Stop voice input' : 'Start voice input'}
            </TooltipContent>
          </Tooltip>
        )}
        
        <Button type="submit" disabled={!message.trim()}>
          <span className="sr-only">Send message</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M22 2l-10 10"></path>
            <path d="M22 2l-10 10-10 10"></path>
            <path d="M2 22l10-10"></path>
          </svg>
        </Button>
      </form>
      {isListening && (
        <div className="text-sm text-primary mt-2 flex items-center">
          <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
          Listening... Speak now
        </div>
      )}
    </div>
  );
}