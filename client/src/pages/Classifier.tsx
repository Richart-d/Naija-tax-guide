import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  taxProfileSchema, 
  type TaxProfile,
  UserTypes,
  IncomeSources,
  Locations
} from "@shared/schema";
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Check, AlertCircle, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function Classifier() {
  const [result, setResult] = useState<string[] | null>(null);

  const form = useForm<TaxProfile>({
    resolver: zodResolver(taxProfileSchema),
  });

  const onSubmit = (data: TaxProfile) => {
    // Client-side Logic (as requested)
    const taxes = [];
    
    // Logic: User Type based
    if (data.userType === "Salary Earner") {
      taxes.push("PAYE (Pay As You Earn) - Your employer handles this.");
    } else {
      taxes.push("PIT (Personal Income Tax) - Direct Assessment.");
    }

    // Logic: Income Source
    if (data.incomeSource === "Foreign" || data.incomeSource === "Mixed") {
      taxes.push("Foreign Income Tax Exemptions might apply if tax paid abroad.");
    }

    // Logic: VAT (Simplification for demo)
    if (data.userType === "Business Owner" || data.userType === "Freelancer") {
      taxes.push("VAT (Value Added Tax) - If annual turnover > ₦25m.");
      taxes.push("WHT (Withholding Tax) - May be deducted from your invoices.");
    }

    // Logic: Location
    if (data.location === "Abuja") {
      taxes.push("FCT IRS is your relevant tax authority.");
    } else {
      taxes.push("State Internal Revenue Service (SIRS) is your tax authority.");
    }

    setResult(taxes);
  };

  const resetForm = () => {
    setResult(null);
    form.reset();
  };

  return (
    <div className="min-h-[80vh] bg-muted/30 py-12">
      <div className="container-padding mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">Tax Status Check</h1>
          <p className="mt-4 text-muted-foreground">Select your details to see which taxes likely apply to you.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            <Card className="glass-card p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <FormField
                    control={form.control}
                    name="userType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>I am a...</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-white/50">
                              <SelectValue placeholder="Select User Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {UserTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="incomeSource"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>My income comes from...</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-white/50">
                              <SelectValue placeholder="Select Source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {IncomeSources.map(source => (
                              <SelectItem key={source} value={source}>{source}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>I reside in...</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-white/50">
                              <SelectValue placeholder="Select Location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Locations.map(loc => (
                              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" size="lg" className="w-full">
                    Check Status <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
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
                      <p className="text-sm font-medium text-foreground">{item}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 border border-yellow-200">
                  <strong>Disclaimer:</strong> This is a general guide. Please consult a qualified tax consultant for specific advice.
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
                <p className="mt-2 text-sm">Fill out the form to generate your personalized tax summary.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
