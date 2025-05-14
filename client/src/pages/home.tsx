import { useState } from "react";
import { Calculator, InfoIcon, SunIcon, MoonIcon, FlagIcon, Diff, PiggyBankIcon } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-indigo-50/20 to-gray-50 dark:from-gray-900 dark:via-indigo-950/10 dark:to-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-lg relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLS4zNEE1Ljk5IDUuOTkgMCAwIDEgMzUgMzZoNWMwLTMuMzEtMi42OS02LTYtNm05IDhjMS42NiAwIDMtMS4zNCAzLTNzLTEuMzQtMy0zLTMtMyAxLjM0LTMgMyAxLjM0IDMgMyAzbTAtMTBWOWgtM1YxaC0ydjhoLTNWMWgtMnYxNGg4djE0SDI4Vjk5aDJ2LTJoMXYyaDJ2LTJoMXYyaDJ2LTJoMXYyaDJ2LTI0aC0yem0wIDRoLTF2MmgxdjJoLTF2MmgxdjJoLTF2MmgxdjRoLTlWMjZoOXYyem0tMTAgNFYxMUgxOVY3aC0ydjRoLTV2NmgydjQkaC0ydjRoLTJ2LTRoLTJ2NFYLOSL2LTRoLTJWN2gtMnY0aC01djE0aDlWMTF6bTAgMTBIMjJWMDFoMXYtMmgxdjJoMXYtMmgxdjJoMXYtMmgxdjJ6TTE1IDI5di0yaDN2LTJoLTN2LTJoMnYtMmgtMnYtMmgzVjE3aC0zdjtLTJILTN2MyIgLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Calculator className="h-6 w-6 text-yellow-300" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-400">Savings Calculator</h1>
          </div>
          
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Calculator Navigation */}
        <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg shadow-md p-3 flex overflow-x-auto md:justify-center gap-3">
          <Button
            variant={activeTab === 'goal' ? 'default' : 'outline'}
            onClick={() => setActiveTab('goal')}
            className={`whitespace-nowrap ${activeTab === 'goal' ? 
              'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' : 
              'hover:border-indigo-300 dark:hover:border-indigo-700'}`}
          >
            <FlagIcon className="h-4 w-4 mr-2" />
            {t('nav.goalBased')}
          </Button>
          <Button
            variant={activeTab === 'compare' ? 'default' : 'outline'}
            onClick={() => setActiveTab('compare')}
            className={`whitespace-nowrap ${activeTab === 'compare' ? 
              'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700' : 
              'hover:border-cyan-300 dark:hover:border-cyan-700'}`}
          >
            <Diff className="h-4 w-4 mr-2" />
            {t('nav.planComparison')}
          </Button>
          <Button
            variant={activeTab === 'basic' ? 'default' : 'outline'}
            onClick={() => setActiveTab('basic')}
            className={`whitespace-nowrap ${activeTab === 'basic' ? 
              'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700' : 
              'hover:border-emerald-300 dark:hover:border-emerald-700'}`}
          >
            <PiggyBankIcon className="h-4 w-4 mr-2" />
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
      <footer className="animated-gradient-bg text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">© 2025 Savings Calculator - {t('footer.createdBy')} Ayan Roshan Umredkar</p>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white/50 bg-black/30 hover:bg-black/50 hover:text-white font-medium shadow-lg"
                onClick={() => setShowAboutModal(true)}
              >
                <InfoIcon className="h-4 w-4 mr-1 text-yellow-300" />
                {t('footer.about')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white/50 bg-black/30 hover:bg-black/50 hover:text-white font-medium shadow-lg"
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
