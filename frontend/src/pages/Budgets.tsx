import React, { useState, useEffect } from 'react';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Target,
  AlertCircle,
  Edit2,
} from 'lucide-react';
import { budgetApi } from '../services/budgetService';
import { toast } from 'sonner';
import type { Budget, CreateBudgetDTO } from '../types/budget';
import BudgetModal from '../components/BudgetModal';

const Budgets: React.FC = () => {
  const [allBudgets, setAllBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const selectedMonth = currentDate.getMonth() + 1;
  const selectedYear = currentDate.getFullYear();

  useEffect(() => {
    fetchAllBudgets();
  }, []);

  const fetchAllBudgets = async () => {
    try {
      setIsLoading(true);
      const data = await budgetApi.getBudgets();
      setAllBudgets(data);
    } catch (error) {
      toast.error('Could not load budgets.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSubmit = async (data: CreateBudgetDTO) => {
    try {
      if (editingBudget) {
        await budgetApi.update(editingBudget.id, data.amount);
        toast.success('Budget updated successfully');
      } else {
        await budgetApi.create(data);
        toast.success('Budget created successfully');
      }
      fetchAllBudgets();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const filteredBudgets = allBudgets.filter(
    (b: any) => b.month === selectedMonth && b.year === selectedYear
  );

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(
      currentDate.setMonth(currentDate.getMonth() + offset)
    );
    setCurrentDate(new Date(newDate));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Budgeting</h1>
          <p className="text-slate-500">
            Managing {allBudgets.length} total budget goals
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => handleMonthChange(-1)}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-600"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 font-bold text-slate-700 min-w-[140px] text-center text-sm">
              {currentDate.toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <button
              onClick={() => handleMonthChange(1)}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <button
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition-all font-semibold shadow-lg text-sm"
            onClick={() => {
              setEditingBudget(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={18} />
            New Budget
          </button>
        </div>
      </div>

      {/* Budget List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-24 bg-slate-100 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBudgets.length > 0 ? (
            filteredBudgets.map((budget: any) => {
              const isOver = budget.current_spent > budget.amount;
              const progress = Math.min(
                (budget.current_spent / budget.amount) * 100,
                100
              );

              return (
                <div
                  key={budget.id}
                  className="group p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-200 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isOver ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}
                      >
                        <Target size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 leading-tight">
                          {budget.category_name}
                        </h3>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-0.5">
                          {budget.category_type}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-medium">
                          Progress
                        </p>
                        <p className="font-bold text-slate-900">
                          LKR{' '}
                          {Number(budget.current_spent || 0).toLocaleString()}
                          <span className="text-slate-300 font-normal">
                            {' '}
                            / {Number(budget.amount).toLocaleString()}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 border-l border-slate-100 pl-4">
                        <button
                          className="p-2 text-slate-400 hover:text-blue-600 rounded-lg"
                          onClick={() => {
                            setEditingBudget(budget);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ${isOver ? 'bg-rose-500' : 'bg-blue-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {isOver && (
                    <div className="flex items-center gap-1.5 text-rose-600 mt-2 text-xs font-bold">
                      <AlertCircle size={14} />
                      <span>Exceeded Budget</span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <Target className="mx-auto text-slate-300 mb-4" size={40} />
              <p className="text-slate-400 font-medium">
                No budgets found for{' '}
                {currentDate.toLocaleString('default', {
                  month: 'long',
                  year: 'numeric',
                })}
                .
              </p>
            </div>
          )}
        </div>
      )}

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={editingBudget}
      />
    </div>
  );
};

export default Budgets;
