import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
} from 'lucide-react';
import { transactionApi } from '../services/transactionService';
import { categoryApi } from '../services/categoryService';
import type { Category } from '../types/category';
import type { Transaction, CreateTransactionDTO } from '../types/transaction';
import TransactionModal from '../components/TransactionModal';
import { toast } from 'sonner';
import ConfirmModal from '../components/ConfirmationModal';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '',
    category: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const cats = await categoryApi.getCategories();
      setCategories(cats);
      await fetchTransactions();
    } catch (error) {
      toast.error('Failed to load initial data');
    }
  };

  const fetchTransactions = async (currentFilters = filters) => {
    setIsLoading(true);
    try {
      const data = await transactionApi.getTransactions(currentFilters);
      setTransactions(data);
    } catch (error) {
      toast.error('Error fetching transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    fetchTransactions(newFilters);
  };

  const handleModalSubmit = async (data: CreateTransactionDTO) => {
    try {
      if (editingTransaction) {
        await transactionApi.update(editingTransaction.id, data);
        toast.success('Transaction updated');
      } else {
        await transactionApi.create(data);
        toast.success('Transaction added');
      }
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to save transaction');
      throw error;
    }
  };

  const promptDelete = (id: number) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await transactionApi.delete(deleteId);
      toast.success('Transaction deleted successfully');
      fetchTransactions(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };


  // Local Search Filtering (Filters by Title)
  const filteredTransactions = transactions.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.note?.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="text-slate-500 text-sm font-medium">
            Manage your financial records
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTransaction(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all font-semibold shadow-lg shadow-blue-200"
        >
          <Plus size={18} /> New Transaction
        </button>
      </div>

      <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4">
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by title..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
              Date Range
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
              Type
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
              Category
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end pb-1">
            <button
              onClick={() => {
                setFilters({
                  startDate: '',
                  endDate: '',
                  type: '',
                  category: '',
                });
                fetchTransactions({
                  startDate: '',
                  endDate: '',
                  type: '',
                  category: '',
                });
                setSearchQuery('');
              }}
              className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Note
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Amount
                </th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-10 text-center text-slate-400 italic"
                  >
                    Loading records...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-10 text-center text-slate-400 italic"
                  >
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}
                        >
                          {t.type === 'income' ? (
                            <ArrowDownLeft size={18} />
                          ) : (
                            <ArrowUpRight size={18} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-tight">
                            {t.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              {new Date(t.date).toLocaleDateString()}
                            </span>
                            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-1.5 rounded truncate max-w-[80px]">
                              {t.category_name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-400 font-medium italic">
                        {t.note && t.note.trim() !== '' ? t.note : '—'}
                      </span>
                    </td>
                    <td
                      className={`p-4 text-sm font-bold text-right ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}
                    >
                      {t.type === 'income' ? '+' : '-'}{' '}
                      {Number(t.amount).toLocaleString('en-LK', {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button
                          onClick={() => {
                            setEditingTransaction(t);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => promptDelete(t.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingTransaction}
        categories={categories}
      />
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message="Are you sure you want to remove this record?"
        confirmText="Delete Now"
        type="danger"
      />
    </div>
  );
};

export default Transactions;
