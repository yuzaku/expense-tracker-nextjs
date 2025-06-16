'use client';

import getTransactions from '@/app/actions/getTransactions';
import TransactionItem from './TransactionItem';
import { Transaction } from '@/types/Transaction';
import React, { useState, useEffect } from 'react';
import { History, AlertCircle, Calendar, Loader2 } from 'lucide-react';

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // UPDATED: Default state for filters to show "Semua" initially can be set here.
  const [selectedMonth, setSelectedMonth] = useState(0); // 0 for "Semua Bulan"
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      // Pass the selected values directly. The server action will handle the logic.
      const { transactions: fetchedTransactions, error: fetchError } = await getTransactions({
        month: selectedMonth,
        year: selectedYear,
      });
      if (fetchError) {
        setError(fetchError);
        setTransactions(null);
      } else {
        setTransactions(fetchedTransactions || []);
        setError(null);
      }
      setIsLoading(false);
    };
    fetchTransactions();
  }, [selectedMonth, selectedYear]);

  const months = [
    { value: 0, name: 'Semua Bulan' }, // ADDED
    { value: 1, name: 'Januari' }, { value: 2, name: 'Februari' }, { value: 3, name: 'Maret' },
    { value: 4, name: 'April' }, { value: 5, name: 'Mei' }, { value: 6, name: 'Juni' },
    { value: 7, name: 'Juli' }, { value: 8, name: 'Agustus' }, { value: 9, name: 'September' },
    { value: 10, name: 'Oktober' }, { value: 11, name: 'November' }, { value: 12, name: 'Desember' }
  ];
  const currentYear = new Date().getFullYear();
  const years = [0, ...Array.from({ length: 5 }, (_, i) => currentYear - i)]; // ADDED 0

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mb-3" />
          <p>Memuat transaksi...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center space-x-2 text-red-500 bg-red-50 p-6 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">{error}</p>
        </div>
      );
    }
    if (transactions && transactions.length > 0) {
      return <div className="space-y-3">{transactions.map((transaction) => <TransactionItem key={transaction.id} transaction={transaction} />)}</div>;
    }
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">Tidak Ada Transaksi</h4>
        <p className="text-gray-500 text-sm">Tidak ada transaksi yang tercatat pada periode ini.</p>
      </div>
    );
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden">
      <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-gray-100/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Riwayat Transaksi</h3>
              <p className="text-sm text-gray-500">{!isLoading && `${transactions?.length || 0} transaksi tercatat`}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              {/* UPDATED: To handle the display of "Semua Tahun" */}
              {years.map(y => <option key={y} value={y}>{y === 0 ? 'Semua Tahun' : y}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="p-6">{renderContent()}</div>
    </div>
  );
};

export default TransactionList;
