import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FlagIcon, HelpCircleIcon, CalculatorIcon } from "lucide-react";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { calculatorUtils } from "@/utils/calculator";
import { useCalculator } from "@/contexts/calculator-context";
import { useEffect } from "react";

const formSchema = z.object({
  goalAmount: z.number({ required_error: "Required" }).min(1000, "Minimum ₹1,000").max(10000000, "Maximum ₹10,000,000"),
  timePeriod: z.number({ required_error: "Required" }).min(1, "Minimum 1 year").max(50, "Maximum 50 years"),
  interestRate: z.number({ required_error: "Required" }).min(1, "Minimum 1%").max(30, "Maximum 30%"),
  frequency: z.enum(["monthly", "quarterly", "yearly"])
});

type FormValues = z.infer<typeof formSchema>;

export function GoalBasedCalculator() {
  const { t } = useTranslation();
  const { setCalculationResult } = useCalculator();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goalAmount: 1000000,
      timePeriod: 5,
      interestRate: 8,
      frequency: "monthly"
    }
  });

  const onSubmit = (values: FormValues) => {
    const result = calculatorUtils.calculateGoalBased(
      values.goalAmount,
      values.timePeriod,
      values.interestRate,
      values.frequency
    );
    
    setCalculationResult({
      type: 'goal',
      ...result,
      goalAmount: values.goalAmount,
      timePeriod: values.timePeriod,
      interestRate: values.interestRate,
      frequency: values.frequency
    });
  };

  // Reset calculation when component unmounts
  useEffect(() => {
    return () => setCalculationResult(null);
  }, [setCalculationResult]);

  return (
    <Card className="border-indigo-200 dark:border-indigo-800 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-b border-indigo-100 dark:border-indigo-800">
        <CardTitle className="flex items-center">
          <FlagIcon className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          <span className="bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text font-bold">
            {t('goalCalc.title')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="goalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    {t('goalCalc.goalAmount')}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircleIcon className="h-4 w-4 ml-1 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('goalCalc.goalAmountHelp')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <CurrencyInput
                      {...field}
                      onChange={field.onChange}
                      placeholder="e.g. 100000"
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
                  <FormLabel className="flex items-center">
                    {t('common.timePeriod')}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircleIcon className="h-4 w-4 ml-1 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('common.timePeriodHelp')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
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
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md"
            >
              <CalculatorIcon className="h-4 w-4 mr-2" />
              {t('common.calculate')}
            </Button>
          </form>
        </Form>
        
        {form.formState.isSubmitted && !form.formState.isSubmitting && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-3">{t('common.results')}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('goalCalc.requiredMonthlyInvestment')}</p>
                <p className="text-xl font-semibold text-primary">₹ {new Intl.NumberFormat('en-IN').format(form.getValues().goalAmount / (form.getValues().timePeriod * 12))}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('common.totalInvestment')}</p>
                <p className="text-xl font-semibold">₹ {new Intl.NumberFormat('en-IN').format(form.getValues().goalAmount)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('common.totalInterest')}</p>
                <p className="text-xl font-semibold text-secondary">₹ {new Intl.NumberFormat('en-IN').format(
                  calculatorUtils.calculateGoalBased(
                    form.getValues().goalAmount,
                    form.getValues().timePeriod,
                    form.getValues().interestRate,
                    form.getValues().frequency
                  ).totalInterest
                )}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('common.finalAmount')}</p>
                <p className="text-xl font-semibold text-accent">₹ {new Intl.NumberFormat('en-IN').format(
                  calculatorUtils.calculateGoalBased(
                    form.getValues().goalAmount,
                    form.getValues().timePeriod,
                    form.getValues().interestRate,
                    form.getValues().frequency
                  ).finalAmount
                )}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
