import { useState } from "react";
import { UserTypes, Locations } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowRight,
  Check,
  AlertCircle,
  RefreshCcw,
  Info,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";

// Internal options for Step 1: Work Type
const WORK_TYPES = [
  {
    id: "salary",
    label: "I earn a salary from an employer",
    tooltip: "Employer pays you and may deduct PAYE",
  },
  {
    id: "freelance",
    label: "I work for myself alone (freelance, gigs, personal services)",
    tooltip: "You earn directly from your personal skills or services",
  },
  {
    id: "business",
    label: "I run a small business that sells goods or services",
    tooltip: "Business sells goods/services and may operate beyond just you",
  },
  {
    id: "mix",
    label: "I do a mix of the above",
    tooltip: "More than one income source",
  },
  {
    id: "company",
    label: "I run a registered company (LTD)",
    tooltip: "Business is legally separate from you",
  },
  {
    id: "ngo",
    label: "I run or manage a non-profit / NGO / charity / association",
    tooltip:
      "Non-profits may still have tax obligations depending on how they earn income",
  },
] as const;

// Step 2a: Complexity Indicators (for business/mix)
const COMPLEXITY_INDICATORS = [
  {
    id: "staff",
    label: "Staff or helpers",
    tooltip: "Anyone you pay to help you work",
  },
  {
    id: "shop",
    label: "A shop, outlet, or POS terminal",
    tooltip: "Physical location or payment terminal",
  },
  {
    id: "sales",
    label: "Regular daily sales",
    tooltip: "Frequent transactions, not just occasional gigs",
  },
  {
    id: "cac",
    label: "Business name or CAC registration",
    tooltip: "Registered with Corporate Affairs Commission",
  },
] as const;

// Step 2b: NGO Classification (for NGO)
const NGO_TYPES = [
  {
    id: "religious",
    label: "Religious or faith-based organisation",
    tooltip: "Includes churches, mosques, temples, etc.",
  },
  {
    id: "charity",
    label: "Charity or foundation",
    tooltip: "Established to provide charitable services",
  },
  {
    id: "ngo",
    label: "NGO / non-profit organisation",
    tooltip: "Non-governmental, non-profit focused",
  },
  {
    id: "cooperative",
    label: "Cooperative society",
    tooltip: "Member-owned, democratic organisation",
  },
  {
    id: "union",
    label: "Trade union or professional association",
    tooltip: "Represents workers or professionals",
  },
] as const;

// Step 3: NGO Income Types (only shown if NGO selected)
const NGO_INCOME_TYPES = [
  {
    id: "donations",
    label: "Donations, grants, tithes, or gifts",
    tooltip: "Money given without expectation of return",
  },
  {
    id: "membership",
    label: "Membership dues or subscriptions",
    tooltip: "Income from members paying to belong",
  },
  {
    id: "sales",
    label: "Sale of goods or merchandise",
    tooltip: "Selling physical products",
  },
  {
    id: "training",
    label: "Paid training, consultancy, or events",
    tooltip: "Charging for educational or consulting services",
  },
  {
    id: "rent",
    label: "Rent, licensing, or service fees",
    tooltip: "Income from property or service charges",
  },
] as const;

// Step 4: Income Source
const INCOME_SOURCES = [
  {
    id: "local",
    label: "Earned within Nigeria",
    tooltip: "Money from Nigerian clients, businesses, or employers",
  },
  {
    id: "foreign",
    label: "Earned from outside Nigeria (Foreign)",
    tooltip: "Money from international clients or foreign companies",
  },
  {
    id: "mixed",
    label: "Mix of Nigerian and foreign earnings",
    tooltip: "Income from both Nigerian and international sources",
  },
] as const;

