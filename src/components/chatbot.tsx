"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, X, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { chat } from "@/ai/flows/chatbot";

type Message = {
  role: "user" | "model";
  content: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
        const history = messages.map(m => ({role: m.role, content: m.content}));
        const response = await chat({ history, message: input });
        const botMessage: Message = { role: "model", content: response };
        setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
        console.error("Chatbot error:", error);
        const errorMessage: Message = { role: "model", content: "Sorry, I'm having trouble connecting. Please try again later." };
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setIsOpen(!isOpen)} size="icon" className="h-16 w-16 rounded-full shadow-lg">
          {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
        </Button>
      </div>

      {isOpen && (
        <Card className="fixed bottom-24 right-4 z-50 w-full max-w-sm flex flex-col shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                <CardTitle className="text-lg">EcoSwap Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="md:hidden">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-grow">
            <ScrollArea className="h-96">
              <div className="p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-2 text-sm",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 max-w-[80%]",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start gap-2 text-sm">
                         <div className="rounded-lg px-3 py-2 bg-muted flex items-center gap-2">
                            <span className="h-2 w-2 bg-primary rounded-full animate-pulse delay-0"></span>
                            <span className="h-2 w-2 bg-primary rounded-full animate-pulse delay-150"></span>
                            <span className="h-2 w-2 bg-primary rounded-full animate-pulse delay-300"></span>
                         </div>
                    </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex w-full items-center space-x-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
