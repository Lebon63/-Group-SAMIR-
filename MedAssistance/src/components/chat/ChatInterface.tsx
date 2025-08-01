import { useState, useEffect, useRef } from "react";
import { useChat } from "@/hooks/use-chat";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Mic, MicOff, Loader2, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LANGUAGE_CODES } from "@/services/apiConfig";

export function ChatInterface() {
  const { messages, isLoading, sendMessage } = useChat();
  const { isListening, transcript, startListening, stopListening, isSupported, resetTranscript } = useSpeechRecognition();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput("");
      resetTranscript();
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-orange-100 text-orange-500 p-3 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-pulse">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                <path d="M3.22 12H9.5l.5-1 2 4 .5-1h6.7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">
              MedAssist
            </h2>
            <p className="text-muted-foreground max-w-md">
              {t.welcomeMessage}
            </p>
            <div className="mt-8 text-sm text-muted-foreground max-w-md">
              {t.disclaimerText}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
            >
              <Card
                className={cn(
                  "max-w-[80%] p-4",
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-muted"
                )}
              >
                <div className="flex items-start gap-3">
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback className="bg-orange-100 text-orange-500">
                        MA
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col">
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div
                      className={cn(
                        "text-xs mt-1",
                        message.role === "user" ? "text-blue-100" : "text-muted-foreground"
                      )}
                    >
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback className="bg-blue-700">
                        U
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </Card>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-[80%] p-4 bg-muted">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback className="bg-orange-100 text-orange-500">
                    MA
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t.loadingText}
                  </span>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" /> 
                    <span>BioMistral-7B-DARE</span>
                    {currentLanguage !== 'english' && (
                      <span> • Translating: {LANGUAGE_CODES[currentLanguage]}</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.chatPlaceholder}
            className="min-h-[60px] flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="flex flex-col gap-2">
            {isSupported && (
              <Button
                type="button"
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                onClick={handleVoiceToggle}
                title={isListening ? t.stopRecordingButton : t.recordButton}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
            )}
            <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}