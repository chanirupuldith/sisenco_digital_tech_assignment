export interface Budget {
  id: number;
  category_id: number;
  category_name: string;
  category_type: 'income' | 'expense';
  amount: number;
  month: number;
  year: number;
  current_spent?: number;
}

export interface CreateBudgetDTO {
  category_id: number;
  amount: number;
  month: number;
  year: number;
}
