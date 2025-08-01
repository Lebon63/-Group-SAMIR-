import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NewChatPage() {
  const navigate = useNavigate();
  
  // Automatically redirect to the chat page
  // In a real app, this would create a new chat session and then redirect
  useEffect(() => {
    navigate("/");
  }, [navigate]);
  
  return null;
}