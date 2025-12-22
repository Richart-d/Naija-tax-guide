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
  { id: "tin", text: "Register for Taxpayer Identification Number (TIN)", for: ["Freelancer", "Business Owner", "Self-Employed"] },
  { id: "cac", text: "Register Business Name with CAC", for: ["Business Owner"] },
  { id: "vat-reg", text: "Register for VAT with FIRS (if turnover > 25m)", for: ["Business Owner", "Freelancer"] },
  { id: "bank", text: "Open Corporate Bank Account", for: ["Business Owner"] },
  { id: "records", text: "Set up a record-keeping system (Excel/Software)", for: ["Freelancer", "Business Owner", "Self-Employed"] },
  { id: "paye-card", text: "Get Tax Clearance Certificate (TCC) from employer", for: ["Salary Earner"] },
  { id: "paye-check", text: "Check payslip for correct tax deduction", for: ["Salary Earner"] },
];

export default function Checklist() {
  const [userType, setUserType] = useState<string>("Freelancer");
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
          <label className="mb-2 block text-sm font-medium text-foreground">Select your category:</label>
          <Select value={userType} onValueChange={setUserType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
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
