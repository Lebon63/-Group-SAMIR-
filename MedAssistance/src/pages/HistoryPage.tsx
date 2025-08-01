import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrashIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { Link } from "react-router-dom";

// Mock conversation history data
const mockHistory = [
  {
    id: "1",
    title: "About diabetes medications",
    date: new Date(2025, 6, 30),
    preview: "I have questions about my diabetes medication...",
  },
  {
    id: "2",
    title: "Blood pressure concerns",
    date: new Date(2025, 6, 29),
    preview: "My blood pressure readings have been high lately...",
  },
  {
    id: "3",
    title: "Post-surgery care",
    date: new Date(2025, 6, 27),
    preview: "What should I do after my knee surgery?",
  }
];

export default function HistoryPage() {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const [history, setHistory] = useState(mockHistory);

  const deleteConversation = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-blue-600 to-orange-500 bg-clip-text text-transparent">
        {t.historyTitle}
      </h1>

      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">
                  <Link to={`/chat/${item.id}`} className="text-blue-700 hover:underline">
                    {item.title}
                  </Link>
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteConversation(item.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-muted-foreground text-sm mb-2 line-clamp-1">
                  {item.preview}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.date.toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No conversation history yet.</p>
          <Button asChild>
            <Link to="/new-chat">Start a new chat</Link>
          </Button>
        </div>
      )}
    </div>
  );
}