export default function Classifier() {
  const [step, setStep] = useState(1);
  const [workType, setWorkType] = useState<string>("");
  const [complexity, setComplexity] = useState<string[]>([]);
  const [ngoType, setNgoType] = useState<string[]>([]);
  const [ngoIncome, setNgoIncome] = useState<string[]>([]);
  const [incomeSource, setIncomeSource] = useState<string>("");
  // Location step removed as per new logic
  const [result, setResult] = useState<string[] | null>(null);

  const handleNext = () => {
    // UPDATED: Freelance now goes to Step 2 (Complexity) as well
    if (step === 1) {
      if (workType === "ngo" || workType === "business" || workType === "mix" || workType === "freelance") {
        setStep(2);
      } else {
        setStep(4); // Skip to income source for other types (salary, company)
      }
    } else if (step === 2) {
      if (workType === "ngo") {
        setStep(3); // Go to NGO Income
      } else {
        setStep(4); // Go to Income Source (from Complexity)
      }
    } else if (step === 3) {
      setStep(4); // From NGO Income to Income Source
    }
    // Step 4 is now the final step for input
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 4) {
      if (workType === "ngo") {
        setStep(3); // Back to NGO Income
      } else if (workType === "business" || workType === "mix" || workType === "freelance") {
        setStep(2); // Back to Complexity
      } else {
        setStep(1); // Back to Work Type
      }
    }
  };

  const calculateResult = () => {
    const taxes: string[] = [];
    let classification = "";

    // NGO Classification and Results
    if (workType === "ngo") {
      classification = "Non-Profit Organisation";
      
      const ngoTypeLabels = ngoType.map(t => NGO_TYPES.find(type => type.id === t)?.label).filter(Boolean);
      const ngoIncomeLabels = ngoIncome.map(t => NGO_INCOME_TYPES.find(inc => inc.id === t)?.label).filter(Boolean);
      
      if (ngoTypeLabels.length > 0) {
        taxes.push(`Organisation Type: ${ngoTypeLabels.join(", ")}`);
      }
      
      if (ngoIncomeLabels.length > 0) {
        taxes.push(`Income Sources: ${ngoIncomeLabels.join(", ")}`);
      }

      taxes.push("Tax Readiness Note: Many donations and grants may be exempt from tax. However, income from services, sales, or commercial activities may be subject to taxation.");
      
      if (ngoIncome.includes("sales") || ngoIncome.includes("training") || ngoIncome.includes("rent")) {
        taxes.push("Commercial Income Alert: When your NGO earns money from selling goods, providing paid services, or charging fees, that income may be treated as business income and subject to VAT and company income tax.");
        taxes.push("Tax Authority for Commercial Income: Register for VAT and CIT with Nigeria Revenue Service (NRS).");
        taxes.push("Withholding Tax (WHT): If the organisation earns money from selling goods, providing paid services, or charging fees, that income may be treated as business income and can be subject to VAT and company income tax and must deduct WHT on applicable transactions.");
      }
      
      if (ngoIncome.includes("donations") || ngoIncome.includes("membership")) {
        taxes.push("Donation/Membership Income: These sources may qualify for tax-exempt status if your organisation is registered.");
      }

      taxes.push("Important: NGO tax treatment depends on your specific registration and activities. Consult with a tax professional about your organisation's status.");
      
      // Generic WHT note for NGO
      taxes.push("Withholding Tax (WHT): Any corporate body (other than an individual), government ministry, department or agency (MDA), statutory body, or public authority must deduct WHT on applicable transactions.");

    } else {
      // Original non-NGO logic
      if (workType === "salary") classification = "Salary Earner";
      else if (workType === "freelance") classification = "Self-Employed";
      else if (workType === "company") classification = "Company Owner";
      else if (workType === "mix") classification = "Mixed Income";
      else if (workType === "business") {
        if (complexity.length > 0) classification = "Business Owner";
        else classification = "Self-Employed";
      }

      if (classification === "Salary Earner") {
        taxes.push("PAYE (Pay As You Earn) - Your employer handles this.");
      } else if (classification === "Company Owner") {
        taxes.push("CIT (Companies Income Tax) - Paid to Nigeria Revenue Service (NRS).");
        taxes.push("VAT (Value Added Tax) - Paid to Nigeria Revenue Service (NRS).");
        taxes.push("Note: Directors still have personal tax obligations (PIT) - paid to State Internal Revenue Service (SIRS).");
        taxes.push("Withholding Tax (WHT): Any corporate body (other than an individual), government ministry, department or agency (MDA), statutory body, or public authority must deduct WHT on applicable transactions.");
      } else if (classification === "Mixed Income") {
        taxes.push("PIT (Personal Income Tax) on your private earnings - paid to State Internal Revenue Service (SIRS).");
        taxes.push("PAYE on any salary portion - handled by employer, remitted to SIRS.");
      } else {
        // Self-Employed / Business Owner
        taxes.push("PIT (Personal Income Tax) - Direct Assessment, paid to State Internal Revenue Service (SIRS).");
        if (complexity.includes("shop") || complexity.includes("sales")) {
          taxes.push("VAT (Value Added Tax) - Register with Nigeria Revenue Service (NRS) if turnover exceeds ₦25 million.");
        }
        if (complexity.includes("staff")) {
          taxes.push("PAYE for Staff - Deduct and remit to State Internal Revenue Service (SIRS).");
        }
      }
    }

    // Income Source Logic (applies to non-NGO)
    if (workType !== "ngo") {
      if (incomeSource === "foreign" || incomeSource === "mixed") {
        taxes.push("Foreign Income may have tax exemptions if you paid tax abroad (Residency Rule).");
      }
    }

    // FINAL AUTHORITY SUMMARY (Hardcoded logic based on type)
    if (classification === "Company Owner") {
      taxes.push("PRIMARY AUTHORITY: Nigeria Revenue Service (NRS) for all company taxes (CIT, VAT, etc).");
    } else if (classification === "Non-Profit Organisation") {
       taxes.push("AUTHORITY GUIDANCE: NRS for any taxable commercial income/VAT. Check with authorities for exemption status.");
    } else {
      // Everyone else (Individual, Enteprise, Salary, etc) -> SIRS
      taxes.push("PRIMARY AUTHORITY: State Internal Revenue Service (SIRS) for all personal taxes (PIT, PAYE).");
    }

    // ADDED: Business Registration & TIN Note (Freelance, Business, Mix)
    if (workType === "freelance" || workType === "business" || workType === "mix") {
        taxes.push("Business Registration & TIN: All businesses must be registered with the Corporate Affairs Commission (CAC) and obtain a Tax Identification Number (TIN).");
    }

    // ADDED: Record-Keeping Reminder (All Users)
    taxes.push("Record-Keeping Reminder: Maintaining accurate financial records (invoices, receipts, and expenses) is crucial for tax compliance and for proving eligibility for exemptions or reliefs.");

    setResult(taxes);
  };

  const resetForm = () => {
    setResult(null);
    setStep(1);
    setWorkType("");
    setComplexity([]);
    setNgoType([]);
    setNgoIncome([]);
    setIncomeSource("");
  };

  return (
    <div className="min-h-[80vh] bg-muted/30 py-12">
      <div className="container-padding mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
            Tax Status Check
          </h1>
          <p className="mt-4 text-muted-foreground">
            Answer a few questions to understand your tax obligations.
          </p>
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
                      <Label className="text-lg font-medium">
                        How do you earn income?
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Select the option that best describes your main
                            source of money
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <RadioGroup
                      value={workType}
                      onValueChange={setWorkType}
                      className="flex flex-col gap-3"
                    >
                      {WORK_TYPES.map((type) => (
                        <div
                          key={type.id}
                          className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50"
                        >
                          <RadioGroupItem value={type.id} id={type.id} />
                          <div className="flex flex-1 items-center justify-between">
                            <Label
                              htmlFor={type.id}
                              className="cursor-pointer font-normal"
                            >
                              {type.label}
                            </Label>
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
                  <Button
                    onClick={handleNext}
                    disabled={!workType}
                    className="w-full"
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Step 2: Complexity (for business/mix) or NGO Type (for ngo) */}
              {step === 2 && workType === "ngo" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-lg font-medium">
                        Which best describes your organisation?
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            These labels do not automatically mean tax-free
                            status
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="flex flex-col gap-3">
                      {NGO_TYPES.map((type) => (
                        <div
                          key={type.id}
                          className="flex items-start space-x-2 rounded-lg border p-3"
                        >
                          <Checkbox
                            id={type.id}
                            checked={ngoType.includes(type.id)}
                            onCheckedChange={(checked) => {
                              if (checked) setNgoType([...ngoType, type.id]);
                              else
                                setNgoType(
                                  ngoType.filter((t) => t !== type.id)
                                );
                            }}
                          />
                          <div className="flex flex-1 items-center justify-between">
                            <Label
                              htmlFor={type.id}
                              className="cursor-pointer font-normal"
                            >
                              {type.label}
                            </Label>
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
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="w-1/3"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={handleNext} className="w-2/3">
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Complexity (for business/mix/freelance) */}
              {step === 2 &&
                (workType === "business" || workType === "mix" || workType === "freelance") && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-lg font-medium">
                          Does your business have any of these?
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              This helps determine how your activity is treated
                              for tax readiness
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <div className="flex flex-col gap-3">
                        {COMPLEXITY_INDICATORS.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start space-x-2 rounded-lg border p-3"
                          >
                            <Checkbox
                              id={item.id}
                              checked={complexity.includes(item.id)}
                              onCheckedChange={(checked) => {
                                if (checked)
                                  setComplexity([...complexity, item.id]);
                                else
                                  setComplexity(
                                    complexity.filter((c) => c !== item.id)
                                  );
                              }}
                            />
                            <div className="flex flex-1 items-center justify-between">
                              <Label
                                htmlFor={item.id}
                                className="cursor-pointer font-normal"
                              >
                                {item.label}
                              </Label>
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
                      <Button
                        variant="outline"
                        onClick={handleBack}
                        className="w-1/3"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button onClick={handleNext} className="w-2/3">
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

              {/* Step 3: NGO Income Types (only if NGO) */}
              {step === 3 && workType === "ngo" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-lg font-medium">
                        Does your organisation receive income from any of these?
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            This helps us understand your tax readiness needs
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="flex flex-col gap-3">
                      {NGO_INCOME_TYPES.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start space-x-2 rounded-lg border p-3"
                        >
                          <Checkbox
                            id={item.id}
                            checked={ngoIncome.includes(item.id)}
                            onCheckedChange={(checked) => {
                              if (checked)
                                setNgoIncome([...ngoIncome, item.id]);
                              else
                                setNgoIncome(
                                  ngoIncome.filter((i) => i !== item.id)
                                );
                            }}
                          />
                          <div className="flex flex-1 items-center justify-between">
                            <Label
                              htmlFor={item.id}
                              className="cursor-pointer font-normal"
                            >
                              {item.label}
                            </Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-muted-foreground/50" />
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p className="w-48 text-xs">{item.tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="w-1/3"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={handleNext} className="w-2/3">
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Income Source (only for non-NGO; NGO skips this if needed) */}
              {step === 4 && workType !== "ngo" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-lg font-medium">
                        Where is your money earned?
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            This affects how certain tax rules apply to you
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <RadioGroup
                      value={incomeSource}
                      onValueChange={setIncomeSource}
                      className="flex flex-col gap-3"
                    >
                      {INCOME_SOURCES.map((source) => (
                        <div
                          key={source.id}
                          className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50"
                        >
                          <RadioGroupItem value={source.id} id={source.id} />
                          <div className="flex flex-1 items-center justify-between">
                            <Label
                              htmlFor={source.id}
                              className="cursor-pointer font-normal"
                            >
                              {source.label}
                            </Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-muted-foreground/50" />
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p className="w-48 text-xs">
                                    {source.tooltip}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="w-1/3"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      onClick={calculateResult}
                      disabled={!incomeSource}
                      className="w-2/3"
                    >
                      See Results <Check className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4 for NGO: Income Source */}
              {step === 4 && workType === "ngo" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-lg font-medium">
                        Where is your organisation's money earned?
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            This affects how certain tax rules apply to your
                            organisation
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <RadioGroup
                      value={incomeSource}
                      onValueChange={setIncomeSource}
                      className="flex flex-col gap-3"
                    >
                      {INCOME_SOURCES.map((source) => (
                        <div
                          key={source.id}
                          className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50"
                        >
                          <RadioGroupItem value={source.id} id={source.id} />
                          <div className="flex flex-1 items-center justify-between">
                            <Label
                              htmlFor={source.id}
                              className="cursor-pointer font-normal"
                            >
                              {source.label}
                            </Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-muted-foreground/50" />
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p className="w-48 text-xs">
                                    {source.tooltip}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="w-1/3"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      onClick={calculateResult}
                      disabled={!incomeSource}
                      className="w-2/3"
                    >
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
                  <h3 className="font-display text-xl font-bold text-primary">
                    Your Tax Readiness Summary
                  </h3>
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
                        <p className="text-sm font-medium text-foreground">
                          {item}
                        </p>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground/40" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-40 text-xs">
                              This is key information for your tax readiness
                              based on your inputs.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 border border-yellow-200">
                  <strong>Disclaimer:</strong> This platform provides tax
                  readiness education only. Please consult a qualified
                  professional for specific advice about your situation.
                </div>

                <Button
                  variant="ghost"
                  onClick={resetForm}
                  className="mt-4 w-full text-muted-foreground hover:text-foreground"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" /> Check another scenario
                </Button>
              </Card>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-white/50 p-12 text-center text-muted-foreground">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No data yet</h3>
                <p className="mt-2 text-sm">
                  Answer the questions to generate your personalized tax
                  readiness summary.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
