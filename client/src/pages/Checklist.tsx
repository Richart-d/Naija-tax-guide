import { useState, useEffect } from "react";
import { UserTypes } from "@shared/schema";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const CHECKLIST_ITEMS = [
  // Salary Earner
  { id: "paye-check", text: "Check payslip for correct PAYE tax deduction", for: ["Salary Earner"] },
  { id: "paye-card", text: "Get Tax Clearance Certificate (TCC) from employer annually", for: ["Salary Earner"] },
  { id: "tin-salary", text: "Ensure your TIN is registered with your employer", for: ["Salary Earner"] },

  // Freelancers & Self-Employed
  { id: "tin", text: "Register for Taxpayer Identification Number (TIN)", for: ["Freelancers & Self-Employed"] },
  { id: "records", text: "Set up a record-keeping system (Excel/Software)", for: ["Freelancers & Self-Employed"] },
  { id: "vat-reg", text: "Register for VAT with NRS/SIRS (if turnover > ₦25 million)", for: ["Freelancers & Self-Employed"] },
  { id: "invoice-system", text: "Create invoices for all services/products sold", for: ["Freelancers & Self-Employed"] },
  { id: "bank-account", text: "Separate personal and business bank accounts", for: ["Freelancers & Self-Employed"] },

  // Business Owner
  { id: "tin-biz", text: "Register for Taxpayer Identification Number (TIN)", for: ["Business Owner"] },
  { id: "cac", text: "Register Business Name with CAC (Corporate Affairs Commission)", for: ["Business Owner"] },
  { id: "vat-biz", text: "Register for VAT with NRS/SIRS (if turnover > ₦25 million)", for: ["Business Owner"] },
  { id: "bank-biz", text: "Open Corporate Bank Account separate from personal", for: ["Business Owner"] },
  { id: "records-biz", text: "Set up a record-keeping system (Excel/Software)", for: ["Business Owner"] },
  { id: "monthly-tracking", text: "Track income and expenses monthly", for: ["Business Owner"] },

  // Mixed Income
  { id: "tin-mixed", text: "Register for Taxpayer Identification Number (TIN)", for: ["Mixed Income"] },
  { id: "paye-track", text: "Keep all PAYE slips and WHT credit notes from salary/services", for: ["Mixed Income"] },
  { id: "separate-sources", text: "Keep records for each income source separately", for: ["Mixed Income"] },
  { id: "wht-credits", text: "Collect WHT credit notes from service payments", for: ["Mixed Income"] },
  { id: "avoid-double", text: "Understand: PAYE already paid should not be double-taxed", for: ["Mixed Income"] },
  { id: "mixed-vat", text: "Register for VAT if business income exceeds ₦25 million", for: ["Mixed Income"] },

  // Company Owner
  { id: "tin-company", text: "Register Company for Taxpayer Identification Number (TIN)", for: ["Company Owner"] },
  { id: "cac-company", text: "Register Company with CAC as a Limited company (LTD)", for: ["Company Owner"] },
  { id: "separate-tax", text: "Understand: Company tax (CIT) is separate from your personal tax", for: ["Company Owner"] },
  { id: "director-salary", text: "Pay yourself a salary and ensure PAYE is deducted", for: ["Company Owner"] },
  { id: "company-vat", text: "Register Company for VAT (if applicable)", for: ["Company Owner"] },
  { id: "company-records", text: "Maintain comprehensive company financial records", for: ["Company Owner"] },
  { id: "wht-company", text: "Collect WHT credit notes paid on company expenses", for: ["Company Owner"] },
  { id: "director-paye", text: "Director tax (PIT) is separate from company tax (CIT)", for: ["Company Owner"] },

  // NGO / Charity
  { id: "ngo-tin", text: "Register Organisation for Taxpayer Identification Number (TIN)", for: ["NGO/Charity"] },
  { id: "ngo-separate", text: "Keep donations separate from business/commercial income", for: ["NGO/Charity"] },
  { id: "ngo-records", text: "Maintain records of all income sources (donations, grants, services)", for: ["NGO/Charity"] },
  { id: "ngo-vat", text: "Know: Commercial income (sales, training) may trigger VAT threshold", for: ["NGO/Charity"] },
  { id: "ngo-wht", text: "Collect WHT credit notes on any service income", for: ["NGO/Charity"] },
  { id: "ngo-when-file", text: "Understand: Filing becomes mandatory if commercial income is significant", for: ["NGO/Charity"] },
  { id: "ngo-consult", text: "Consult a professional about your specific tax-exempt status", for: ["NGO/Charity"] },
];

export default function Checklist() {
  const [userType, setUserType] = useState<string>("Freelancers & Self-Employed");
  const [checkedItems, setCheckedItems] = useState<string[]>(() => {
    const saved = localStorage.getItem("tax_checklist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tax_checklist", JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggleItem = (id: string) => {
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredItems = CHECKLIST_ITEMS.filter(item => item.for.includes(userType));
  const progress = Math.round((checkedItems.filter(id => filteredItems.some(i => i.id === id)).length / filteredItems.length) * 100) || 0;

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container-padding mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">Compliance Checklist</h1>
          <p className="mt-2 text-muted-foreground">Keep track of what you've done and what's pending.</p>
        </div>

        <Card className="glass-card mb-6 p-6">
          <label className="mb-3 block text-sm font-medium text-foreground">Select your category:</label>
          <Select value={userType} onValueChange={setUserType}>
            <SelectTrigger className="h-11 bg-white border-2 border-primary/20 rounded-lg shadow-sm hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-primary/20 shadow-lg">
              {UserTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </Card>

        <div className="mb-6">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                checkedItems.includes(item.id) 
                  ? "bg-primary/5 border-primary/20 opacity-60" 
                  : "bg-white border-border hover:border-primary/50"
              }`}
            >
              <Checkbox 
                id={item.id}
                checked={checkedItems.includes(item.id)}
                onCheckedChange={() => toggleItem(item.id)}
                className="h-6 w-6 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label 
                htmlFor={item.id}
                className={`flex-1 cursor-pointer font-medium ${
                  checkedItems.includes(item.id) ? "line-through text-muted-foreground" : "text-foreground"
                }`}
              >
                {item.text}
              </label>
            </motion.div>
          ))}
        </div>

        {checkedItems.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button 
              variant="ghost" 
              className="text-destructive hover:bg-destructive/10"
              onClick={() => {
                if (confirm("Clear all checked items?")) setCheckedItems([]);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Reset Checklist
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
