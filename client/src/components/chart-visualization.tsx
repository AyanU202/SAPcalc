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
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#4F46E5',
            pointBorderColor: '#fff',
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: t('chart.interest'),
            data: interestData,
            borderColor: '#06B6D4', // Cyan
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#06B6D4',
            pointBorderColor: '#fff',
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: t('chart.total'),
            data: totalData,
            borderColor: '#10B981', // Emerald
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: '#10B981',
            pointBorderColor: '#fff',
            pointRadius: 4,
            pointHoverRadius: 6,
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
              text: t('chart.years')
            },
            grid: {
              color: 'rgba(160, 160, 160, 0.1)'
            }
          },
          y: {
            title: {
              display: true,
              text: t('chart.amount')
            },
            grid: {
              color: 'rgba(160, 160, 160, 0.1)'
            },
            ticks: {
              callback: function(value) {
                return '₹' + new Intl.NumberFormat('en-IN').format(value as number);
              }
            }
          }
        },
        plugins: {
          tooltip: {
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3Icon className="h-5 w-5 mr-2 text-primary" />
            {t('chart.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-80 text-center text-gray-500">
          <BarChart3Icon className="h-16 w-16 mb-4 opacity-20" />
          <p>{t('chart.noData')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3Icon className="h-5 w-5 mr-2 text-primary" />
          {t('chart.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60 md:h-80">
          <canvas ref={chartRef} />
        </div>
        
        <div className="mt-4 flex flex-wrap gap-3 justify-center">
          <div className="flex items-center">
            <span className="w-3 h-3 inline-block rounded-full mr-1" style={{ backgroundColor: '#4F46E5' }}></span>
            <span className="text-sm">{t('chart.principal')}</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 inline-block rounded-full mr-1" style={{ backgroundColor: '#06B6D4' }}></span>
            <span className="text-sm">{t('chart.interest')}</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 inline-block rounded-full mr-1" style={{ backgroundColor: '#10B981' }}></span>
            <span className="text-sm">{t('chart.total')}</span>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-medium mb-2">{t('chart.summary')}</h3>
          <ul className="space-y-2 text-sm">
            {activeTab === 'goal' && (
              <li className="flex justify-between">
                <span>{t('chart.requiredInvestment')}:</span>
                <span>₹ {new Intl.NumberFormat('en-IN').format(calculationResult.monthlyInvestment)} / {t('common.month')}</span>
              </li>
            )}
            {activeTab === 'basic' && (
              <li className="flex justify-between">
                <span>{t('chart.startingInvestment')}:</span>
                <span>₹ {new Intl.NumberFormat('en-IN').format(calculationResult.initialAmount || 0)}</span>
              </li>
            )}
            <li className="flex justify-between">
              <span>{t('chart.growthRate')}:</span>
              <span>{calculationResult.interestRate}% {t('common.perYear')}</span>
            </li>
            <li className="flex justify-between">
              <span>{t('chart.period')}:</span>
              <span>{calculationResult.timePeriod} {t('common.years')}</span>
            </li>
            <li className="flex justify-between font-medium">
              <span>{t('chart.finalAmount')}:</span>
              <span className="text-accent-foreground">₹ {new Intl.NumberFormat('en-IN').format(calculationResult.finalAmount)}</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
