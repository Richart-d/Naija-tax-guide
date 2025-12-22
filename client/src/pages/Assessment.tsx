import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assessmentSchema, type AssessmentInput } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check, X, ArrowRight, Gauge } from "lucide-react";

export default function Assessment() {
  const [score, setScore] = useState<{ level: string; color: string; advice: string[] } | null>(null);

  const form = useForm<AssessmentInput>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      hasTIN: false,
      keepsRecords: false,
      filedLastYear: false,
      understandsDeductions: false,
      separatesBusinessPersonal: false,
    }
  });

  const onSubmit = (data: AssessmentInput) => {
    let points = 0;
    const advice = [];

    if (data.hasTIN) points += 20;
    else advice.push("Register for a TIN immediately. It's the first step.");

    if (data.keepsRecords) points += 20;
    else advice.push("Start keeping organized records of all income and expenses.");

    if (data.filedLastYear) points += 20;
    else advice.push("File your returns for the previous year to avoid penalties.");

    if (data.understandsDeductions) points += 20;
    else advice.push("Learn about tax deductions to legally reduce your tax bill.");

    if (data.separatesBusinessPersonal) points += 20;
    else advice.push("Open a separate bank account for business transactions.");

    let level = "Low Readiness";
    let color = "bg-red-500";
    if (points >= 80) {
      level = "High Readiness";
      color = "bg-green-500";
    } else if (points >= 40) {
      level = "Medium Readiness";
      color = "bg-yellow-500";
    }

    setScore({ level, color, advice });
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container-padding mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">Compliance Health Check</h1>
          <p className="mt-4 text-muted-foreground">Answer 5 simple yes/no questions to gauge your tax readiness.</p>
        </div>

        {!score ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-8 shadow-lg">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid gap-6">
                    {[
                      { name: "hasTIN", label: "Do you have a Taxpayer Identification Number (TIN)?" },
                      { name: "keepsRecords", label: "Do you keep proper records of income and expenses?" },
                      { name: "filedLastYear", label: "Did you file your tax returns last year?" },
                      { name: "understandsDeductions", label: "Do you know what expenses are tax-deductible?" },
                      { name: "separatesBusinessPersonal", label: "Do you maintain separate business and personal accounts?" },
                    ].map((item) => (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name={item.name as keyof AssessmentInput}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm transition-colors hover:bg-muted/50">
                            <FormLabel className="text-base font-medium text-foreground cursor-pointer flex-1">
                              {item.label}
                            </FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="ml-4"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  <Button type="submit" size="lg" className="w-full text-lg h-12">
                    Calculate Score <Gauge className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </Form>
            </Card>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="overflow-hidden shadow-xl">
              <div className={`p-8 text-center text-white ${score.color}`}>
                <Gauge className="mx-auto h-12 w-12 opacity-80" />
                <h2 className="mt-4 font-display text-3xl font-bold">{score.level}</h2>
                <p className="mt-2 opacity-90">Based on your responses</p>
              </div>

              <div className="p-8">
                <h3 className="mb-4 text-lg font-bold text-foreground">Recommendations for you:</h3>
                {score.advice.length > 0 ? (
                  <ul className="space-y-3">
                    {score.advice.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center py-6 text-center text-green-600">
                    <Check className="mb-2 h-10 w-10" />
                    <p className="font-medium">Excellent! You seem fully compliant.</p>
                  </div>
                )}

                <div className="mt-8 flex gap-4">
                  <Button variant="outline" onClick={() => setScore(null)} className="flex-1">
                    Retake Quiz
                  </Button>
                  <Button className="flex-1">
                    Save Report
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
