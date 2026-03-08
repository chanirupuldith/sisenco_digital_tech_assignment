import db from '../config/db.js';

export const getUserTransactions = async (req, res) => {
  try {
    const { startDate, endDate, type, category } = req.query;

    let query = `
      SELECT
        t.id,
        t.title,
        t.amount,
        t.type,
        t.date,
        t.note,
        c.id AS category_id,
        c.name AS category_name
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
      AND t.is_deleted = FALSE
    `;

    const params = [req.user.id];

    if (type) {
      query += ' AND t.type = ?';
      params.push(type);
    }

    if (category) {
      query += ' AND t.category_id = ?';
      params.push(category);
    }

    if (startDate) {
      query += ' AND t.date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND t.date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY t.date DESC';

    const [rows] = await db.execute(query, params);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const addTransaction = async (req, res) => {
  const { title, amount, category_id, type, date, note } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO transactions 
      (user_id, category_id, title, amount, type, date, note)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, category_id, title, amount, type, date, note || null]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      amount,
      category_id,
      type,
      date,
      note,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { title, amount, category_id, type, date, note } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE transactions
       SET title = ?, amount = ?, category_id = ?, type = ?, date = ?, note = ?
       WHERE id = ? AND user_id = ? AND is_deleted = FALSE`,
      [title, amount, category_id, type, date, note, id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Transaction update failed' });
  }
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute(
      `UPDATE transactions
       SET is_deleted = TRUE
       WHERE id = ? AND user_id = ?`,
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Soft delete failed' });
  }
};
