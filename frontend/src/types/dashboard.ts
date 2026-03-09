export interface DashboardData {
  financialSummary: {
    totalIncome: number;
    totalExpenses: number;
    currentBalance: number;
    budgetUsage: number;
    totalBudget: number;
    budgetSpent: number;
  };
  visualInsights: {
    expenseByCategory: { category_name: string; total: string | number }[];
    monthlyData: {
      monthString: string;
      type: string;
      total: string | number;
    }[];
    budgetVsActual: {
      category_name: string;
      totalBudget: number;
      currentSpent: number;
    }[];
  };
  recentTransactions: {
    id: number;
    title: string;
    amount: string | number;
    type: string;
    date: string;
    category_name: string;
  }[];
}
