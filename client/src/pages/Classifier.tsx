import { useState } from "react";
import { UserTypes, Locations } from "@shared/schema";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger 
} from "@/components/ui/tooltip";
import { ArrowRight, Check, AlertCircle, RefreshCcw, Info, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

// Internal options for Step 1
const WORK_TYPES = [
  { 
    id: "salary", 
    label: "I earn a salary from an employer", 
    tooltip: "Employer pays you and may deduct PAYE" 
  },
  { 
    id: "freelance", 
    label: "I work for myself alone (freelance, gigs, personal services)", 
    tooltip: "You earn directly from your personal skills or services" 
  },
  { 
    id: "business", 
    label: "I run a small business that sells goods or services", 
    tooltip: "Business sells goods/services and may operate beyond just you" 
  },
  { 
    id: "company", 
    label: "I run a registered company (LTD)", 
    tooltip: "Business is legally separate from you" 
  },
  { 
    id: "mix", 
    label: "I do a mix of the above", 
    tooltip: "More than one income source" 
  },
] as const;

// Internal options for Step 2
const COMPLEXITY_INDICATORS = [
  { id: "staff", label: "Staff or helpers", tooltip: "Anyone you pay to help you work" },
  { id: "shop", label: "A shop, outlet, or POS terminal", tooltip: "Physical location or payment terminal" },
  { id: "sales", label: "Regular daily sales", tooltip: "Frequent transactions, not just occasional gigs" },
  { id: "cac", label: "Business name or CAC registration", tooltip: "Registered with Corporate Affairs Commission" },
] as const;

// Internal options for Step 3: Income Source
const INCOME_SOURCES = [
  { 
    id: "local", 
    label: "Earned within Nigeria", 
    tooltip: "Money from Nigerian clients, businesses, or employers" 
  },
  { 
    id: "foreign", 
    label: "Earned from outside Nigeria (Foreign)", 
    tooltip: "Money from international clients or foreign companies" 
  },
  { 
    id: "mixed", 
    label: "Mix of Nigerian and foreign earnings", 
    tooltip: "Income from both Nigerian and international sources" 
  },
] as const;

export default function Classifier() {
  const [step, setStep] = useState(1);
  const [workType, setWorkType] = useState<string>("");
  const [complexity, setComplexity] = useState<string[]>([]);
  const [incomeSource, setIncomeSource] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [result, setResult] = useState<string[] | null>(null);

  const handleNext = () => {
    if (step === 1) {
      if (workType === "business" || workType === "mix") {
        setStep(2);
      } else {
        setStep(3); // Skip complexity, go to income source
      }
    } else if (step === 2) {
      setStep(3); // From complexity to income source
    } else if (step === 3) {
      setStep(4); // From income source to location
    }
  };

  const calculateResult = () => {
    const taxes: string[] = [];
    let userType = "";

    // Classification Logic
    if (workType === "salary") userType = "Salary Earner";
    else if (workType === "freelance") userType = "Self-Employed";
    else if (workType === "company") userType = "Company Owner";
    else if (workType === "mix") userType = "Mixed Income";
    else if (workType === "business") {
      // Check complexity
      if (complexity.length > 0) userType = "Business Owner";
      else userType = "Self-Employed"; // Fallback if no complexity selected, though 'business' implies it
    }

    // Generate Messages based on User Type
    if (userType === "Salary Earner") {
      taxes.push("PAYE (Pay As You Earn) - Your employer handles this.");
    } else if (userType === "Company Owner") {
      taxes.push("CIT (Companies Income Tax) - Companies are taxed differently.");
      taxes.push("Note: Directors still have personal tax obligations (PIT).");
    } else if (userType === "Mixed Income") {
      taxes.push("PIT (Personal Income Tax) on your private earnings.");
      taxes.push("PAYE on any salary portion.");
    } else {
      // Self-Employed / Business Owner
      taxes.push("PIT (Personal Income Tax) - Direct Assessment.");
      if (complexity.includes("shop") || complexity.includes("sales")) {
        taxes.push("VAT (Value Added Tax) - Likely applicable for goods/services.");
      }
      if (complexity.includes("staff")) {
        taxes.push("PAYE for Staff - You may need to deduct tax for employees.");
      }
    }

    // Income Source Logic
    if (incomeSource === "foreign" || incomeSource === "mixed") {
      taxes.push("Foreign Income may have tax exemptions if you paid tax abroad (Residency Rule).");
    }

    // Location Logic
    if (location === "Abuja") {
      taxes.push("FCT IRS is your relevant tax authority.");
    } else if (location) {
      taxes.push("State Internal Revenue Service (SIRS) is your tax authority.");
    }

    setResult(taxes);
  };

  const resetForm = () => {
    setResult(null);
    setStep(1);
    setWorkType("");
    setComplexity([]);
    setIncomeSource("");
    setLocation("");
  };

  return (
    <div className="min-h-[80vh] bg-muted/30 py-12">
      <div className="container-padding mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">Tax Status Check</h1>
          <p className="mt-4 text-muted-foreground">Answer a few questions to understand your tax obligations.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            <Card className="glass-card p-6">
              {/* Step 1: Work Type */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-lg font-medium">How do you earn income?</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>Select the option that best describes your main source of money</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <RadioGroup value={workType} onValueChange={setWorkType} className="flex flex-col gap-3">
                      {WORK_TYPES.map((type) => (
                        <div key={type.id} className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50">
                          <RadioGroupItem value={type.id} id={type.id} />
                          <div className="flex flex-1 items-center justify-between">
                            <Label htmlFor={type.id} className="cursor-pointer font-normal">{type.label}</Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-muted-foreground/50" />
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p className="w-48 text-xs">{type.tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <Button onClick={handleNext} disabled={!workType} className="w-full">
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Step 2: Complexity */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-lg font-medium">Does your business have any of these?</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>This helps determine how your activity is treated for tax readiness</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {COMPLEXITY_INDICATORS.map((item) => (
                        <div key={item.id} className="flex items-start space-x-2 rounded-lg border p-3">
                          <Checkbox 
                            id={item.id} 
                            checked={complexity.includes(item.id)}
                            onCheckedChange={(checked) => {
                              if (checked) setComplexity([...complexity, item.id]);
                              else setComplexity(complexity.filter(c => c !== item.id));
                            }}
                          />
                          <div className="flex flex-1 items-center justify-between">
                            <Label htmlFor={item.id} className="cursor-pointer font-normal">{item.label}</Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-muted-foreground/50" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">{item.tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="w-1/3">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={handleNext} className="w-2/3">
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Income Source */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-lg font-medium">Where is your money earned?</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>This affects how certain tax rules apply to you</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <RadioGroup value={incomeSource} onValueChange={setIncomeSource} className="flex flex-col gap-3">
                      {INCOME_SOURCES.map((source) => (
                        <div key={source.id} className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50">
                          <RadioGroupItem value={source.id} id={source.id} />
                          <div className="flex flex-1 items-center justify-between">
                            <Label htmlFor={source.id} className="cursor-pointer font-normal">{source.label}</Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-muted-foreground/50" />
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p className="w-48 text-xs">{source.tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(workType === "business" || workType === "mix" ? 2 : 1)} className="w-1/3">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={handleNext} disabled={!incomeSource} className="w-2/3">
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Location */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-lg font-medium">Where do you reside?</Label>
                    <Select onValueChange={setLocation} value={location}>
                      <SelectTrigger className="h-12 bg-white/50">
                        <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                      <SelectContent>
                        {Locations.map(loc => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(3)} className="w-1/3">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={calculateResult} disabled={!location} className="w-2/3">
                      See Results <Check className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {result ? (
              <Card className="h-full overflow-hidden border-primary/20 bg-primary/5 p-6 shadow-xl">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-primary">Your Tax Summary</h3>
                </div>
                
                <div className="space-y-4">
                  {result.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm"
                    >
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{item}</p>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground/40" />
                          </TooltipTrigger>
                          <TooltipContent>
                             <p className="w-40 text-xs">This is a key tax obligation based on your inputs.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 border border-yellow-200">
                  <strong>Disclaimer:</strong> This platform provides tax readiness education only. Please consult a qualified professional.
                </div>

                <Button variant="ghost" onClick={resetForm} className="mt-4 w-full text-muted-foreground hover:text-foreground">
                  <RefreshCcw className="mr-2 h-4 w-4" /> Check another scenario
                </Button>
              </Card>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-white/50 p-12 text-center text-muted-foreground">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No data yet</h3>
                <p className="mt-2 text-sm">Answer the questions to generate your personalized tax summary.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
