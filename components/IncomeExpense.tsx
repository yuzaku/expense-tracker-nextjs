import getIncomeExpense from '@/app/actions/getIncomeExpense';
import { addCommas } from '@/lib/utils';

const IncomeExpense = async () => {
  const { income, expense } = await getIncomeExpense();

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Income Card */}
      <div className="relative flex flex-col flex-1 overflow-hidden bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-400/10 to-emerald-400/10 rounded-full -translate-y-6 translate-x-6"></div>
        <div className="relative p-6 h-full flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
              </div>
              <div>
                <p className="text-md font-medium text-gray-600">Total Income</p>
              </div>
            </div>
            <div className="text-right"><p className="text-2xl font-bold text-green-600">+Rp{addCommas(Number(income?.toFixed(2) ?? 0))}</p></div>
          </div>
        </div>
      </div>

      {/* Expense Card */}
      <div className="relative flex flex-col flex-1 overflow-hidden bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-red-400/10 to-rose-400/10 rounded-full -translate-y-6 translate-x-6"></div>
        <div className="relative p-6 h-full flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
              </div>
              <div>
                <p className="text-md font-medium text-gray-600">Total Expense</p>
              </div>
            </div>
            <div className="text-right"><p className="text-2xl font-bold text-red-600">-Rp{addCommas(Number(Math.abs(expense ?? 0).toFixed(2)))}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeExpense;
