// Define types for parameters and results
type Frequency = 'monthly' | 'quarterly' | 'yearly';

interface GoalBasedResult {
  monthlyInvestment: number;
  totalInvestment: number;
  totalInterest: number;
  finalAmount: number;
}

interface BasicSavingsResult {
  initialAmount: number;
  totalContributions: number;
  totalInvestment: number;
  totalInterest: number;
  finalAmount: number;
}

// Calculator utility functions
export const calculatorUtils = {
  /**
   * Calculate goal-based savings
   * @param goalAmount The target amount to save
   * @param timePeriod Time period in years
   * @param interestRate Annual interest rate in percentage
   * @param frequency Investment frequency
   * @returns Calculation results
   */
  calculateGoalBased: (
    goalAmount: number,
    timePeriod: number,
    interestRate: number,
    frequency: Frequency
  ): GoalBasedResult => {
    let periodsPerYear: number;
    
    switch (frequency) {
      case 'monthly':
        periodsPerYear = 12;
        break;
      case 'quarterly':
        periodsPerYear = 4;
        break;
      case 'yearly':
        periodsPerYear = 1;
        break;
      default:
        periodsPerYear = 12;
    }
    
    const totalPeriods = timePeriod * periodsPerYear;
    const periodicRate = interestRate / 100 / periodsPerYear;
    
    // PMT formula: PMT = FV * r / ((1 + r)^n - 1)
    const pmt = goalAmount * periodicRate / ((Math.pow(1 + periodicRate, totalPeriods) - 1));
    
    const monthlyInvestment = Math.round(pmt);
    const totalInvestment = Math.round(monthlyInvestment * totalPeriods);
    const totalInterest = Math.round(goalAmount - totalInvestment);
    
    return {
      monthlyInvestment,
      totalInvestment,
      totalInterest,
      finalAmount: goalAmount
    };
  },
  
  /**
   * Calculate basic savings with regular contributions
   * @param initialAmount Initial investment amount
   * @param regularContribution Regular contribution amount
   * @param timePeriod Time period in years
   * @param interestRate Annual interest rate in percentage
   * @param frequency Contribution frequency
   * @returns Calculation results
   */
  calculateBasic: (
    initialAmount: number,
    regularContribution: number,
    timePeriod: number,
    interestRate: number,
    frequency: Frequency
  ): BasicSavingsResult => {
    let periodsPerYear: number;
    
    switch (frequency) {
      case 'monthly':
        periodsPerYear = 12;
        break;
      case 'quarterly':
        periodsPerYear = 4;
        break;
      case 'yearly':
        periodsPerYear = 1;
        break;
      default:
        periodsPerYear = 12;
    }
    
    const totalPeriods = timePeriod * periodsPerYear;
    const periodicRate = interestRate / 100 / periodsPerYear;
    
    // Future value formula with initial amount:
    // FV = P(1+r)^n + PMT * ((1+r)^n - 1) / r
    const futureValueInitial = initialAmount * Math.pow(1 + periodicRate, totalPeriods);
    const futureValueContributions = regularContribution * (Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate;
    
    const finalAmount = Math.round(futureValueInitial + futureValueContributions);
    const totalContributions = regularContribution * totalPeriods;
    const totalInvestment = initialAmount + totalContributions;
    const totalInterest = finalAmount - totalInvestment;
    
    return {
      initialAmount,
      totalContributions,
      totalInvestment,
      totalInterest,
      finalAmount
    };
  }
};
