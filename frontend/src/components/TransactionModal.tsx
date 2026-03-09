import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Category } from '../types/category';
import type { Transaction, CreateTransactionDTO } from '../types/transaction';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionDTO) => Promise<void>;
  initialData?: Transaction | null;
  categories: Category[];
}

const TransactionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
}) => {
  const [formData, setFormData] = useState<CreateTransactionDTO>({
    title: '',
    amount: 0,
    category_id: 0,
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        amount: initialData.amount,
        category_id: initialData.category_id,
        type: initialData.type,
        date: new Date(initialData.date).toISOString().split('T')[0],
        note: initialData.note || '',
      });
    } else {
      setFormData({
        title: '',
        amount: 0,
        category_id: 0,
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        note: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">
            {initialData ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Amount (LKR)
              </label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as any })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Category
              </label>
              <select
                required
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category_id: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Note (Optional)
              </label>
              <textarea
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none h-20"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              disabled={submitting}
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200"
            >
              {submitting ? 'Saving...' : initialData ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
