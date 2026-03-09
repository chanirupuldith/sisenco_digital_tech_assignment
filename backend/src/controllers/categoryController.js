import db from '../config/db.js';

/**
 * Retrieves all active categories for the authenticated user.
 *
 * @route  GET /api/categories
 * @access Private
 */
export const getUserCategories = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM categories WHERE user_id = ? AND is_deleted = FALSE ORDER BY name ASC',
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

/**
 * Creates a new category for the authenticated user.
 *
 * @route  POST /api/categories
 * @access Private
 */
export const addCategory = async (req, res) => {
  const { name, type } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO categories (name, type, user_id) VALUES (?, ?, ?)',
      [name, type, req.user.id]
    );
    res.status(201).json({ id: result.insertId, name, type });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add category' });
  }
};

/**
 * Updates an existing category by ID for the authenticated user.
 *
 * @route  PUT /api/categories/:id
 * @access Private
 */
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;
  try {
    const [result] = await db.execute(
      'UPDATE categories SET name = ?, type = ? WHERE id = ? AND user_id = ? AND is_deleted = FALSE',
      [name, type, id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
};

/**
 * Soft-deletes a category by ID for the authenticated user.
 * Sets `is_deleted = TRUE` rather than removing the record.
 *
 * @route  DELETE /api/categories/:id
 * @access Private
 */
export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute(
      'UPDATE categories SET is_deleted = TRUE WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Soft delete failed' });
  }
};
