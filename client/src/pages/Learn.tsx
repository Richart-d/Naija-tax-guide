import { useState } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, DollarSign, Building2, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const MODULES = [
  {
    id: "pit",
    title: "Personal Income Tax (PIT)",
    category: "Individual",
    icon: Briefcase,
    summary: "Tax charged on the income of individuals, families, and trustees.",
    content: `
      ### What is PIT?
      Personal Income Tax (PIT) is a tax imposed on the income of individuals, communities, families, executors, and trustees.
      
      ### Who collects it?
      - If you live in a state (e.g., Lagos, Kano), the State Internal Revenue Service (SIRS) collects it.
      - If you live in Abuja (FCT), are a police officer, or work in the Ministry of Foreign Affairs, the FIRS collects it.
      
      ### How much is it?
      It uses a graduated scale ranging from 7% to 24% after a Consolidated Relief Allowance (CRA) is deducted.
      
      ### CRA Calculation
      The higher of ₦200,000 or 1% of gross income, PLUS 20% of gross income.
    `
  },
  {
    id: "vat",
    title: "Value Added Tax (VAT)",
    category: "Business",
    icon: DollarSign,
    summary: "Consumption tax of 7.5% placed on goods and services.",
    content: `
      ### What is VAT?
      VAT is a consumption tax paid when goods are purchased and services rendered. The current rate in Nigeria is 7.5%.
      
      ### Who registers?
      Any individual or business trading in VATable goods/services with an annual turnover of ₦25 Million or more.
      
      ### Exemptions
      Basic food items, medical products, books, and educational materials are generally exempt from VAT.
    `
  },
  {
    id: "wht",
    title: "Withholding Tax (WHT)",
    category: "General",
    icon: Building2,
    summary: "An advance payment of income tax deducted at source.",
    content: `
      ### Understanding WHT
      Withholding Tax is not a separate tax type. It is an advance payment of income tax.
      
      ### How it works
      When a company pays you for a service, they may deduct 5% or 10% and pay it to the government on your behalf.
      
      ### Credit Notes
      The company must give you a WHT Credit Note. You can use this note to reduce your total tax liability at the end of the year. Do not throw it away!
    `
  }
];

export default function Learn() {
  const [activeModule, setActiveModule] = useState<typeof MODULES[0] | null>(null);

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container-padding mx-auto">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">Learning Hub</h1>
          <p className="mt-4 text-muted-foreground">Master the basics without the legal jargon.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((module, idx) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="card-hover group cursor-pointer overflow-hidden p-6 h-full flex flex-col">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="rounded-lg bg-secondary p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <module.icon className="h-6 w-6" />
                      </div>
                      <Badge variant="outline" className="border-primary/20 text-primary">
                        {module.category}
                      </Badge>
                    </div>
                    
                    <h3 className="font-display text-xl font-bold text-foreground">{module.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{module.summary}</p>
                    
                    <div className="mt-6 flex items-center text-sm font-medium text-primary">
                      Read more <BookOpen className="ml-2 h-4 w-4" />
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl font-bold text-primary">
                      {module.title}
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-[60vh] pr-4">
                    <div className="prose prose-sm prose-green max-w-none text-foreground/80">
                      {module.content.split('\n').map((line, i) => {
                        const trimmed = line.trim();
                        if (trimmed.startsWith('###')) {
                          return <h3 key={i} className="mt-6 text-lg font-bold text-foreground">{trimmed.replace('###', '')}</h3>;
                        }
                        if (trimmed.startsWith('-')) {
                          return <li key={i} className="ml-4 list-disc">{trimmed.replace('-', '')}</li>;
                        }
                        if (trimmed) {
                          return <p key={i} className="mt-2 leading-relaxed">{trimmed}</p>;
                        }
                        return null;
                      })}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
