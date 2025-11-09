"use client";

import { useState } from "react";
import { askAIQuestion } from "@/app/actions/ai-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, Loader2, Bot, User } from "lucide-react";
import type { ChatMessage } from "@/lib/ai-chat-service";

export function AIChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Bonjour ! Je suis votre assistant expert en paie marocaine. Comment puis-je vous aider aujourd&apos;hui ?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [includeCompanyData, setIncludeCompanyData] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await askAIQuestion(input.trim(), messages, includeCompanyData);

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Désolé, une erreur s&apos;est produite. Veuillez réessayer.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Assistant IA - Expert Paie Marocaine
        </CardTitle>
        <CardDescription>
          Posez vos questions sur la législation fiscale et sociale marocaine
        </CardDescription>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="include-data"
            checked={includeCompanyData}
            onChange={(e) => setIncludeCompanyData(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="include-data" className="text-sm text-gray-600">
            Inclure les données de mon entreprise (anonymisées) pour un contexte plus précis
          </label>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-green-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.timestamp && (
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
              {message.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Bot className="h-4 w-4 text-green-600" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question sur la paie marocaine..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

