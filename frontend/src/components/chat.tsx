import { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/use-chat';
import { ChatMessage } from '@/components/chat-message';
import { ChatInput } from '@/components/chat-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info, BookOpen, Pill, HeartPulse, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/language-selector';
import { useLanguage } from '@/contexts/LanguageContext';

export function Chat() {
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const { translate } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src="/assets/logo1.png" 
              alt="MediAssist Logo" 
              className="h-10 w-10 rounded-full border-2 border-white shadow-sm" 
            />
            <div className="absolute -bottom-1 -right-1 bg-orange-500 h-3 w-3 rounded-full border border-white animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold">MediAssist</h1>
            <p className="text-xs text-blue-100 opacity-80">{translate('poweredBy')}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <LanguageSelector />
          {messages.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearChat}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-none shadow-md"
            >
              {translate('newChatButton')}
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="flex flex-col md:flex-row items-center md:space-x-6 mb-8">
              <div className="relative mb-4 md:mb-0">
                <img 
                  src="/assets/logo2.png" 
                  alt="MediAssist Brand" 
                  className="h-28 w-28 rounded-lg shadow-md border border-blue-100" 
                />
                <div className="absolute -bottom-2 -right-2 h-6 w-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  +
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-3 text-blue-800 bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">{translate('welcomeTitle')}</h2>
                <p className="text-gray-700 mb-3 max-w-xl text-lg">
                  {translate('welcomeMessage')}
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-3xl shadow-sm">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-700 mr-2 mt-1 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  {translate('note')}
                </p>
              </div>
            </div>
            
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
              <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all hover:translate-y-[-2px] border-l-4 border-blue-600">
                <div className="flex items-center mb-3">
                  <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="font-medium text-blue-800 text-lg">{translate('patientEducation')}</h3>
                </div>
                <p className="text-gray-600">{translate('patientEducationDesc')}</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all hover:translate-y-[-2px] border-l-4 border-orange-500">
                <div className="flex items-center mb-3">
                  <Pill className="h-6 w-6 text-orange-500 mr-2" />
                  <h3 className="font-medium text-blue-800 text-lg">{translate('medicationSupport')}</h3>
                </div>
                <p className="text-gray-600">{translate('medicationSupportDesc')}</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all hover:translate-y-[-2px] border-l-4 border-green-500">
                <div className="flex items-center mb-3">
                  <HeartPulse className="h-6 w-6 text-green-500 mr-2" />
                  <h3 className="font-medium text-blue-800 text-lg">{translate('healthManagement')}</h3>
                </div>
                <p className="text-gray-600">{translate('healthManagementDesc')}</p>
              </div>
            </div>
            
            <div className="mt-12 flex items-center justify-center">
              <div className="relative">
                <img src="/assets/logo3.png" alt="DGH Logo" className="h-16 w-auto opacity-90 drop-shadow-md" />
                <div className="absolute -top-3 -right-3 bg-blue-100 rounded-full px-2 py-1 text-xs font-medium text-blue-800 shadow-sm border border-blue-200">
                  <Brain className="h-3 w-3 inline-block mr-1" />
                  <span>AI-Powered</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {error && (
        <Alert variant="destructive" className="mx-4 my-2 shadow-md border border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}. {translate('backendError')}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="p-4 border-t bg-white shadow-inner border-blue-100">
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}