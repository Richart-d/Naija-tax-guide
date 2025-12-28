import { useState } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Collapsible, CollapsibleContent, CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { BookOpen, DollarSign, Building2, Briefcase, ChevronDown, Lightbulb } from "lucide-react";
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
  },
  {
    id: "presumptive",
    title: "Presumptive Tax",
    category: "Individual",
    icon: Briefcase,
    summary: "A simplified tax option for small businesses based on turnover.",
    content: `
      ### What is Presumptive Tax?
      Presumptive Tax is a simplified tax system for individuals and small businesses. Instead of calculating actual profit, you pay a fixed percentage of your turnover.
      
      ### The 2% Option
      Many small businesses can opt to pay 2% of their annual turnover instead of calculating profit or loss. This makes tax compliance simpler.
      
      ### Who can use it?
      Generally, businesses with lower turnover may qualify for presumptive tax. Check with your tax office for eligibility.
      
      ### Why it helps
      - No need to keep detailed profit and loss records
      - Quick tax calculation
      - Easier filing and compliance
      - Good for cash-based businesses
      
      ### Important Note
      You must register and inform FIRS/SIRS that you are using presumptive tax. It is not automatic.
    `
  }
];

const DID_YOU_KNOW_ITEMS = [
  {
    title: "Rent Relief – Automatic Money You Never Knew About",
    explanation: "What it means: You may deduct part of your rent from your taxable income.",
    detail: "As an individual, you can claim a percentage of rent paid annually as a deduction from your taxable income, which reduces the tax you owe. Money back you didn't expect!"
  },
  {
    title: "Cash Payment Above ₦50,000 = Free Money to Government",
    explanation: "What it means: Cash payments above ₦50,000 in a single transaction are not allowed.",
    detail: "All payments above ₦50,000 must use bank transfers, cheques, or electronic payment methods. This rule is law in Nigeria to prevent informal transactions."
  },
  {
    title: "Crypto / Dollar Gift or Sales – Tax Man Wants a Cut",
    explanation: "What it means: Income from cryptocurrency and foreign currency is taxable.",
    detail: "Whether from mining, trading, or gifts of significant value, crypto income must be declared and is subject to tax. Keep records of all transactions."
  },
  {
    title: "Shares 'Small Money' Escape Hole",
    explanation: "What it means: Gains from selling shares may not be taxed in some cases.",
    detail: "Capital gains from sales of shares on the Nigerian Stock Exchange may qualify for exemption if they meet certain conditions. You might keep more profit than expected."
  },
  {
    title: "Minimum-Wage Workers Still Must File a Return",
    explanation: "What it means: Even low earners must file a tax return.",
    detail: "If your annual income is below the consolidated relief allowance (CRA) threshold, you may not owe tax, but you may still need to file. Check with FIRS."
  },
  {
    title: "PAYE 10% Bonus – Use It or Lose It",
    explanation: "What it means: Tax already deducted from your salary is money you can get back.",
    detail: "Keep your PAYE slips and WHT credit notes. At year-end, these reduce what you owe. You may get a refund if you overpaid. Don't throw them away!"
  },
  {
    title: "Freelancers Paid from Abroad – No WHT, But…",
    explanation: "What it means: Foreign income is still taxable in Nigeria.",
    detail: "As a Nigerian resident, income from international clients is taxable in Nigeria. You may claim foreign tax credit if you paid tax in another country."
  },
  {
    title: "Pension / NHIS / NHF – Free Money Twice",
    explanation: "What it means: Contributions to these schemes reduce your tax and grow your savings.",
    detail: "Contributions to registered pension, health insurance (NHIS), and housing fund (NHF) are deductible from your gross income before tax calculation."
  },
  {
    title: "Presumptive Tax – 2% Silent Life-Saver",
    explanation: "What it means: Small businesses can pay just 2% of turnover instead of filing complex returns.",
    detail: "Perfect for cash-based businesses. No need for detailed profit/loss records. Ask FIRS or SIRS if your business qualifies for this simplified system."
  },
  {
    title: "Change of Address / Email – ₦50,000 Fine",
    explanation: "What it means: You must update your address with the tax authority.",
    detail: "If you move or change email, inform FIRS or your SIRS. Failure to notify can result in penalties up to ₦50,000. Keep your record current."
  },
  {
    title: "Interest on Loan for Owner-Occupied House – Deductible",
    explanation: "What it means: Mortgage interest on your home may reduce your taxable income.",
    detail: "In some cases, interest paid on a loan for a primary residential property may qualify for tax relief. Verify eligibility with your tax office."
  },
  {
    title: "Motor Vehicle Used Only for Private = No Capital Gains",
    explanation: "What it means: Selling your personal car is typically not a taxable event.",
    detail: "Capital gains from selling a private vehicle used for personal purposes are generally exempt from tax. You won't owe tax on the profit."
  },
  {
    title: "Family Income – Don't Mix It With Your Own",
    explanation: "What it means: Each family member's income is taxed separately.",
    detail: "Your spouse's income is separate and taxed independently. You file separately, not jointly. Combining incomes won't reduce overall tax."
  },
  {
    title: "Digital Receipt = Legal Receipt",
    explanation: "What it means: Digital receipts are valid proof of payment for tax purposes.",
    detail: "Email receipts, SMS confirmations, and electronic invoices are acceptable for tax records. You don't always need physical paper receipts."
  },
  {
    title: "Loss From Side Hustle Cannot Reduce Salary",
    explanation: "What it means: A loss from a side business may have limits on offsetting main income.",
    detail: "While some offsetting may apply, losses from a side business are not automatically deductible against salary income. Consult a professional about your situation."
  }
];

export default function Learn() {
  const [activeModule, setActiveModule] = useState<typeof MODULES[0] | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container-padding mx-auto">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">Learning Hub</h1>
          <p className="mt-4 text-muted-foreground">Master the basics without the legal jargon.</p>
        </div>

        {/* Main Learning Modules */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8">Core Tax Concepts</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

        {/* Did You Know Section */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center gap-3">
            <Lightbulb className="h-8 w-8 text-accent" />
            <h2 className="font-display text-2xl font-bold text-foreground">Did You Know?</h2>
          </div>
          
          <p className="text-muted-foreground mb-8">Quick facts about Nigerian tax that might surprise you. Click any item to learn more.</p>

          <div className="grid gap-4 md:grid-cols-2">
            {DID_YOU_KNOW_ITEMS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Collapsible open={expandedItems.includes(item.title)} onOpenChange={() => toggleExpanded(item.title)}>
                  <CollapsibleTrigger asChild>
                    <Card className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-foreground text-sm flex-1 text-left">{item.title}</h3>
                        <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${
                          expandedItems.includes(item.title) ? 'rotate-180' : ''
                        }`} />
                      </div>
                    </Card>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <Card className="border-t-0 rounded-t-none p-4 bg-primary/5">
                      <p className="text-sm font-medium text-foreground mb-2">{item.explanation}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
                    </Card>
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
