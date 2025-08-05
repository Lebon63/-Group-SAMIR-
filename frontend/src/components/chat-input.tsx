import { useState, FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon, Loader2, MessageSquare, Sparkles, HeartPulse, Mic, MicOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSpeechToText } from '@/hooks/use-speech';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const { translate } = useLanguage();
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript,
    error: speechError,
    browserSupportsSpeechRecognition
  } = useSpeechToText();

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {speechError && (
        <div className="text-xs text-destructive px-3">
          Voice recognition error: {speechError}
        </div>
      )}
      <div className="relative flex items-center">
        <div className="absolute left-3 top-3 text-blue-500">
          <div className="relative">
            <MessageSquare className="h-5 w-5" />
            {!isLoading && !input && (
              <Sparkles className="h-3 w-3 text-orange-500 absolute -top-1 -right-1" />
            )}
          </div>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={translate('inputPlaceholder')}
          className="min-h-24 resize-none pl-10 pr-24 focus-visible:ring-blue-500 focus-visible:ring-offset-1 border-blue-200 rounded-xl shadow-md transition-all duration-200 hover:border-blue-300"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        
        {/* Microphone button - always visible */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant={isListening ? "destructive" : "outline"}
              onClick={toggleListening}
              disabled={!browserSupportsSpeechRecognition || isLoading}
              className="absolute bottom-3 right-14 h-9 w-9 rounded-lg shadow-sm transition-all duration-200"
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isListening ? 'Stop voice input' : 'Start voice input'}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            {!browserSupportsSpeechRecognition 
              ? 'Voice input not supported in your browser' 
              : isListening ? 'Stop voice input' : 'Start voice input'}
          </TooltipContent>
        </Tooltip>
        
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading}
          className={`absolute bottom-3 right-3 text-white shadow-md rounded-lg h-9 w-9 transition-all duration-200 ${
            !input.trim() 
              ? 'bg-gray-300'
              : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:scale-105'
          }`}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendIcon className="h-4 w-4" />
          )}
          <span className="sr-only">{translate('sendMessage')}</span>
        </Button>
      </div>
      
      <div className="flex items-center justify-center">
        {isListening ? (
          <div className="text-xs px-2 py-1 rounded-full font-medium text-blue-700 bg-blue-50 border border-blue-100 animate-pulse flex items-center gap-1.5">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {translate('listeningNow')} 
          </div>
        ) : (
          <div className={`text-xs px-2 py-1 rounded-full font-medium transition-all duration-300 flex items-center gap-1.5 ${
            isLoading 
              ? 'text-blue-700 bg-blue-50 border border-blue-100 animate-pulse'
              : 'text-gray-600 bg-gray-50'
          }`}>
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> 
                {translate('thinking')}
              </>
            ) : (
              <>
                <HeartPulse className="h-3 w-3 text-orange-500" />
                {translate('enterToSend')}
              </>
            )}
          </div>
        )}
      </div>
    </form>
  );
}