import { currentUser } from '@clerk/nextjs/server';
import Guest from '@/components/Guest';
import Header from '@/components/Header';
import AddTransaction from '@/components/AddTransaction';
import Balance from '@/components/Balance';
import IncomeExpense from '@/components/IncomeExpense';
import TransactionList from '@/components/TransactionList';
import ExpenseChart from '@/components/ExpenseChart';

const HomePage = async () => {
  const user = await currentUser();
  if (!user) {
    return <Guest />;
  }
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Section - Balance & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Balance Card */}
          <div className="lg:col-span-2">
            <Balance />
          </div>
          
          {/* Income/Expense Summary */}
          <div className="lg:col-span-1">
            <IncomeExpense />
          </div>
        </div>

        {/* Middle Section - Add Transaction & Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Add Transaction Form */}
          <div className="order-2 xl:order-1">
            <AddTransaction />
          </div>
          
          {/* Expense Chart */}
          <div className="order-1 xl:order-2">
            <ExpenseChart />
          </div>
        </div>

        {/* Bottom Section - Transaction History */}
        <div className="w-full">
          <TransactionList />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
