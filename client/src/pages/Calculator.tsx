
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Calculator as CalcIcon, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";

type FormData = {
  grossIncome: number;
  pension: number;
  nhf: number;
  nhis: number;
  loanInterest: number;
  lifeInsurance: number;
  annualRent: number;
};

type CalculationResult = {
  success: boolean;
  data: {
    grossIncome: number;
    taxableIncome: number;
    totalDeductions: number;
    deductionsBreakdown: {
      "NHF Contribution": number;
      "NHIS Contribution": number;
      "Pension Contribution": number;
      "Interest on Loan": number;
      "Life Insurance": number;
      "Rent Relief": number;
    };
    totalTax: number;
    monthlyTax: number;
    effectiveRate: number;
    taxBreakdown: Array<{
      label: string;
      amount: number;
      tax: number;
    }>;
  };
};

export default function Calculator() {
  const { toast } = useToast();
  const [result, setResult] = useState<CalculationResult | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      grossIncome: 0,
      pension: 0,
      nhf: 0,
      nhis: 0,
      loanInterest: 0,
      lifeInsurance: 0,
      annualRent: 0
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest("POST", "/api/calculate-paye", data);
      return await res.json();
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Calculation Complete",
        description: "Your tax breakdown has been generated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Calculation Failed",
        description: "Could not calculate tax. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  const onSubmit = (data: FormData) => {
    // Convert string inputs to numbers if necessary (react-hook-form handles number type but safe to check)
    const numericData = {
        grossIncome: Number(data.grossIncome),
        pension: Number(data.pension),
        nhf: Number(data.nhf),
        nhis: Number(data.nhis),
        loanInterest: Number(data.loanInterest),
        lifeInsurance: Number(data.lifeInsurance),
        annualRent: Number(data.annualRent)
    };
    mutation.mutate(numericData);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-2">
                <CalcIcon className="w-8 h-8 text-green-600" />
                PIT Calculator (2025 Act)
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
                Calculate your Personal Income Tax under the new Nigeria Tax Act, 2025 (NTA) regulations.
            </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Input Section - Keeps its compact width */}
            <div className="lg:col-span-4">
                <Card className="h-full shadow-md">
                    <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b pb-4">
                        <CardTitle className="text-lg">Income & Deductions</CardTitle>
                        <CardDescription>Enter your annual figures</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            
                            <div className="space-y-2">
                                <Label htmlFor="grossIncome">Gross Annual Income (₦) <span className="text-red-500">*</span></Label>
                                <Input 
                                    id="grossIncome" 
                                    type="number" 
                                    placeholder="e.g. 12000000"
                                    className="h-11 text-lg"
                                    {...register("grossIncome", { required: true, min: 0 })}
                                />
                                {errors.grossIncome && <span className="text-sm text-red-500">Required</span>}
                            </div>

                            <Separator className="my-4" />
                            <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Reliefs & Deductions</h4>
                                <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="pension" className="text-xs uppercase text-gray-500">Pension</Label>
                                        <Input id="pension" type="number" {...register("pension")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nhf" className="text-xs uppercase text-gray-500">NHF</Label>
                                        <Input id="nhf" type="number" {...register("nhf")} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nhis" className="text-xs uppercase text-gray-500">NHIS</Label>
                                        <Input id="nhis" type="number" {...register("nhis")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lifeInsurance" className="text-xs uppercase text-gray-500">Life Insurance</Label>
                                        <Input id="lifeInsurance" type="number" {...register("lifeInsurance")} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="loanInterest" className="text-xs uppercase text-gray-500">Loan Interest (Owner Occupied)</Label>
                                    <Input id="loanInterest" type="number" {...register("loanInterest")} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="annualRent" className="text-xs uppercase text-gray-500">Annual Rent</Label>
                                    <Input id="annualRent" type="number" {...register("annualRent")} />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full bg-green-600 hover:bg-green-700 text-white mt-6 h-11 text-lg shadow-sm"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Calculating...
                                    </>
                                ) : (
                                    "Calculate Tax"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Results Section - Expanded Width */}
            <div className="lg:col-span-8">
                {result ? (
                    <Card className="shadow-lg border-green-100 dark:border-green-900 overflow-hidden">
                        <CardHeader className="bg-green-600 text-white py-4">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <CalcIcon className="w-5 h-5" />
                                Calculation Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            
                            <div className="p-6 space-y-8">
                                
                                {/* 1. Income Breakdown Table */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 border-l-4 border-green-500 pl-3">Income Breakdown</h3>
                                    <div className="bg-white dark:bg-gray-800 rounded-md border overflow-hidden">
                                        <table className="w-full text-sm">
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                <tr className="hover:bg-gray-50/50">
                                                    <td className="px-5 py-3 text-gray-600 font-medium">Gross Annual Income</td>
                                                    <td className="px-5 py-3 text-right font-bold text-gray-900 dark:text-white text-base">
                                                        {formatCurrency(result.data.grossIncome)}
                                                    </td>
                                                </tr>
                                                {/* Deductions Items */}
                                                {[
                                                    { label: "NHF Contribution", val: result.data.deductionsBreakdown["NHF Contribution"] },
                                                    { label: "NHIS Contribution", val: result.data.deductionsBreakdown["NHIS Contribution"] },
                                                    { label: "Pension Contribution", val: result.data.deductionsBreakdown["Pension Contribution"] },
                                                    { label: "Interest on Loan (Owner Occupied House)", val: result.data.deductionsBreakdown["Interest on Loan"] },
                                                    { label: "Life Insurance Premium", val: result.data.deductionsBreakdown["Life Insurance"] },
                                                    { label: "Rent Relief", val: result.data.deductionsBreakdown["Rent Relief"] },
                                                ].map((item, i) => (
                                                    <tr key={i} className="hover:bg-gray-50/50">
                                                        <td className="px-5 py-2 text-gray-500">{item.label}</td>
                                                        <td className="px-5 py-2 text-right text-gray-700 dark:text-gray-300">
                                                            {item.val > 0 ? `(${formatCurrency(item.val).replace('₦', '')})` : "(0)"}
                                                        </td>
                                                    </tr>
                                                ))}
                                                
                                                <tr className="bg-green-50/50 dark:bg-green-900/10 border-t-2 border-dashed border-gray-200">
                                                    <td className="px-5 py-4 font-bold text-gray-800 dark:text-gray-200 text-base">Taxable Income</td>
                                                    <td className="px-5 py-4 text-right font-bold text-green-700 dark:text-green-400 text-lg">
                                                        {formatCurrency(result.data.taxableIncome)}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* 2. Tax Brackets Table */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 border-l-4 border-green-500 pl-3">Tax Brackets</h3>
                                    <div className="bg-white dark:bg-gray-800 rounded-md border overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50 dark:bg-gray-900 border-b">
                                                <tr>
                                                    <th className="px-5 py-3 text-left font-semibold text-gray-600">Tax Brackets</th>
                                                    <th className="px-5 py-3 text-right font-semibold text-gray-600">Taxable Income</th>
                                                    <th className="px-5 py-3 text-right font-semibold text-gray-600">Tax Due</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                {result.data.taxBreakdown.map((item, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50/50">
                                                        <td className="px-5 py-3 text-gray-600">{item.label}</td>
                                                        <td className="px-5 py-3 text-right text-gray-700">{formatCurrency(item.amount)}</td>
                                                        <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                                                            {item.tax > 0 ? formatCurrency(item.tax) : "0"}
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-green-50/50 dark:bg-green-900/10 font-bold border-t-2 border-green-100">
                                                    <td className="px-5 py-4 text-gray-800 dark:text-gray-200 uppercase tracking-wide">Total</td>
                                                    <td className="px-5 py-4 text-right text-gray-800 dark:text-gray-200">
                                                        {formatCurrency(result.data.taxableIncome)}
                                                    </td>
                                                    <td className="px-5 py-4 text-right text-green-700 dark:text-green-400 text-lg">
                                                        {formatCurrency(result.data.totalTax)}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* 3. Summary Section */}
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b pb-2 flex items-center gap-2">
                                        Summary
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                            <p className="text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">Monthly Salary</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(result.data.grossIncome / 12)}</p>
                                        </div>
                                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
                                            <p className="text-red-600 dark:text-red-400 text-xs font-semibold uppercase tracking-wider mb-1">Monthly PAYE Tax</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(result.data.monthlyTax)}</p>
                                        </div>
                                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-900/30">
                                            <p className="text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">Effective Tax Rate</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{result.data.effectiveRate.toFixed(1)}%</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-gray-900 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
                            <CalcIcon className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Ready to Calculate</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md text-lg">
                            Enter your financial details on the left to generate your comprehensive 2025 tax breakdown.
                        </p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
