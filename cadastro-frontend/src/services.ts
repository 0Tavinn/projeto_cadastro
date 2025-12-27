import api from './api';
import {
  Category,
  CategoryPurpose,
  Person,
  TotalsResponse,
  Transaction,
  TransactionType
} from './types';

export async function fetchPeople(): Promise<Person[]> {
  const { data } = await api.get<Person[]>('/api/people');
  return data;
}

export async function createPerson(name: string, age: number): Promise<Person> {
  const { data } = await api.post<Person>('/api/people', { name, age });
  return data;
}

export async function deletePerson(id: string): Promise<void> {
  await api.delete(`/api/people/${id}`);
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/api/categories');
  return data;
}

export async function createCategory(description: string, purpose: CategoryPurpose): Promise<Category> {
  const { data } = await api.post<Category>('/api/categories', { description, purpose });
  return data;
}

export async function createTransaction(
  personId: string,
  description: string,
  amount: number,
  type: TransactionType,
  categoryId: string
): Promise<Transaction> {
  const { data } = await api.post<Transaction>(`/api/people/${personId}/transactions`, {
    description,
    amount,
    type,
    categoryId
  });
  return data;
}

export async function fetchTransactions(personId: string): Promise<Transaction[]> {
  const { data } = await api.get<Transaction[]>(`/api/people/${personId}/transactions`);
  return data;
}

export async function fetchTotals(): Promise<TotalsResponse> {
  const { data } = await api.get<TotalsResponse>('/api/people/totals');
  return data;
}
