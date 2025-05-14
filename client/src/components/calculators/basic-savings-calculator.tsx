import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PiggyBankIcon, HelpCircleIcon, CalculatorIcon } from "lucide-react";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { calculatorUtils } from "@/utils/calculator";
import { useCalculator } from "@/contexts/calculator-context";
import { useEffect } from "react";

const formSchema = z.object({
  initialAmount: z.number().min(0, "Cannot be negative"),
  regularContribution: z.number().min(0, "Cannot be negative"),
  frequency: z.enum(["monthly", "quarterly", "yearly"]),
  interestRate: z.number().min(0, "Cannot be negative").max(30, "Maximum 30%"),
  timePeriod: z.number().min(1, "Minimum 1 year").max(50, "Maximum 50 years"),
});

type FormValues = z.infer<typeof formSchema>;

export function BasicSavingsCalculator() {
  const { t } = useTranslation();
  const { setCalculationResult } = useCalculator();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialAmount: 10000,
      regularContribution: 1000,
      frequency: "monthly",
      interestRate: 8,
      timePeriod: 5
    }
  });

  const onSubmit = (values: FormValues) => {
    const result = calculatorUtils.calculateBasic(
      values.initialAmount,
      values.regularContribution,
      values.timePeriod,
      values.interestRate,
      values.frequency
    );
    
    setCalculationResult({
      type: 'basic',
      ...result,
      initialAmount: values.initialAmount,
      regularContribution: values.regularContribution,
      frequency: values.frequency,
      interestRate: values.interestRate,
      timePeriod: values.timePeriod
    });
  };

  // Reset calculation when component unmounts
  useEffect(() => {
    return () => setCalculationResult(null);
  }, [setCalculationResult]);

  // Calculate percentage of total for principal and interest
  const getPercentages = () => {
    if (!form.formState.isSubmitted) return { principal: 0, interest: 0 };
    
    const values = form.getValues();
    const result = calculatorUtils.calculateBasic(
      values.initialAmount,
      values.regularContribution,
      values.timePeriod,
      values.interestRate,
      values.frequency
    );
    
    const total = result.finalAmount;
    const principalPercentage = Math.round((result.totalInvestment / total) * 100);
    const interestPercentage = 100 - principalPercentage;
    
    return { principal: principalPercentage, interest: interestPercentage };
  };

  return (
    <Card className="border-emerald-200 dark:border-emerald-800 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 border-b border-emerald-100 dark:border-emerald-800">
        <CardTitle className="flex items-center">
          <PiggyBankIcon className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
          <span className="bg-gradient-to-r from-emerald-700 to-green-700 dark:from-emerald-400 dark:to-green-400 text-transparent bg-clip-text font-bold">
            {t('basicCalc.title')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="initialAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    {t('basicCalc.initialAmount')}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircleIcon className="h-4 w-4 ml-1 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('basicCalc.initialAmountHelp')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
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
              name="regularContribution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    {t('basicCalc.regularContribution')}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircleIcon className="h-4 w-4 ml-1 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('basicCalc.regularContributionHelp')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <CurrencyInput
                      {...field}
                      onChange={field.onChange}
                      placeholder="e.g. 1000"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.frequency')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('common.selectFrequency')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">{t('common.monthly')}</SelectItem>
                      <SelectItem value="quarterly">{t('common.quarterly')}</SelectItem>
                      <SelectItem value="yearly">{t('common.yearly')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    {t('common.interestRate')}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircleIcon className="h-4 w-4 ml-1 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('common.interestRateHelp')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
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
              name="timePeriod"
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
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-md"
            >
              <CalculatorIcon className="h-4 w-4 mr-2" />
              {t('common.calculate')}
            </Button>
          </form>
        </Form>
        
        {form.formState.isSubmitted && !form.formState.isSubmitting && (
          <div className="mt-6 pt-4 border-t border-emerald-200 dark:border-emerald-800">
            <h3 className="text-lg font-medium mb-3 gradient-heading gradient-emerald">{t('common.results')}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="result-card card-gradient-emerald border border-emerald-100 dark:border-emerald-800">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('basicCalc.initialInvestment')}</p>
                <div className="flex items-baseline">
                  <p className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">₹ {new Intl.NumberFormat('en-IN').format(form.getValues().initialAmount)}</p>
                </div>
              </div>
              <div className="result-card card-gradient-emerald border border-emerald-100 dark:border-emerald-800">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('basicCalc.totalContributions')}</p>
                <p className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">₹ {new Intl.NumberFormat('en-IN').format(
                  calculatorUtils.calculateBasic(
                    form.getValues().initialAmount,
                    form.getValues().regularContribution,
                    form.getValues().timePeriod,
                    form.getValues().interestRate,
                    form.getValues().frequency
                  ).totalContributions
                )}</p>
              </div>
              <div className="result-card card-gradient-emerald border border-emerald-100 dark:border-emerald-800">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('common.totalInterest')}</p>
                <p className="text-xl font-semibold text-cyan-600 dark:text-cyan-400">₹ {new Intl.NumberFormat('en-IN').format(
                  calculatorUtils.calculateBasic(
                    form.getValues().initialAmount,
                    form.getValues().regularContribution,
                    form.getValues().timePeriod,
                    form.getValues().interestRate,
                    form.getValues().frequency
                  ).totalInterest
                )}</p>
              </div>
              <div className="result-card card-gradient-emerald border border-emerald-100 dark:border-emerald-800 shadow-glow">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('common.finalAmount')}</p>
                <p className="text-xl font-semibold gradient-heading gradient-emerald">₹ {new Intl.NumberFormat('en-IN').format(
                  calculatorUtils.calculateBasic(
                    form.getValues().initialAmount,
                    form.getValues().regularContribution,
                    form.getValues().timePeriod,
                    form.getValues().interestRate,
                    form.getValues().frequency
                  ).finalAmount
                )}</p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-lg border border-emerald-100 dark:border-emerald-800 shadow-md">
              <h4 className="font-medium mb-3 text-emerald-700 dark:text-emerald-400">{t('basicCalc.breakdown')}</h4>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center bg-white/70 dark:bg-gray-800/50 p-2 rounded-md shadow-sm">
                  <div className="w-4 h-4 bg-emerald-600 dark:bg-emerald-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t('common.totalInvestment')}: <span className="font-medium text-emerald-700 dark:text-emerald-400">{getPercentages().principal}%</span></span>
                </div>
                <div className="flex items-center bg-white/70 dark:bg-gray-800/50 p-2 rounded-md shadow-sm">
                  <div className="w-4 h-4 bg-cyan-600 dark:bg-cyan-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t('common.totalInterest')}: <span className="font-medium text-cyan-700 dark:text-cyan-400">{getPercentages().interest}%</span></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
