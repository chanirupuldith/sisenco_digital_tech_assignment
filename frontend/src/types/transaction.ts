export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  category_id: number;
  category_name: string;
  note?: string | null;
  is_deleted: boolean;
  created_at?: string;
}

export interface CreateTransactionDTO {
  title: string;
  amount: number;
  category_id: number;
  type: TransactionType;
  date: string;
  note?: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: TransactionType | '';
  category?: string | number;
}
