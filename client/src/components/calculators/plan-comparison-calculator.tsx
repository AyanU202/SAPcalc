import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Diff, CalculatorIcon } from "lucide-react";
import { CurrencyInput } from "@/components/ui/currency-input";
import { calculatorUtils } from "@/utils/calculator";
import { useCalculator } from "@/contexts/calculator-context";
import { useEffect } from "react";

const formSchema = z.object({
  plan1: z.object({
    initialInvestment: z.number().min(0, "Cannot be negative"),
    monthlyContribution: z.number().min(0, "Cannot be negative"),
    interestRate: z.number().min(1, "Minimum 1%").max(30, "Maximum 30%"),
    timePeriod: z.number().min(1, "Minimum 1 year").max(50, "Maximum 50 years")
  }),
  plan2: z.object({
    initialInvestment: z.number().min(0, "Cannot be negative"),
    monthlyContribution: z.number().min(0, "Cannot be negative"),
    interestRate: z.number().min(1, "Minimum 1%").max(30, "Maximum 30%"),
    timePeriod: z.number().min(1, "Minimum 1 year").max(50, "Maximum 50 years")
  })
});

type FormValues = z.infer<typeof formSchema>;

export function PlanComparisonCalculator() {
  const { t } = useTranslation();
  const { setCalculationResult } = useCalculator();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan1: {
        initialInvestment: 10000,
        monthlyContribution: 5000,
        interestRate: 8,
        timePeriod: 5
      },
      plan2: {
        initialInvestment: 5000,
        monthlyContribution: 2000,
        interestRate: 12,
        timePeriod: 5
      }
    }
  });

  const onSubmit = (values: FormValues) => {
    // Calculate results for both plans
    const plan1Result = calculatorUtils.calculateBasic(
      values.plan1.initialInvestment,
      values.plan1.monthlyContribution,
      values.plan1.timePeriod,
      values.plan1.interestRate,
      "monthly"
    );
    
    const plan2Result = calculatorUtils.calculateBasic(
      values.plan2.initialInvestment,
      values.plan2.monthlyContribution,
      values.plan2.timePeriod,
      values.plan2.interestRate,
      "monthly"
    );

    // Set calculation result for chart
    const betterPlan = plan1Result.finalAmount > plan2Result.finalAmount ? 1 : 2;
    
    setCalculationResult({
      type: 'compare',
      plan1: {
        ...plan1Result,
        ...values.plan1
      },
      plan2: {
        ...plan2Result,
        ...values.plan2
      },
      // Use better plan for chart visualization
      finalAmount: betterPlan === 1 ? plan1Result.finalAmount : plan2Result.finalAmount,
      totalInvestment: betterPlan === 1 
        ? plan1Result.totalInvestment 
        : plan2Result.totalInvestment,
      totalInterest: betterPlan === 1 
        ? plan1Result.totalInterest 
        : plan2Result.totalInterest,
      interestRate: betterPlan === 1 
        ? values.plan1.interestRate 
        : values.plan2.interestRate,
      timePeriod: betterPlan === 1 
        ? values.plan1.timePeriod 
        : values.plan2.timePeriod
    });
  };

  // Reset calculation when component unmounts
  useEffect(() => {
    return () => setCalculationResult(null);
  }, [setCalculationResult]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Diff className="h-5 w-5 mr-2 text-primary" />
          {t('compareCalc.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Plan 1 */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                <h3 className="font-medium mb-3">{t('compareCalc.plan1')}</h3>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="plan1.initialInvestment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.initialInvestment')}</FormLabel>
                        <FormControl>
                          <CurrencyInput
                            {...field}
                            onChange={field.onChange}
                            placeholder="e.g. 10000"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="plan1.monthlyContribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.monthlyContribution')}</FormLabel>
                        <FormControl>
                          <CurrencyInput
                            {...field}
                            onChange={field.onChange}
                            placeholder="e.g. 5000"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="plan1.interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.interestRate')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            placeholder="e.g. 8"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="plan1.timePeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.timePeriod')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            placeholder="e.g. 5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Plan 2 */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                <h3 className="font-medium mb-3">{t('compareCalc.plan2')}</h3>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="plan2.initialInvestment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.initialInvestment')}</FormLabel>
                        <FormControl>
                          <CurrencyInput
                            {...field}
                            onChange={field.onChange}
                            placeholder="e.g. 5000"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="plan2.monthlyContribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.monthlyContribution')}</FormLabel>
                        <FormControl>
                          <CurrencyInput
                            {...field}
                            onChange={field.onChange}
                            placeholder="e.g. 2000"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="plan2.interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.interestRate')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            placeholder="e.g. 12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="plan2.timePeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.timePeriod')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            placeholder="e.g. 5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              <Diff className="h-4 w-4 mr-2" />
              {t('compareCalc.comparePlans')}
            </Button>
          </form>
        </Form>
        
        {form.formState.isSubmitted && !form.formState.isSubmitting && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-3">{t('compareCalc.comparisonResults')}</h3>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"></div>
              <div className="bg-primary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-lg text-center">
                <p className="text-sm font-medium text-primary">{t('compareCalc.plan1')}</p>
              </div>
              <div className="bg-secondary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-lg text-center">
                <p className="text-sm font-medium text-secondary">{t('compareCalc.plan2')}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">{t('common.totalInvestment')}</p>
              </div>
              <div className="bg-primary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-lg">
                <p className="text-lg font-semibold text-primary">₹ {new Intl.NumberFormat('en-IN').format(
                  calculatorUtils.calculateBasic(
                    form.getValues().plan1.initialInvestment,
                    form.getValues().plan1.monthlyContribution,
                    form.getValues().plan1.timePeriod,
                    form.getValues().plan1.interestRate,
                    "monthly"
                  ).totalInvestment
                )}</p>
              </div>
              <div className="bg-secondary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-lg">
                <p className="text-lg font-semibold text-secondary">₹ {new Intl.NumberFormat('en-IN').format(
                  calculatorUtils.calculateBasic(
                    form.getValues().plan2.initialInvestment,
                    form.getValues().plan2.monthlyContribution,
                    form.getValues().plan2.timePeriod,
                    form.getValues().plan2.interestRate,
                    "monthly"
                  ).totalInvestment
                )}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">{t('common.totalReturns')}</p>
              </div>
              <div className="bg-primary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-lg">
                <p className="text-lg font-semibold text-primary">₹ {new Intl.NumberFormat('en-IN').format(
                  calculatorUtils.calculateBasic(
                    form.getValues().plan1.initialInvestment,
                    form.getValues().plan1.monthlyContribution,
                    form.getValues().plan1.timePeriod,
                    form.getValues().plan1.interestRate,
                    "monthly"
                  ).totalInterest
                )}</p>
              </div>
              <div className="bg-secondary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-lg">
                <p className="text-lg font-semibold text-secondary">₹ {new Intl.NumberFormat('en-IN').format(
                  calculatorUtils.calculateBasic(
                    form.getValues().plan2.initialInvestment,
                    form.getValues().plan2.monthlyContribution,
                    form.getValues().plan2.timePeriod,
                    form.getValues().plan2.interestRate,
                    "monthly"
                  ).totalInterest
                )}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">{t('common.finalAmount')}</p>
              </div>
              <div className="bg-primary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-lg">
                <p className="text-lg font-semibold text-primary">₹ {new Intl.NumberFormat('en-IN').format(
                  calculatorUtils.calculateBasic(
                    form.getValues().plan1.initialInvestment,
                    form.getValues().plan1.monthlyContribution,
                    form.getValues().plan1.timePeriod,
                    form.getValues().plan1.interestRate,
                    "monthly"
                  ).finalAmount
                )}</p>
              </div>
              <div className="bg-secondary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-lg">
                <p className="text-lg font-semibold text-secondary">₹ {new Intl.NumberFormat('en-IN').format(
                  calculatorUtils.calculateBasic(
                    form.getValues().plan2.initialInvestment,
                    form.getValues().plan2.monthlyContribution,
                    form.getValues().plan2.timePeriod,
                    form.getValues().plan2.interestRate,
                    "monthly"
                  ).finalAmount
                )}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
              <h4 className="font-medium mb-2">{t('compareCalc.differenceAnalysis')}</h4>
              <div className="text-sm">
                {getDifferenceText(
                  calculatorUtils.calculateBasic(
                    form.getValues().plan1.initialInvestment,
                    form.getValues().plan1.monthlyContribution,
                    form.getValues().plan1.timePeriod,
                    form.getValues().plan1.interestRate,
                    "monthly"
                  ),
                  calculatorUtils.calculateBasic(
                    form.getValues().plan2.initialInvestment,
                    form.getValues().plan2.monthlyContribution,
                    form.getValues().plan2.timePeriod,
                    form.getValues().plan2.interestRate,
                    "monthly"
                  ),
                  t
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to generate difference text
function getDifferenceText(plan1Result: any, plan2Result: any, t: Function) {
  const amountDiff = Math.abs(plan1Result.finalAmount - plan2Result.finalAmount);
  const investmentDiff = Math.abs(plan1Result.totalInvestment - plan2Result.totalInvestment);
  
  if (plan1Result.finalAmount > plan2Result.finalAmount) {
    return t('compareCalc.plan1Better', {
      amountDiff: new Intl.NumberFormat('en-IN').format(amountDiff),
      investmentDiff: new Intl.NumberFormat('en-IN').format(investmentDiff)
    });
  } else {
    return t('compareCalc.plan2Better', {
      amountDiff: new Intl.NumberFormat('en-IN').format(amountDiff),
      investmentDiff: new Intl.NumberFormat('en-IN').format(investmentDiff)
    });
  }
}
