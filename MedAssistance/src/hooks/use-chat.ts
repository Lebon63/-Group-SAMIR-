import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message, Language } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { modelService } from "@/services/modelService";
import { translationService } from "@/services/translationService";
import { useLanguage } from "@/context/LanguageContext";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  // Function to send message to BioMistral API
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Step 1: Translate user query to English if not already in English
      let englishQuery = content;
      if (currentLanguage !== 'english') {
        try {
          englishQuery = await translationService.translate(content, 'english', currentLanguage);
        } catch (translationError) {
          console.error('Translation error (input):', translationError);
          // Continue with original text if translation fails
        }
      }

      // Step 2: Send to BioMistral model for response
      let responseText: string;
      try {
        responseText = await modelService.generateResponse(englishQuery);
      } catch (modelError) {
        console.error('Model API error:', modelError);
        // Fall back to simulated response if model API fails
        responseText = getFallbackResponse(content);
      }

      // Step 3: Translate the response back to user's language if needed
      let finalResponseText = responseText;
      if (currentLanguage !== 'english') {
        try {
          finalResponseText = await translationService.translate(responseText, currentLanguage, 'english');
        } catch (translationError) {
          console.error('Translation error (output):', translationError);
          // Continue with English response if translation fails
        }
      }

      // Step 4: Add the bot response to the messages
      const botResponse: Message = {
        id: uuidv4(),
        role: "assistant",
        content: finalResponseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback function for when the model API is unavailable
  const getFallbackResponse = (query: string): string => {
    // Simple responses based on keywords
    if (query.toLowerCase().includes("diabetes")) {
      return "Diabetes is a condition that affects how your body processes blood sugar. There are several types, with Type 1 and Type 2 being the most common. It's important to manage your blood glucose levels through diet, exercise, and possibly medication. Regular check-ups with your healthcare provider are essential.";
    } else if (query.toLowerCase().includes("blood pressure") || query.toLowerCase().includes("hypertension")) {
      return "High blood pressure (hypertension) is when the force of blood pushing against your artery walls is consistently too high. It's often called the 'silent killer' because it typically has no symptoms but can lead to serious health problems. Managing it includes regular monitoring, maintaining a healthy diet low in salt, exercising regularly, and sometimes medication.";
    } else if (query.toLowerCase().includes("medication") || query.toLowerCase().includes("medicine")) {
      return "It's important to take your medications exactly as prescribed by your doctor. Always inform your healthcare provider about all medications you're taking, including over-the-counter drugs and supplements. If you experience side effects, contact your healthcare provider before stopping any medication.";
    } else {
      return "I understand you have a question about your health. For specific medical advice, it's always best to consult with your healthcare provider. I can provide general information, but remember that I'm an AI assistant and not a replacement for professional medical consultation.";
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
  };
}