export type TransactionType = 'Despesa' | 'Receita';
export type CategoryPurpose = 'Despesa' | 'Receita' | 'Ambas';

export interface Person {
  id: string;
  name: string;
  age: number;
  transactions: Transaction[];
}

export interface Category {
  id: string;
  description: string;
  purpose: CategoryPurpose;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  createdAt: string;
  type: TransactionType;
  categoryId: string;
  categoryDescription: string;
  categoryPurpose: CategoryPurpose;
}

export interface PersonTotalsResponse {
  personId: string;
  name: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotalsSummaryResponse {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotalsResponse {
  people: PersonTotalsResponse[];
  overall: TotalsSummaryResponse;
}
