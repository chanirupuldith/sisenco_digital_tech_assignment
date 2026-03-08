import db from '../config/db.js';

export const getUserBudgets = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `
      SELECT 
        b.id,
        b.amount,
        b.month,
        b.year,
        c.id AS category_id,
        c.name AS category_name,
        c.type AS category_type,

        COALESCE(SUM(t.amount), 0) AS current_spent

      FROM budgets b

      JOIN categories c 
        ON b.category_id = c.id

      LEFT JOIN transactions t 
        ON t.category_id = b.category_id
        AND t.user_id = b.user_id
        AND t.type = 'expense'
        AND t.is_deleted = FALSE
        AND MONTH(t.date) = b.month
        AND YEAR(t.date) = b.year

      WHERE b.user_id = ?
      AND c.is_deleted = FALSE

      GROUP BY b.id

      ORDER BY b.year DESC, b.month DESC
      `,
      [req.user.id]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
};

export const addBudget = async (req, res) => {
  const { category_id, amount, month, year } = req.body;

  try {
    const [category] = await db.execute(
      `SELECT id FROM categories 
       WHERE id = ? AND user_id = ? AND is_deleted = FALSE`,
      [category_id, req.user.id]
    );

    if (category.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const [result] = await db.execute(
      `INSERT INTO budgets (user_id, category_id, amount, month, year)
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, category_id, amount, month, year]
    );

    res.status(201).json({
      id: result.insertId,
      category_id,
      amount,
      month,
      year,
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        message: 'Budget already exists for this category and month',
      });
    }

    console.error(error);
    res.status(500).json({ error: 'Failed to create budget' });
  }
};

export const updateBudget = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE budgets
       SET amount = ?
       WHERE id = ? AND user_id = ?`,
      [amount, id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ message: 'Budget updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Budget update failed' });
  }
};
