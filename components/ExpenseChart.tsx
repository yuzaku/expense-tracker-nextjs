'use client';
import { useEffect, useState, useCallback } from 'react';
import getTransactions from '@/app/actions/getTransactions';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, RefreshCw, RotateCcw, TrendingDown } from 'lucide-react';

const ExpenseChart = ({ refreshTrigger }: { refreshTrigger?: number }) => {
  const [data, setData] = useState<{ date: string; amount: number }[]>([]);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { transactions, error } = await getTransactions();
      if (error || !transactions) return;

      const expenses = transactions.filter((tx) => tx.amount < 0);
      setAllTransactions(expenses);
      
      const years = new Set<string>();
      const months = new Set<string>();
      
      expenses.forEach((tx) => {
        const date = new Date(tx.createdAt);
        years.add(date.getFullYear().toString());
        months.add((date.getMonth() + 1).toString().padStart(2, '0'));
      });
      
      setAvailableYears(Array.from(years).sort((a, b) => parseInt(b) - parseInt(a)));
      setAvailableMonths(Array.from(months).sort());
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  useEffect(() => {
    if (allTransactions.length === 0) return;

    let filteredTransactions = allTransactions;

    if (selectedYear) {
      filteredTransactions = filteredTransactions.filter((tx) => new Date(tx.createdAt).getFullYear().toString() === selectedYear);
    }
    if (selectedMonth) {
      filteredTransactions = filteredTransactions.filter((tx) => (new Date(tx.createdAt).getMonth() + 1).toString().padStart(2, '0') === selectedMonth);
    }
    
    const grouped: { [date: string]: number } = {};
    for (const tx of filteredTransactions) {
      const date = new Date(tx.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
      if (!grouped[date]) grouped[date] = 0;
      grouped[date] += Math.abs(tx.amount);
    }
    
    const chartData = Object.entries(grouped)
      .map(([date, amount]) => ({ date, amount, sortDate: new Date(date.split('/').reverse().join('-')) }))
      .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime())
      .map(({ date, amount }) => ({ date, amount }));

    setData(chartData);
  }, [allTransactions, selectedMonth, selectedYear]);

  const handleReset = () => {
    setSelectedMonth('');
    setSelectedYear('');
  };

  const handleRefresh = () => fetchData();

  const monthNames = [
    { value: '01', label: 'Januari' }, { value: '02', label: 'Februari' }, { value: '03', label: 'Maret' },
    { value: '04', label: 'April' }, { value: '05', label: 'Mei' }, { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' }, { value: '08', label: 'Agustus' }, { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' }, { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900">{`Tanggal: ${label}`}</p>
          <p className="text-sm text-red-600 font-semibold">{`Pengeluaran: Rp${payload[0].value.toLocaleString('id-ID')}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    // CHANGED: Added flex, flex-col, and h-full to the main container
    <div className="flex flex-col h-full shadow-xl bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-red-50/50 to-pink-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Grafik Pengeluaran Harian</h3>
              <p className="text-sm text-gray-500">Pantau pola pengeluaran Anda</p>
            </div>
          </div>
          <button onClick={handleRefresh} disabled={isLoading} className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Memuat...' : 'Refresh'}</span>
          </button>
        </div>
      </div>
      
      {/* Filter Section */}
      <div className="p-6 border-b border-gray-200/50 bg-gray-50/30">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="year-select" className="text-sm font-medium text-gray-700">Tahun:</label>
            <select id="year-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} disabled={isLoading} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <option value="">Semua Tahun</option>
              {availableYears.map((year) => (<option key={year} value={year}>{year}</option>))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="month-select" className="text-sm font-medium text-gray-700">Bulan:</label>
            <select id="month-select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} disabled={isLoading} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <option value="">Semua Bulan</option>
              {monthNames.filter(month => availableMonths.includes(month.value)).map((month) => (<option key={month.value} value={month.value}>{month.label}</option>))}
            </select>
          </div>
          <button onClick={handleReset} disabled={isLoading} className="inline-flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg font-medium text-sm transition-colors duration-200 disabled:cursor-not-allowed">
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Chart Section */}
      {/* CHANGED: Added flex-1 and flex to make this area grow */}
      <div className="p-6 relative flex-1 flex flex-col">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-b-2xl">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-gray-600 font-medium">Memuat data...</p>
            </div>
          </div>
        )}
        
        {data.length > 0 ? (
          // CHANGED: Removed fixed height to allow ResponsiveContainer to fill its parent
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={{ stroke: '#E5E7EB' }} tickLine={{ stroke: '#E5E7EB' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={{ stroke: '#E5E7EB' }} tickLine={{ stroke: '#E5E7EB' }} tickFormatter={(value) => `${(value / 1000)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="amount" stroke="url(#redGradient)" strokeWidth={3} dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#DC2626' }} />
              <defs>
                <linearGradient id="redGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#F87171" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        ) : !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data pengeluaran</h4>
            <p className="text-gray-500 text-sm">Data pengeluaran akan muncul di sini.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ExpenseChart;