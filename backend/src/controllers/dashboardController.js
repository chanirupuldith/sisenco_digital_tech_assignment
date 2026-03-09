import db from '../config/db.js';

/**
 * Returns aggregated dashboard data for the authenticated user.
 *
 * Response includes:
 * - Financial summary: total income, total expenses, current balance, and budget usage.
 * - Visual insights: expense breakdown by category, monthly income vs expenses (last 6 months),
 *   and budget vs actual spending for the current month.
 * - Recent transactions: the 5 most recent transactions.
 *
 * @route  GET /api/dashboard
 * @access Private
 */
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [incomeResult] = await db.execute(
      `SELECT COALESCE(SUM(amount), 0) AS totalIncome FROM transactions WHERE user_id = ? AND type = 'income' AND is_deleted = FALSE`,
      [userId]
    );
    const totalIncome = Number(incomeResult[0].totalIncome) || 0;

    const [expenseResult] = await db.execute(
      `SELECT COALESCE(SUM(amount), 0) AS totalExpense FROM transactions WHERE user_id = ? AND type = 'expense' AND is_deleted = FALSE`,
      [userId]
    );
    const totalExpenses = Number(expenseResult[0].totalExpense) || 0;

    const currentBalance = totalIncome - totalExpenses;

    const [budgetAgg] = await db.execute(
      `
      SELECT 
        COALESCE(SUM(b.amount), 0) as totalBudget
      FROM budgets b
      WHERE b.user_id = ? AND b.month = ? AND b.year = ?
      `,
      [userId, currentMonth, currentYear]
    );
    const totalBudget = Number(budgetAgg[0]?.totalBudget || 0);

    const [budgetSpentResult] = await db.execute(
      `
      SELECT COALESCE(SUM(t.amount), 0) as totalSpent
      FROM transactions t
      JOIN budgets b ON t.category_id = b.category_id AND t.user_id = b.user_id
      WHERE t.user_id = ? AND t.type = 'expense' AND t.is_deleted = FALSE
        AND b.month = ? AND b.year = ? AND MONTH(t.date) = ? AND YEAR(t.date) = ?
      `,
      [userId, currentMonth, currentYear, currentMonth, currentYear]
    );
    const budgetSpent = Number(budgetSpentResult[0]?.totalSpent || 0);
    const budgetUsage = totalBudget > 0 ? (budgetSpent / totalBudget) * 100 : 0;

    const [expenseByCategory] = await db.execute(
      `
      SELECT c.name as category_name, SUM(t.amount) as total
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ? AND t.type = 'expense' AND t.is_deleted = FALSE
      GROUP BY c.id
      `,
      [userId]
    );

    const [monthlyData] = await db.execute(
      `
      SELECT 
        DATE_FORMAT(date, '%Y-%m') as monthString,
        type, 
        SUM(amount) as total
      FROM transactions
      WHERE user_id = ? AND is_deleted = FALSE AND date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY monthString, type
      ORDER BY monthString ASC
      `,
      [userId]
    );

    const [budgetVsActual] = await db.execute(
      `
      SELECT 
        c.name as category_name,
        b.amount as totalBudget,
        (SELECT COALESCE(SUM(t.amount), 0) 
         FROM transactions t 
         WHERE t.category_id = b.category_id AND t.user_id = ? 
         AND t.type = 'expense' AND t.is_deleted = FALSE 
         AND MONTH(t.date) = b.month AND YEAR(t.date) = b.year
        ) AS currentSpent
      FROM budgets b
      JOIN categories c ON b.category_id = c.id
      WHERE b.user_id = ? AND b.month = ? AND b.year = ?
      `,
      [userId, userId, currentMonth, currentYear]
    );

    const [recentTransactions] = await db.execute(
      `
      SELECT
        t.id,
        t.title,
        t.amount,
        t.type,
        t.date,
        c.name AS category_name
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ? AND t.is_deleted = FALSE
      ORDER BY t.date DESC
      LIMIT 5
      `,
      [userId]
    );

    res.json({
      financialSummary: {
        totalIncome,
        totalExpenses,
        currentBalance,
        budgetUsage,
        totalBudget,
        budgetSpent,
      },
      visualInsights: {
        expenseByCategory,
        monthlyData,
        budgetVsActual,
      },
      recentTransactions,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};
