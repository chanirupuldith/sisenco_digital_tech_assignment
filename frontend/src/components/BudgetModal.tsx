import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import type { Category } from '../types/category';
import type { Budget, CreateBudgetDTO } from '../types/budget';
import { categoryApi } from '../services/categoryService';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBudgetDTO) => Promise<void>;
  initialData?: Budget | null;
}

const BudgetModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [submitting, setSubmitting] = useState(false);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const years = [2025, 2026, 2027];

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (initialData) {
        setAmount(initialData.amount.toString());
        setCategoryId(initialData.category_id.toString());
        setMonth(initialData.month);
        setYear(initialData.year);
      } else {
        setAmount('');
        setCategoryId('');
        setMonth(new Date().getMonth() + 1);
        setYear(new Date().getFullYear());
      }
    }
  }, [initialData, isOpen]);

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        category_id: parseInt(categoryId),
        amount: parseFloat(amount),
        month: month,
        year: year,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">
            {initialData ? 'Edit Budget' : 'Set Budget'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!initialData && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Category
              </label>
              <select
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!initialData && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Month
                </label>
                <select
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-900"
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value))}
                >
                  {months.map((m, index) => (
                    <option key={m} value={index + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Year
                </label>
                <select
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-900"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Limit Amount (LKR)
            </label>
            <input
              autoFocus={!!initialData}
              type="number"
              step="0.01"
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-900"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {initialData && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Calendar size={18} className="text-slate-400" />
              <span className="text-sm font-bold text-slate-600">
                {months[initialData.month - 1]} {initialData.year}
              </span>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={submitting}
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
            >
              {submitting
                ? 'Saving...'
                : initialData
                  ? 'Update Limit'
                  : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
