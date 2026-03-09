export type CategoryType = 'income' | 'expense';

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  user_id: number;
  is_deleted: boolean;
  created_at: string;
}

export interface CreateCategoryDTO {
  name: string;
  type: CategoryType;
}
