import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type {
  Category,
  CreateCategoryDTO,
  CategoryType,
} from '../types/category';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryDTO) => Promise<void>;
  initialData?: Category | null;
}

const CategoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<CategoryType>('expense');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setType(initialData.type);
    } else {
      setName('');
      setType('expense');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ name, type });
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
            {initialData ? 'Edit Category' : 'Add Category'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Category Name
            </label>
            <input
              autoFocus
              type="text"
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. Freelancing, Groceries"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              {(['income', 'expense'] as CategoryType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 text-sm font-bold rounded-lg capitalize transition-all ${
                    type === t
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

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
                  ? 'Update Category'
                  : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
