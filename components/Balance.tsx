import getUserBalance from '@/app/actions/getUserBalance';
import { addCommas } from '@/lib/utils';


const Balance = async () => {
  const { balance } = await getUserBalance();
  const balanceAmount = Number(balance?.toFixed(2) ?? 0);
  const isPositive = balanceAmount >= 0;
  
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5"></div>
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-xl"></div>
      
      {/* Content */}
      <div className="relative p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Total Balance</h4>
              <p className="text-sm text-gray-500">Current account balance</p>
            </div>
          </div>
          
          {/* Balance indicator */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isPositive 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {isPositive ? '↗ Positive' : '↘ Negative'}
          </div>
        </div>
        
        {/* Balance amount */}
        <div className="mb-4">
          <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${
            isPositive 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent'
          }`}>
            Rp{addCommas(Math.abs(balanceAmount))}
          </h1>
          
          {!isPositive && (
            <p className="text-sm text-red-500 font-medium">
              ⚠️ Your balance is negative
            </p>
          )}
        </div>
        
        {/* Quick stats */}
        <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Last updated: {new Date().toLocaleDateString('id-ID')}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live balance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balance;
