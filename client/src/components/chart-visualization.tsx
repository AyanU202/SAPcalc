import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { BarChart3Icon } from "lucide-react";
import { useCalculator } from "@/contexts/calculator-context";
import Chart from "chart.js/auto";

export function ChartVisualization() {
  const { t } = useTranslation();
  const { activeTab, calculationResult } = useCalculator();
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Create or update chart when calculation results change
  useEffect(() => {
    if (!chartRef.current || !calculationResult) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Get the canvas context
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const { labels, principalData, interestData, totalData } = generateChartData(calculationResult);

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: t('chart.principal'),
            data: principalData,
            borderColor: '#4F46E5', // Indigo
            backgroundColor: 'rgba(79, 70, 229, 0.15)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#4F46E5',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointHoverBackgroundColor: '#4F46E5',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 3,
          },
          {
            label: t('chart.interest'),
            data: interestData,
            borderColor: '#06B6D4', // Cyan
            backgroundColor: 'rgba(6, 182, 212, 0.15)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#06B6D4',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointHoverBackgroundColor: '#06B6D4',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 3,
          },
          {
            label: t('chart.total'),
            data: totalData,
            borderColor: '#10B981', // Emerald
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 4,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: '#10B981',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#10B981',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 3,
            borderDash: [],
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: t('chart.years'),
              color: '#6B7280',
              font: {
                size: 12,
                weight: 'bold'
              },
              padding: 10
            },
            grid: {
              color: 'rgba(160, 160, 160, 0.1)',
              tickLength: 8,
              tickWidth: 1
            },
            ticks: {
              color: '#6B7280',
              font: {
                size: 11
              },
              padding: 8
            },
            border: {
              color: 'rgba(160, 160, 160, 0.2)'
            }
          },
          y: {
            title: {
              display: true,
              text: t('chart.amount'),
              color: '#6B7280',
              font: {
                size: 12,
                weight: 'bold'
              },
              padding: 10
            },
            grid: {
              color: 'rgba(160, 160, 160, 0.1)',
              tickLength: 8,
              tickWidth: 1
            },
            ticks: {
              color: '#6B7280',
              font: {
                size: 11
              },
              padding: 8,
              callback: function(value) {
                return '₹' + new Intl.NumberFormat('en-IN').format(value as number);
              }
            },
            border: {
              color: 'rgba(160, 160, 160, 0.2)'
            }
          }
        },
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1F2937',
            bodyColor: '#4B5563',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            bodyFont: {
              size: 12
            },
            titleFont: {
              size: 13,
              weight: 'bold'
            },
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += '₹' + new Intl.NumberFormat('en-IN').format(context.parsed.y);
                }
                return label;
              }
            }
          },
          legend: {
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 15,
              color: '#6B7280',
              font: {
                size: 12
              }
            }
          }
        }
      }
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [calculationResult, t]);

  // Generate chart data based on calculation results
  const generateChartData = (result: any) => {
    const years = result.timePeriod || 5;
    const labels = Array.from({ length: years + 1 }, (_, i) => i);
    
    // Generate principal data
    const principalData = Array.from({ length: years + 1 }, (_, i) => {
      if (i === 0) return 0;
      return Math.round(result.totalInvestment * i / years);
    });
    
    // Generate interest data
    const interestData = Array.from({ length: years + 1 }, (_, i) => {
      if (i === 0) return 0;
      // For simplicity, we'll use a factor to simulate compound growth
      const factor = (Math.pow(1 + result.interestRate / 100, i) - 1);
      return Math.round(result.totalInvestment * factor);
    });
    
    // Calculate total data
    const totalData = principalData.map((principal, i) => principal + interestData[i]);
    
    return { labels, principalData, interestData, totalData };
  };

  // If there's no calculation result, display a placeholder
  if (!calculationResult) {
    return (
      <Card className="border-blue-200 dark:border-blue-800 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-b border-blue-100 dark:border-blue-800">
          <CardTitle className="flex items-center">
            <BarChart3Icon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            <span className="bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text font-bold">
              {t('chart.title')}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 flex flex-col items-center justify-center h-80 text-center">
          <div className="bg-white/60 dark:bg-gray-800/60 p-8 rounded-lg shadow-md border border-blue-100 dark:border-blue-800 mb-4 w-full max-w-md">
            <div className="animated-gradient-bg w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center">
              <BarChart3Icon className="h-8 w-8 text-white" />
            </div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">{t('chart.noData')}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('chart.noDataDescription')}</p>
            <div className="flex gap-3 justify-center">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 dark:border-blue-800 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-b border-blue-100 dark:border-blue-800">
        <CardTitle className="flex items-center">
          <BarChart3Icon className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          <span className="bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text font-bold">
            {t('chart.title')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60 md:h-80">
          <canvas ref={chartRef} />
        </div>
        
        <div className="mt-4 flex flex-wrap gap-4 justify-center bg-white/80 dark:bg-gray-800/50 p-3 rounded-lg shadow-sm">
          <div className="flex items-center px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-700">
            <span className="w-4 h-4 inline-block rounded-full mr-2 shadow-sm" style={{ backgroundColor: '#4F46E5' }}></span>
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-400">{t('chart.principal')}</span>
          </div>
          <div className="flex items-center px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-100 dark:border-cyan-700">
            <span className="w-4 h-4 inline-block rounded-full mr-2 shadow-sm" style={{ backgroundColor: '#06B6D4' }}></span>
            <span className="text-sm font-medium text-cyan-700 dark:text-cyan-400">{t('chart.interest')}</span>
          </div>
          <div className="flex items-center px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-700">
            <span className="w-4 h-4 inline-block rounded-full mr-2 shadow-sm" style={{ backgroundColor: '#10B981' }}></span>
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">{t('chart.total')}</span>
          </div>
        </div>
        
        <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg shadow-md border border-blue-100 dark:border-blue-800">
          <h3 className="font-medium mb-3 text-blue-700 dark:text-blue-400 flex items-center">
            <span className="inline-block w-2 h-6 bg-blue-600 dark:bg-blue-500 rounded-full mr-2"></span>
            {t('chart.summary')}
          </h3>
          <ul className="space-y-3 text-sm">
            {activeTab === 'goal' && (
              <li className="flex justify-between p-2 bg-white/70 dark:bg-gray-800/50 rounded-md shadow-sm">
                <span className="text-gray-700 dark:text-gray-300">{t('chart.requiredInvestment')}:</span>
                <span className="font-medium text-indigo-700 dark:text-indigo-400">₹ {new Intl.NumberFormat('en-IN').format(calculationResult.monthlyInvestment)} / {t('common.month')}</span>
              </li>
            )}
            {activeTab === 'basic' && (
              <li className="flex justify-between p-2 bg-white/70 dark:bg-gray-800/50 rounded-md shadow-sm">
                <span className="text-gray-700 dark:text-gray-300">{t('chart.startingInvestment')}:</span>
                <span className="font-medium text-emerald-700 dark:text-emerald-400">₹ {new Intl.NumberFormat('en-IN').format(calculationResult.initialAmount || 0)}</span>
              </li>
            )}
            <li className="flex justify-between p-2 bg-white/70 dark:bg-gray-800/50 rounded-md shadow-sm">
              <span className="text-gray-700 dark:text-gray-300">{t('chart.growthRate')}:</span>
              <span className="font-medium text-cyan-700 dark:text-cyan-400">{calculationResult.interestRate}% {t('common.perYear')}</span>
            </li>
            <li className="flex justify-between p-2 bg-white/70 dark:bg-gray-800/50 rounded-md shadow-sm">
              <span className="text-gray-700 dark:text-gray-300">{t('chart.period')}:</span>
              <span className="font-medium text-blue-700 dark:text-blue-400">{calculationResult.timePeriod} {t('common.years')}</span>
            </li>
            <li className="flex justify-between p-3 bg-gradient-to-r from-blue-100/70 to-indigo-100/70 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-md shadow-sm mt-3 border border-blue-200 dark:border-blue-700">
              <span className="text-gray-800 dark:text-gray-200 font-medium">{t('chart.finalAmount')}:</span>
              <span className="font-bold gradient-heading gradient-cyan">₹ {new Intl.NumberFormat('en-IN').format(calculationResult.finalAmount)}</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
