import { Message } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { UserIcon, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { translate } = useLanguage();
  const isUser = message.role === 'user';
  const timestamp = new Date(message.timestamp);
  
  return (
    <div 
      className={cn(
        'flex items-start gap-4 py-5 px-4 border-b transition-colors',
        isUser ? 'bg-white hover:bg-gray-50' : 'bg-gradient-to-r from-blue-50/80 to-white hover:from-blue-50'
      )} 
      key={message.id}
    >
      <div className="container flex max-w-4xl items-start gap-4">
        {isUser ? (
          <div className="relative">
            <Avatar className="h-10 w-10 rounded-full border-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white border-orange-300 shadow-sm">
              <div className="flex h-full w-full items-center justify-center">
                <UserIcon className="h-5 w-5" />
              </div>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-green-500 h-2.5 w-2.5 rounded-full border border-white"></div>
          </div>
        ) : (
          <div className="relative">
            <Avatar className="h-10 w-10 rounded-full border-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white border-blue-400 shadow-sm">
              <div className="flex h-full w-full items-center justify-center">
                <img src="/assets/logo1.png" alt="MediAssist" className="h-7 w-7" />
              </div>
            </Avatar>
            <div className="absolute -top-1 -left-1 bg-blue-100 rounded-full p-0.5 border border-blue-200">
              <MessageSquare className="h-3 w-3 text-blue-700" />
            </div>
          </div>
        )}
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center">
            <div className={cn(
              "font-medium mr-2",
              isUser ? "text-orange-700" : "text-blue-800"
            )}>
              {isUser ? translate('you') : translate('assistant')}
            </div>
            <div className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md">
              {format(timestamp, 'HH:mm')}
            </div>
          </div>
          
          <div className="prose prose-blue max-w-none">
            {message.content.split('\n').map((line, i) => (
              <p key={i} className={cn(
                'mb-2 leading-relaxed',
                isUser 
                  ? 'text-gray-800 bg-orange-50/30 rounded-md py-1 px-2 border-l-2 border-orange-300' 
                  : 'text-blue-900 bg-blue-50/30 rounded-md py-1 px-2 border-l-2 border-blue-300'
              )}>
                {line || '\u00A0'}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}