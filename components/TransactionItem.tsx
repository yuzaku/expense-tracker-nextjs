'use client';
import React, { useState } from 'react';
import { Transaction } from '@/types/Transaction';
import { addCommas } from '@/lib/utils';
import { toast } from 'react-toastify';
import { Trash2, TrendingUp, TrendingDown, Pencil, X } from 'lucide-react';
import deleteTransaction from '@/app/actions/deleteTransaction';
import updateTransaction from '@/app/actions/updateTransaction';

// Helper function to format date to YYYY-MM-DD for the input
const formatDateForInput = (date: Date): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2); // Months are 0-indexed
  const day = (`0${d.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

// --- Interface untuk Props ---
interface EditModalProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
}

interface DeleteModalProps {
  transactionId: string;
  isOpen: boolean;
  onClose: () => void;
}

// --- Komponen Utama ---
const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const sign = transaction.amount < 0 ? '-' : '+';
  const isExpense = transaction.amount < 0;

  return (
    <>
      <div className="group bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isExpense ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {isExpense ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">{transaction.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(transaction.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`font-semibold text-sm ${isExpense ? 'text-red-600' : 'text-green-600'}`}>
              {sign}Rp{addCommas(Math.abs(transaction.amount))}
            </span>
            <button onClick={() => setIsEditModalOpen(true)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-400 hover:text-blue-500 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100" aria-label="Edit Transaction">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => setIsDeleteModalOpen(true)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100" aria-label="Delete Transaction">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {isEditModalOpen && <EditTransactionModal transaction={transaction} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />}
      {isDeleteModalOpen && <DeleteConfirmationModal transactionId={transaction.id} isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />}
    </>
  );
};

// --- Modal untuk Edit Transaksi ---
const EditTransactionModal = ({ transaction, isOpen, onClose }: EditModalProps) => {
  const [text, setText] = useState(transaction.text);
  const [amount, setAmount] = useState(String(Math.abs(transaction.amount)));
  // ADDED: State for date input
  const [date, setDate] = useState(formatDateForInput(transaction.createdAt));
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const amountValue = parseFloat(amount);
    if (!text || !amount || isNaN(amountValue) || amountValue <= 0 || !date) {
      toast.error('Please fill all fields correctly.');
      setIsLoading(false);
      return;
    }

    // UPDATED: Pass the new date to the server action
    const { message, error } = await updateTransaction(transaction.id, {
      text,
      amount: amountValue,
      createdAt: new Date(date), // Convert string back to Date object
    });

    if (error) {
      toast.error(error);
    } else {
      toast.success(message);
      onClose();
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Edit Transaction</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-600 mb-1">Description</label>
            <input type="text" id="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g., Coffee" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-600 mb-1">Amount (Rp)</label>
              <input type="number" id="amount" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g., 25000" />
            </div>
            {/* ADDED: Date input field */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-600 mb-1">Date</label>
              <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition disabled:bg-blue-300 disabled:cursor-not-allowed">
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Modal untuk Konfirmasi Hapus ---
const DeleteConfirmationModal = ({ transactionId, isOpen, onClose }: DeleteModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    setIsLoading(true);
    const { message, error } = await deleteTransaction(transactionId);
    if (error) {
      toast.error(error);
    } else {
      toast.success(message);
      onClose();
    }
    setIsLoading(false);
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm m-4">
        <h3 className="text-lg font-bold text-gray-800">Confirm Deletion</h3>
        <p className="text-gray-600 my-4">Are you sure you want to delete this transaction? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} disabled={isLoading} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition">Cancel</button>
          <button onClick={handleDelete} disabled={isLoading} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition disabled:bg-red-300 disabled:cursor-not-allowed">
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;