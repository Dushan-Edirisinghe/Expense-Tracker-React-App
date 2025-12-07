import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet, DollarSign, X } from 'lucide-react';

const App = () => {
  // Initial State from LocalStorage or empty
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('expense-tracker-transactions');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: 1, text: 'Freelance Payment', amount: 1200, type: 'income', date: '2023-10-24' },
      { id: 2, text: 'Grocery Shopping', amount: 85, type: 'expense', date: '2023-10-25' },
      { id: 3, text: 'Netflix Subscription', amount: 15, type: 'expense', date: '2023-10-26' },
    ];
  });

  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); // 'income' or 'expense'
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Save to LocalStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('expense-tracker-transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Calculations
  const amounts = transactions.map(transaction => transaction.type === 'income' ? transaction.amount : -transaction.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  
  const income = transactions
    .filter(item => item.type === 'income')
    .reduce((acc, item) => acc + item.amount, 0)
    .toFixed(2);

  const expense = transactions
    .filter(item => item.type === 'expense')
    .reduce((acc, item) => acc + item.amount, 0)
    .toFixed(2);

  // Actions
  const addTransaction = (e) => {
    e.preventDefault();
    if (!text || !amount) return;

    const newTransaction = {
      id: Math.floor(Math.random() * 100000000),
      text,
      amount: +amount,
      type,
      date: new Date().toISOString().split('T')[0]
    };

    setTransactions([newTransaction, ...transactions]);
    setText('');
    setAmount('');
    setIsFormOpen(false);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex justify-center items-start sm:items-center p-4 selection:bg-indigo-100">
      
      {/* Custom Keyframe Animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-delayed {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite 2s; }
        .animate-fade-in { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .delay-100 { animation-delay: 0.1s; opacity: 0; } /* Delay for pills */
        .delay-200 { animation-delay: 0.2s; opacity: 0; } /* Delay for list */
      `}</style>

      {/* Main Container */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-slate-100 animate-fade-in">
        
        {/* Header / Balance Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl animate-float"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-purple-400 opacity-20 blur-2xl animate-float-delayed"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-medium tracking-wider opacity-80 uppercase">Total Balance</h2>
              <Wallet className="w-5 h-5 opacity-80" />
            </div>
            <h1 className="text-4xl font-bold mb-2 tracking-tight">{formatCurrency(total)}</h1>
            <p className="text-indigo-100 text-sm opacity-80">
              {transactions.length > 0 
                ? `Last updated ${transactions[0].date}` 
                : 'No transactions yet'}
            </p>
          </div>
        </div>

        {/* Income / Expense Summary Pills */}
        <div className="flex justify-center -mt-8 relative z-20 px-6 gap-4 animate-fade-in delay-100">
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between border border-slate-50 transition-transform hover:-translate-y-1 duration-300">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Income</p>
              <p className="text-emerald-500 font-bold text-lg">{formatCurrency(income)}</p>
            </div>
            <div className="bg-emerald-50 p-2 rounded-full">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between border border-slate-50 transition-transform hover:-translate-y-1 duration-300">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Expense</p>
              <p className="text-rose-500 font-bold text-lg">{formatCurrency(expense)}</p>
            </div>
            <div className="bg-rose-50 p-2 rounded-full">
              <TrendingDown className="w-5 h-5 text-rose-500" />
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="px-6 pt-8 pb-24 animate-fade-in delay-200">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-bold text-lg text-slate-700">Transactions</h3>
            <span className="text-xs text-slate-400 font-medium">Recent Activity</span>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {transactions.length === 0 && (
              <div className="text-center py-10 opacity-40">
                <p>No transactions yet.</p>
                <p className="text-sm">Tap + to add one.</p>
              </div>
            )}
            {transactions.map(t => (
              <div key={t.id} className="group flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all duration-200 hover:shadow-sm hover:bg-white hover:translate-x-1">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {t.type === 'income' ? <DollarSign size={18} /> : <TrendingDown size={18} />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 text-sm">{t.text}</p>
                    <p className="text-xs text-slate-400">{t.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                  <button 
                    onClick={() => deleteTransaction(t.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Add Button */}
        <button 
          onClick={() => setIsFormOpen(true)}
          className="absolute bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-300 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-30 animate-fade-in delay-200"
        >
          <Plus size={28} />
        </button>

        {/* Modal / Slide-up Form */}
        <div className={`absolute inset-0 z-40 bg-white/80 backdrop-blur-sm transition-opacity duration-300 flex items-end sm:items-center justify-center ${isFormOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className={`w-full max-w-md bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl p-6 transition-transform duration-300 transform ${isFormOpen ? 'translate-y-0' : 'translate-y-full sm:translate-y-10'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Add Transaction</h3>
              <button onClick={() => setIsFormOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={addTransaction} className="space-y-4">
              {/* Type Switcher */}
              <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${type === 'expense' ? 'bg-white shadow-sm text-rose-500' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${type === 'income' ? 'bg-white shadow-sm text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <input 
                  type="text" 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  placeholder="e.g. Coffee, Salary..." 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent block p-4 outline-none transition-shadow"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    placeholder="0.00" 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-lg font-bold rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent block p-4 pl-8 outline-none transition-shadow"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className={`w-full py-4 rounded-xl text-white font-bold shadow-lg transition-transform active:scale-95 mt-4 ${type === 'income' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'}`}
              >
                Add Transaction
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;