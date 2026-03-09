import React, { useEffect, useState } from 'react';
import { getStoredUser } from '../services/authService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import type { DashboardData } from '../types/dashboard';
import { dashboardApi } from '../services/dashboardService';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  const auth = getStoredUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardApi.getDashboardData();
        setData(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    if (auth?.token) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [auth]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 font-medium">{error}</div>;
  }

  if (!data) return null;

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
    }).format(Number(amount));
  };

  const expenseCategories = data.visualInsights.expenseByCategory.map(
    (item) => item.category_name
  );
  const expenseValues = data.visualInsights.expenseByCategory.map((item) =>
    Number(item.total)
  );
  const expenseDoughnutData = {
    labels: expenseCategories,
    datasets: [
      {
        data: expenseValues,
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const monthsSet = new Set<string>();
  data.visualInsights.monthlyData.forEach((d) => monthsSet.add(d.monthString));
  const sortedMonths = Array.from(monthsSet).sort();

  const incomeByMonth = sortedMonths.map((month) => {
    const record = data.visualInsights.monthlyData.find(
      (d) => d.monthString === month && d.type === 'income'
    );
    return record ? Number(record.total) : 0;
  });
  const expenseByMonth = sortedMonths.map((month) => {
    const record = data.visualInsights.monthlyData.find(
      (d) => d.monthString === month && d.type === 'expense'
    );
    return record ? Number(record.total) : 0;
  });

  const monthlyBarData = {
    labels: sortedMonths,
    datasets: [
      {
        label: 'Income',
        data: incomeByMonth,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
      {
        label: 'Expenses',
        data: expenseByMonth,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
    ],
  };

  const budgetCategories = data.visualInsights.budgetVsActual.map(
    (b) => b.category_name
  );
  const budgetAmounts = data.visualInsights.budgetVsActual.map((b) =>
    Number(b.totalBudget)
  );
  const budgetSpent = data.visualInsights.budgetVsActual.map((b) =>
    Number(b.currentSpent)
  );

  const budgetBarData = {
    labels: budgetCategories,
    datasets: [
      {
        label: 'Budget',
        data: budgetAmounts,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Actual Spent',
        data: budgetSpent,
        backgroundColor: 'rgba(249, 115, 22, 0.8)',
      },
    ],
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Welcome, {auth?.user.username}!
        </h1>
        <p className="text-slate-500 mt-1 font-medium">
          Here's your financial overview for today.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Total Income
            </p>
            <div className="p-2 bg-green-50 rounded-lg">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {formatCurrency(data.financialSummary.totalIncome)}
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Total Expenses
            </p>
            <div className="p-2 bg-red-50 rounded-lg">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 12H4"
                ></path>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {formatCurrency(data.financialSummary.totalExpenses)}
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Current Balance
            </p>
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                ></path>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {formatCurrency(data.financialSummary.currentBalance)}
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Budget Usage
            </p>
            <div className="p-2 bg-purple-50 rounded-lg">
              <svg
                className="w-5 h-5 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                ></path>
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between items-baseline mb-1">
              <p className="text-3xl font-extrabold text-slate-900">
                {Math.round(data.financialSummary.budgetUsage)}%
              </p>
              <span className="text-sm text-slate-500">
                {formatCurrency(data.financialSummary.budgetSpent)} /{' '}
                {formatCurrency(data.financialSummary.totalBudget)}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${data.financialSummary.budgetUsage > 100 ? 'bg-red-500' : 'bg-purple-500'}`}
                style={{
                  width: `${Math.min(data.financialSummary.budgetUsage, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Expense by Category
          </h3>
          <div className="h-64 flex justify-center">
            {expenseCategories.length > 0 ? (
              <Doughnut
                data={expenseDoughnutData}
                options={{ maintainAspectRatio: false }}
              />
            ) : (
              <p className="text-slate-400 self-center">
                No expense data available
              </p>
            )}
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Monthly Income vs Expenses
          </h3>
          <div className="h-64">
            {sortedMonths.length > 0 ? (
              <Bar
                data={monthlyBarData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: { beginAtZero: true },
                  },
                }}
              />
            ) : (
              <p className="text-slate-400 flex h-full justify-center items-center">
                No monthly data available
              </p>
            )}
          </div>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Budget vs Actual Spending
          </h3>
          <div className="h-64">
            {budgetCategories.length > 0 ? (
              <Bar
                data={budgetBarData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: { beginAtZero: true },
                  },
                }}
              />
            ) : (
              <p className="text-slate-400 flex h-full justify-center items-center">
                No active budgets this month
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          Recent Transactions
        </h3>
        {data.recentTransactions.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {data.recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="py-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors -mx-6 px-6"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-xl ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}
                  >
                    {tx.type === 'income' ? (
                      <ArrowDownLeft size={18} />
                    ) : (
                      <ArrowUpRight size={18} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{tx.title}</p>
                    <p className="text-sm text-slate-500">
                      {tx.category_name} &bull;{' '}
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div
                  className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-slate-900'}`}
                >
                  {tx.type === 'income' ? '+' : '-'}
                  {formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 py-4 text-center">
            No recent transactions found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
