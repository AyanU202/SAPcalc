import { useState } from "react";
import { Calculator, InfoIcon, SunIcon, MoonIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/language-selector";
import { GoalBasedCalculator } from "@/components/calculators/goal-based-calculator";
import { PlanComparisonCalculator } from "@/components/calculators/plan-comparison-calculator";
import { BasicSavingsCalculator } from "@/components/calculators/basic-savings-calculator";
import { ChartVisualization } from "@/components/chart-visualization";
import { AboutModal } from "@/components/about-modal";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useCalculator } from "@/contexts/calculator-context";

export default function Home() {
  const { t } = useTranslation();
  const [showAboutModal, setShowAboutModal] = useState(false);
  const { theme, setTheme } = useTheme();
  const { activeTab, setActiveTab } = useCalculator();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Calculator className="h-6 w-6 text-yellow-300" />
            <h1 className="text-xl font-bold">WealthVista</h1>
          </div>
          
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Calculator Navigation */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 flex overflow-x-auto md:justify-center gap-2">
          <Button
            variant={activeTab === 'goal' ? 'default' : 'outline'}
            onClick={() => setActiveTab('goal')}
            className="whitespace-nowrap"
          >
            <Calculator className="h-4 w-4 mr-2" />
            {t('nav.goalBased')}
          </Button>
          <Button
            variant={activeTab === 'compare' ? 'default' : 'outline'}
            onClick={() => setActiveTab('compare')}
            className="whitespace-nowrap"
          >
            <Calculator className="h-4 w-4 mr-2" />
            {t('nav.planComparison')}
          </Button>
          <Button
            variant={activeTab === 'basic' ? 'default' : 'outline'}
            onClick={() => setActiveTab('basic')}
            className="whitespace-nowrap"
          >
            <Calculator className="h-4 w-4 mr-2" />
            {t('nav.basicSavings')}
          </Button>
        </div>

        {/* Calculator Cards Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Calculator */}
          {activeTab === 'goal' && <GoalBasedCalculator />}
          {activeTab === 'compare' && <PlanComparisonCalculator />}
          {activeTab === 'basic' && <BasicSavingsCalculator />}
          
          {/* Chart Visualization */}
          <ChartVisualization />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">© 2023 WealthVista - {t('footer.createdBy')} Ayan Roshan Umredkar</p>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white/30 hover:bg-white/10 hover:text-white"
                onClick={() => setShowAboutModal(true)}
              >
                <InfoIcon className="h-4 w-4 mr-1 text-yellow-300" />
                {t('footer.about')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white/30 hover:bg-white/10 hover:text-white"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-4 w-4 mr-1 text-yellow-300" />
                ) : (
                  <MoonIcon className="h-4 w-4 mr-1 text-yellow-300" />
                )}
                {theme === 'dark' ? t('footer.lightMode') : t('footer.darkMode')}
              </Button>
            </div>
          </div>
        </div>
      </footer>
      
      {/* About Modal */}
      <AboutModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} />
    </div>
  );
}
