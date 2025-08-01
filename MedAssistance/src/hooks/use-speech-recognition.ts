import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/context/LanguageContext";

interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

// Map our languages to browser speech recognition language codes
const languageCodes = {
  english: 'en-US',
  french: 'fr-FR',
  fufulde: 'ff', // This might not be widely supported
  ewondo: 'fr-CM' // Using Cameroon French as fallback for Ewondo
};

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive",
      });
      return;
    }

    setIsListening(true);
    setTranscript("");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Set language based on current language selection
    recognition.lang = languageCodes[currentLanguage] || 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: { 
      resultIndex: number;
      results: {
        [index: number]: { 
          [index: number]: { transcript: string };
          isFinal: boolean;
        };
      };
    }) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + ' ' + finalTranscript.trim());
      }
    };

    recognition.onerror = (event: { error: string }) => {
      console.error('Speech recognition error', event.error);
      toast({
        title: "Error",
        description: `Speech recognition error: ${event.error}`,
        variant: "destructive",
      });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition', error);
      setIsListening(false);
    }

    return () => {
      recognition.stop();
    };
  }, [isSupported, toast, currentLanguage]);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
    resetTranscript: () => setTranscript(""),
  };
}