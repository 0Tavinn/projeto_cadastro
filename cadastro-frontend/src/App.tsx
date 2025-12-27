import { useEffect, useMemo, useState } from 'react';
import { Category, CategoryPurpose, Person, TotalsResponse, TransactionType } from './types';
import {
  createCategory,
  createPerson,
  createTransaction,
  deletePerson,
  fetchCategories,
  fetchPeople,
  fetchTotals,
  fetchTransactions
} from './services';
import { CategoryForm, CategoryFormState } from './components/CategoryForm';
import { PersonForm, PersonFormState } from './components/PersonForm';
import { TransactionForm, TransactionFormState } from './components/TransactionForm';
import { PeopleList } from './components/PeopleList';
import { TransactionsList } from './components/TransactionsList';
import { TotalsPanel } from './components/TotalsPanel';

function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [totals, setTotals] = useState<TotalsResponse | null>(null);

  const [personForm, setPersonForm] = useState<PersonFormState>({ name: '', age: '' });
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>({ description: '', purpose: 'Despesa' });
  const [transactionForm, setTransactionForm] = useState<TransactionFormState>({
    description: '',
    amount: '',
    type: 'Despesa',
    categoryId: ''
  });

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    if (selectedPersonId) {
      void refreshTransactions(selectedPersonId);
    }
  }, [selectedPersonId]);

  const selectedPerson = useMemo(
    () => people.find(p => p.id === selectedPersonId) ?? null,
    [people, selectedPersonId]
  );

  async function loadData() {
    try {
      setError('');
      const [p, c, t] = await Promise.all([fetchPeople(), fetchCategories(), fetchTotals()]);
      setPeople(p);
      setCategories(c);
      setTotals(t);
      if (!selectedPersonId && p.length > 0) {
        setSelectedPersonId(p[0].id);
      }
    } catch (err: any) {
      setError(err?.response?.data ?? 'Erro ao carregar dados.');
    }
  }

  async function refreshTransactions(personId: string) {
    try {
      setTransactionsLoading(true);
      const tx = await fetchTransactions(personId);
      setPeople(prev => prev.map(p => (p.id === personId ? { ...p, transactions: tx } : p)));
    } catch (err: any) {
      setError(err?.response?.data ?? 'Erro ao carregar transações.');
    } finally {
      setTransactionsLoading(false);
    }
  }

  async function refreshTotals() {
    try {
      const t = await fetchTotals();
      setTotals(t);
    } catch (err: any) {
      setError(err?.response?.data ?? 'Erro ao carregar totais.');
    }
  }

  async function handleCreatePerson() {
    if (!personForm.name.trim() || !personForm.age) return;
    const ageNum = Number(personForm.age);
    if (!Number.isFinite(ageNum) || ageNum <= 0) {
      setError('Idade deve ser um número positivo.');
      return;
    }
    try {
      setCreating(true);
      const created = await createPerson(personForm.name.trim(), ageNum);
      setPeople(prev => [...prev, { ...created, transactions: [] }]);
      setPersonForm({ name: '', age: '' });
      setSelectedPersonId(created.id);
      setError('');
      await refreshTotals();
    } catch (err: any) {
      setError(err?.response?.data ?? 'Erro ao criar pessoa.');
    } finally {
      setCreating(false);
    }
  }

  async function handleDeletePerson(id: string) {
    try {
      await deletePerson(id);
      setPeople(prev => prev.filter(p => p.id !== id));
      if (selectedPersonId === id) {
        setSelectedPersonId('');
      }
      await refreshTotals();
    } catch (err: any) {
      setError(err?.response?.data ?? 'Erro ao deletar pessoa.');
    }
  }

  async function handleCreateCategory() {
    if (!categoryForm.description.trim()) return;
    const purpose = categoryForm.purpose as CategoryPurpose;
    try {
      setCreating(true);
      const created = await createCategory(categoryForm.description.trim(), purpose);
      setCategories(prev => [...prev, created]);
      setCategoryForm({ description: '', purpose: 'Despesa' });
      setError('');
    } catch (err: any) {
      setError(err?.response?.data ?? 'Erro ao criar categoria.');
    } finally {
      setCreating(false);
    }
  }

  async function handleCreateTransaction() {
    if (!selectedPerson) {
      setError('Selecione uma pessoa.');
      return;
    }
    if (!transactionForm.description.trim()) return;
    const amountNum = Number(transactionForm.amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setError('Valor deve ser maior que zero.');
      return;
    }
    const type = transactionForm.type as TransactionType;
    try {
      setCreating(true);
      const created = await createTransaction(
        selectedPerson.id,
        transactionForm.description.trim(),
        amountNum,
        type,
        transactionForm.categoryId
      );
      setPeople(prev =>
        prev.map(p =>
          p.id === selectedPerson.id ? { ...p, transactions: [...p.transactions, created] } : p
        )
      );
      setTransactionForm({ description: '', amount: '', type: 'Despesa', categoryId: '' });
      setError('');
      await refreshTotals();
    } catch (err: any) {
      setError(err?.response?.data ?? 'Erro ao criar transação.');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white py-4 shadow">
        <div className="max-w-6xl mx-auto px-4 flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Cadastro de Pessoas</h1>
          <p className="text-sm text-slate-200">Back-end em .NET + Front em React/TS + Tailwind</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <section className="grid md:grid-cols-3 gap-4">
          <PersonForm value={personForm} creating={creating} onChange={setPersonForm} onSubmit={handleCreatePerson} />
          <CategoryForm value={categoryForm} creating={creating} onChange={setCategoryForm} onSubmit={handleCreateCategory} />
          <TransactionForm
            value={transactionForm}
            people={people}
            categories={categories}
            selectedPersonId={selectedPersonId}
            onChange={setTransactionForm}
            onPersonChange={setSelectedPersonId}
            onSubmit={handleCreateTransaction}
            creating={creating}
          />
        </section>

        <section className="grid md:grid-cols-2 gap-4">
          <PeopleList
            people={people}
            selectedPersonId={selectedPersonId}
            onSelect={setSelectedPersonId}
            onDelete={id => void handleDeletePerson(id)}
            onReload={() => void loadData()}
          />
          <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Categorias</h2>
              <button className="text-sm text-slate-500 underline" onClick={() => void loadData()}>
                Recarregar
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-auto pr-1">
              {categories.length === 0 && <p className="text-sm text-slate-500">Nenhuma categoria.</p>}
              {categories.map(c => (
                <div key={c.id} className="border border-slate-200 rounded px-3 py-2">
                  <p className="font-semibold">{c.description}</p>
                  <p className="text-sm text-slate-500">Finalidade: {c.purpose}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TransactionsList selectedPerson={selectedPerson} loading={transactionsLoading} />

        <TotalsPanel totals={totals} onRefresh={() => void refreshTotals()} />
      </main>
    </div>
  );
}

export default App;
