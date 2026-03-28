import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bot, User, AlertCircle } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const getBotResponse = (userInput: string): string => {
  const input = userInput.toLowerCase();
  if (input.includes('fever') || input.includes('temperature')) {
    return "For fever, rest and stay hydrated. Consider taking acetaminophen or ibuprofen as directed. If fever persists over 3 days or exceeds 103Â°F (39.4Â°C), please consult a healthcare provider.";
  }
  if (input.includes('headache')) {
    return "For headaches, try resting in a quiet, dark room and staying hydrated. Over-the-counter pain relievers may help. If you experience severe or frequent headaches, please consult a doctor.";
  }
  if (input.includes('appointment') || input.includes('book')) {
    return "I can help you understand our appointment booking process! You can book appointments through your patient dashboard or by calling our office. Would you like me to guide you through the online booking process?";
  }
  if (input.includes('medication') || input.includes('medicine')) {
    return "For medication-related questions, it's best to consult with your pharmacist or healthcare provider. I can provide general information, but specific medication advice should come from medical professionals.";
  }
  return "Thank you for your question. While I can provide general health information, I always recommend consulting with a healthcare professional for personalized medical advice. Is there anything specific about our HealthEase services I can help you with?";
};

const suggestedSymptoms = ['Fever', 'Headache', 'Book appointment', 'Medication query'];

const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your HealthEase AI assistant. How can I help you with your health questions today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 800);
  };

  const handleSuggestion = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <Card className="flex-1 flex flex-col border-border overflow-hidden shadow-sm">
        <CardHeader className="border-b border-border py-4 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0 border border-primary/20">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">HealthEase AI Assistant</CardTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <p className="text-xs text-muted-foreground font-medium">Online &bull; General health information only</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${message.sender === 'user' ? 'bg-primary' : 'bg-muted'}`}>
                    {message.sender === 'user' ? <User className="h-4 w-4 text-primary-foreground" /> : <Bot className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className={`rounded-lg px-4 py-2.5 ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border bg-background space-y-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <span className="text-xs text-muted-foreground whitespace-nowrap font-medium pr-1">Suggested:</span>
              {suggestedSymptoms.map((s) => (
                <Button key={s} variant="secondary" size="sm" onClick={() => handleSuggestion(s)} className="rounded-full h-7 text-xs shrink-0 bg-muted">
                  {s}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 h-11"
              />
              <Button onClick={handleSendMessage} size="icon" className="h-11 w-11 shrink-0">
                <Send className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-start gap-2 text-[10px] text-muted-foreground">
              <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
              <span>Medical suggestion disclaimer: This chatbot provides general information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotPage;
