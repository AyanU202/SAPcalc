import { createContext, useContext, useState, ReactNode } from 'react';

// Define calculator context types
type CalculatorTab = 'goal' | 'compare' | 'basic';

interface CalculationResult {
  type: CalculatorTab;
  [key: string]: any;
}

interface CalculatorContextType {
  activeTab: CalculatorTab;
  setActiveTab: (tab: CalculatorTab) => void;
  calculationResult: CalculationResult | null;
  setCalculationResult: (result: CalculationResult | null) => void;
}

// Create calculator context
const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

// Calculator provider component
export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('goal');
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  return (
    <CalculatorContext.Provider value={{ 
      activeTab, 
      setActiveTab, 
      calculationResult, 
      setCalculationResult 
    }}>
      {children}
    </CalculatorContext.Provider>
  );
}

// Hook to use calculator context
export function useCalculator() {
  const context = useContext(CalculatorContext);
  
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  
  return context;
}
