import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

const FAQ_OPTIONS = [
  "What is a TIN?",
  "Do I need to pay VAT?",
  "When is the tax deadline?",
  "How do I register?",
];

const RESPONSES: Record<string, string> = {
  "What is a TIN?": "TIN stands for Taxpayer Identification Number. It's a unique number given to individuals and businesses by the FIRS for tax purposes. You need it to open a corporate bank account or file returns.",
  "Do I need to pay VAT?": "Value Added Tax (VAT) is 7.5%. If you sell goods or services, you generally need to register and charge VAT. Small businesses with turnover less than ₦25 million are exempted from charging VAT.",
  "When is the tax deadline?": "For Personal Income Tax (PIT), the deadline is March 31st of every year. For Companies Income Tax (CIT), it's 6 months after your financial year end.",
  "How do I register?": "You can register at the nearest FIRS office or State Internal Revenue Service (SIRS) office depending on your business type. Many states now allow online registration.",
};

export function TaxBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", text: "Hello! I'm your simple tax assistant. Pick a question below.", sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (text: string) => {
    const userMsg: Message = { id: Date.now().toString(), text, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();
      const botMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: data.message, 
        sender: "bot" 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: "Sorry, I'm having trouble connecting to the tax network right now. Please try again later.", 
        sender: "bot" 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-4 z-50 w-[350px] md:right-8"
          >
            <Card className="flex h-[450px] flex-col overflow-hidden border-2 border-primary/10 shadow-2xl">
              <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-white/20 p-1">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <span className="font-semibold">Tax Assistant</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-primary-foreground hover:bg-white/20 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1 bg-muted/30 p-4">
                <div className="flex flex-col gap-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm break-words ${
                        msg.sender === "user"
                          ? "self-end bg-primary text-primary-foreground"
                          : "self-start bg-secondary text-secondary-foreground"
                      }`}
                    >
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({children}) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                          ul: ({children}) => <ul className="list-disc pl-4 mb-2 last:mb-0 space-y-1">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal pl-4 mb-2 last:mb-0 space-y-1">{children}</ol>,
                          li: ({children}) => <li className="mb-0.5">{children}</li>,
                          h1: ({children}) => <h3 className="text-lg font-bold mb-2 mt-4 first:mt-0">{children}</h3>,
                          h2: ({children}) => <h4 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h4>,
                          h3: ({children}) => <h5 className="text-sm font-bold mb-1 mt-2 first:mt-0">{children}</h5>,
                          code: ({children}) => <code className="bg-black/10 rounded px-1 py-0.5 font-mono text-xs">{children}</code>,
                          pre: ({children}) => <pre className="bg-black/10 rounded p-2 mb-2 overflow-x-auto text-xs">{children}</pre>,
                          strong: ({children}) => <span className="font-bold">{children}</span>,
                          table: ({children}) => <div className="overflow-x-auto mb-2"><table className="w-full border-collapse text-xs">{children}</table></div>,
                          th: ({children}) => <th className="border border-border/50 px-2 py-1 bg-black/5 text-left font-semibold">{children}</th>,
                          td: ({children}) => <td className="border border-border/50 px-2 py-1">{children}</td>,
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ))}
                  {isLoading && (
                     <div className="self-start bg-secondary text-secondary-foreground max-w-[85%] rounded-2xl px-4 py-2 text-sm italic opacity-70">
                       TaxBot is typing...
                     </div>
                  )}
                </div>
              </ScrollArea>

              <div className="border-t bg-background p-3">
                <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
                  {FAQ_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleSend(opt)}
                      disabled={isLoading}
                      className="whitespace-nowrap rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (inputValue.trim() && !isLoading) {
                      handleSend(inputValue);
                      setInputValue("");
                    }
                  }}
                  className="flex gap-2"
                >
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about Nigerian taxes..."
                    disabled={isLoading}
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-shadow hover:shadow-xl md:bottom-8 md:right-8"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>
    </>
  );
}
