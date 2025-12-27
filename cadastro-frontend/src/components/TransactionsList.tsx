import { Person } from '../types';

interface TransactionsListProps {
  selectedPerson: Person | null;
  loading: boolean;
}

export function TransactionsList({ selectedPerson, loading }: TransactionsListProps) {
  return (
    <section className="bg-white p-4 rounded border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Transações</h2>
        {selectedPerson && <p className="text-sm text-slate-500">Selecionado: {selectedPerson.name}</p>}
      </div>
      <div className="space-y-2 max-h-96 overflow-auto pr-1">
        {loading && <p className="text-sm text-slate-500">Carregando...</p>}
        {!loading && (!selectedPerson || selectedPerson.transactions.length === 0) && (
          <p className="text-sm text-slate-500">Nenhuma transação.</p>
        )}
        {!loading &&
          selectedPerson?.transactions.map(t => (
            <div key={t.id} className="border border-slate-200 rounded px-3 py-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{t.description}</p>
                <span
                  className={`text-xs px-2 py-1 rounded ${t.type === 'Despesa' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}
                >
                  {t.type}
                </span>
              </div>
              <p className="text-sm text-slate-600">R$ {t.amount.toFixed(2)}</p>
              <p className="text-xs text-slate-500">
                Categoria: {t.categoryDescription} ({t.categoryPurpose})
              </p>
            </div>
          ))}
      </div>
    </section>
  );
}
