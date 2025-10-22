// ...existing code...
import { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Download, BarChart3, LineChart, PieChart as PieChartIcon } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import ThemeToggle from '../components/ThemeToggle';

type ChartType = 'bar' | 'line' | 'pie';

interface ForecastData {
  product: string;
  company: string;
  predicted: number;
  actual: number;
  trend: 'up' | 'down';
  alert?: string;
}

/**
 * Small left-side search component for the dashboard.
 * - toggle between Company / Product
 * - client-side filtering
 * - calls onSelect when an item is chosen
 */
function SalesSearchSidebar({
  companies = [],
  products = [],
  onSelect,
}: {
  companies?: string[];
  products?: string[];
  onSelect?: (type: 'company' | 'product', value: string) => void;
}) {
  const [mode, setMode] = useState<'company' | 'product'>('company');
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const list = mode === 'company' ? companies : products;
  const filtered = query.trim()
    ? list.filter((it) => it.toLowerCase().includes(query.trim().toLowerCase()))
    : list;

  function handleKeyDown(e: any) {
    if (e.key === 'ArrowDown') {
      setSelectedIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      onSelect?.(mode, filtered[selectedIndex]);
    }
  }

  return (
    <aside className="w-full md:w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm">Search</h4>
        <div className="flex gap-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-md p-1">
          <button
            onClick={() => { setMode('company'); setQuery(''); }}
            className={`px-2 py-1 rounded ${mode === 'company' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-200'}`}
            aria-pressed={mode === 'company'}
          >
            Company
          </button>
          <button
            onClick={() => { setMode('product'); setQuery(''); }}
            className={`px-2 py-1 rounded ${mode === 'product' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-200'}`}
            aria-pressed={mode === 'product'}
          >
            Product
          </button>
        </div>
      </div>

      <div className="mb-3">
        <input
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelectedIndex(-1); }}
          onKeyDown={handleKeyDown}
          placeholder={`Search ${mode}s...`}
          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
          aria-label={`Search ${mode}`}
        />
      </div>

      <div className="max-h-48 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-xs text-gray-500">No {mode === 'company' ? 'companies' : 'products'} found.</div>
        ) : (
          <ul className="space-y-1">
            {filtered.map((item, idx) => (
              <li key={item}>
                <button
                  onClick={() => onSelect?.(mode, item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                    idx === selectedIndex
                      ? 'bg-blue-600 text-white'
                      : 'bg-transparent text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

export function DashboardPage() {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [dateRange, setDateRange] = useState('30');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');

  const chartsAnimation = useScrollAnimation();
  const alertsAnimation = useScrollAnimation();
  const recommendationsAnimation = useScrollAnimation();

  const forecastData: ForecastData[] = [
    { product: 'Product A', company: 'Acme Corp', predicted: 850, actual: 820, trend: 'up' },
    { product: 'Product B', company: 'Globex', predicted: 620, actual: 640, trend: 'up' },
    { product: 'Product C', company: 'Innotech', predicted: 450, actual: 380, trend: 'down', alert: 'Low stock warning' },
    { product: 'Product D', company: 'Umbrella Inc', predicted: 920, actual: 950, trend: 'up' },
    { product: 'Product E', company: 'Nova Systems', predicted: 340, actual: 290, trend: 'down', alert: 'Performance alert' },
  ];

  // build lists for sidebar
  const companies = Array.from(new Set(forecastData.map(d => d.company)));
  const products = forecastData.map(d => d.product);

  const recommendations = [
    {
      title: 'Increase Stock for Product D',
      description: 'AI predicts 35% increase in demand over next 2 weeks based on seasonal patterns and market trends.',
      priority: 'high'
    },
    {
      title: 'Optimize Pricing for Product C',
      description: 'Current price point is affecting sales velocity. Recommended 8% price reduction to match competitor levels.',
      priority: 'medium'
    },
    {
      title: 'Marketing Push for Product E',
      description: 'Low engagement detected. Increase marketing spend by 20% to boost visibility and conversion rates.',
      priority: 'medium'
    },
  ];

  const handleDownload = (format: 'pdf' | 'csv') => {
    alert(`Downloading report as ${format.toUpperCase()}...`);
  };

  const maxValue = Math.max(...forecastData.map(d => Math.max(d.predicted, d.actual)));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12 px-4 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Sales Forecast Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">AI-powered analytics and predictions</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Total Revenue</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">$125,450</p>
            <p className="text-sm text-green-500 mt-1">+12.5% from last month</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Prediction Accuracy</span>
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">98.7%</p>
            <p className="text-sm text-blue-500 mt-1">Above target 95%</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Active Alerts</span>
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
            <p className="text-sm text-orange-500 mt-1">Requires attention</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Products Tracked</span>
              <PieChartIcon className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">248</p>
            <p className="text-sm text-purple-500 mt-1">Across 5 categories</p>
          </div>
        </div>

        <div
          ref={chartsAnimation.ref}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 transition-all duration-700 ${
            chartsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Layout: left sidebar search + main forecast content */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-72">
              <SalesSearchSidebar
                companies={companies}
                products={products}
                onSelect={(type, value) => {
                  if (type === 'company') {
                    setSelectedCompany(value);
                    setSelectedProduct('all');
                  } else {
                    setSelectedProduct(value);
                    setSelectedCompany('all');
                  }
                }}
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Forecast</h2>

                <div className="flex flex-wrap gap-3">
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Products</option>
                    {products.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>

                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                  </select>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setChartType('bar')}
                      className={`p-2 rounded-lg transition-colors ${
                        chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                      aria-label="Bar chart"
                    >
                      <BarChart3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setChartType('line')}
                      className={`p-2 rounded-lg transition-colors ${
                        chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                      aria-label="Line chart"
                    >
                      <LineChart className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setChartType('pie')}
                      className={`p-2 rounded-lg transition-colors ${
                        chartType === 'pie' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                      aria-label="Pie chart"
                    >
                      <PieChartIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload('pdf')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                    <button
                      onClick={() => handleDownload('csv')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      CSV
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {forecastData
                  .filter(d =>
                    (selectedProduct === 'all' || d.product === selectedProduct) &&
                    (selectedCompany === 'all' || d.company === selectedCompany)
                  )
                  .map(data => (
                    <div key={data.product} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-gray-900 dark:text-white">{data.product}</span>
                          <span className="text-xs text-gray-500 ml-2">({data.company})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {data.trend === 'up' ? (
                            <TrendingUp className="w-5 h-5 text-green-500" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-500" />
                          )}
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Predicted: {data.predicted} | Actual: {data.actual}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all duration-1000"
                            style={{ width: `${(data.predicted / maxValue) * 100}%` }}
                          />
                        </div>
                        <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                          <div
                            className={`h-full transition-all duration-1000 ${
                              data.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(data.actual / maxValue) * 100}%` }}
                          />
                        </div>
                      </div>
                      {data.alert && (
                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{data.alert}</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div
          ref={alertsAnimation.ref}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 transition-all duration-700 ${
            alertsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Active Alerts</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Low Stock - Product C</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current stock: 45 units. Reorder recommended.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded">
              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Performance Drop - Product E</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">15% below forecast. Review pricing strategy.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded">
              <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">High Demand - Product D</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Exceeding forecast by 20%. Consider increasing inventory.</p>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={recommendationsAnimation.ref}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-700 ${
            recommendationsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI Recommendations</h2>
          <div className="space-y-4">
            {recommendations.map((rec, idx) => (
              <details key={idx} className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      rec.priority === 'high'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {rec.priority.toUpperCase()}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">{rec.title}</span>
                  </div>
                  <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 bg-white dark:bg-gray-800 border-l-4 border-blue-500 ml-4 mt-2 rounded">
                  <p className="text-gray-700 dark:text-gray-300">{rec.description}</p>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">AI Analysis:</p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                      <li>Historical data from last 6 months analyzed</li>
                      <li>Market trends and competitor analysis included</li>
                      <li>Confidence level: 94%</li>
                    </ul>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
// ...existing code...