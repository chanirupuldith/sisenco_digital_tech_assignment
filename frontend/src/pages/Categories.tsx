import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, Tag } from 'lucide-react';
import { categoryApi } from '../services/categoryService';
import type { Category, CreateCategoryDTO } from '../types/category';
import CategoryModal from '../components/CategoryModal';
import { toast } from 'sonner';
import ConfirmModal from '../components/ConfirmationModal';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoryApi.getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSubmit = async (data: CreateCategoryDTO) => {
    try {
      if (editingCategory) {
        await categoryApi.update(editingCategory.id, data);
        toast.success('Category updated successfully!');
      } else {
        await categoryApi.create(data);
        toast.success(`${data.name} created successfully!`);
      }
      fetchCategories();
      setEditingCategory(null); // Reset and close
    } catch (error: any) {
      const message = error.response?.data?.errors?.[0]?.msg || 'Action failed';
      toast.error(message);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await categoryApi.delete(categoryToDelete.id);
      toast.success(`Category \'${categoryToDelete.name}\' has been deleted`);
      setCategories((prev) =>
        prev.filter((cat) => cat.id !== categoryToDelete.id)
      );
    } catch (error) {
      toast.error('Could not delete category');
    } finally {
      setCategoryToDelete(null);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-slate-500">
            Organize your finances with custom labels.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all font-semibold shadow-lg shadow-blue-100 active:scale-95"
        >
          <Plus size={20} />
          New Category
        </button>
      </div>

      <div className="relative group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Search categories by name..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Categories List View */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 bg-slate-100 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div
                key={category.id}
                className="group flex items-center justify-between p-3 md:p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all gap-3"
              >
                {/* Left Side: Icon & Info */}
                <div className="flex items-center gap-3 md:gap-5 min-w-0">
                  {' '}
                  {/* min-w-0 allows truncation */}
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      category.type === 'income'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    <Tag className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    {' '}
                    {/* Container for text truncation */}
                    <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight truncate">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-md shrink-0 ${
                          category.type === 'income'
                            ? 'bg-emerald-100/50 text-emerald-700'
                            : 'bg-rose-100/50 text-rose-700'
                        }`}
                      >
                        {category.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Actions - Visible by default on mobile, hover on desktop */}
                <div className="flex items-center gap-1 md:gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setIsModalOpen(true);
                    }}
                    className="p-2 md:p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-transparent hover:border-blue-100"
                    title="Edit Category"
                  >
                    <Edit2 size={18} className="md:w-5 md:h-5" />
                  </button>
                  <button
                    onClick={() => setCategoryToDelete(category)}
                    className="p-2 md:p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100"
                    title="Delete Category"
                  >
                    <Trash2 size={18} className="md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">
                No categories found matching "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      )}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={editingCategory}
      />
      <ConfirmModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Category?"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"?`}
      />
    </div>
  );
};

export default Categories;
