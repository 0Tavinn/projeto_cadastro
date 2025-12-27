import { Category, Person, TransactionType } from '../types';

export type TransactionFormState = {
  description: string;
  amount: string;
  type: TransactionType;
  categoryId: string;
};

interface TransactionFormProps {
  value: TransactionFormState;
  people: Person[];
  categories: Category[];
  selectedPersonId: string;
  onChange: (value: TransactionFormState) => void;
  onPersonChange: (id: string) => void;
  onSubmit: () => void;
  creating: boolean;
}

export function TransactionForm({
  value,
  people,
  categories,
  selectedPersonId,
  onChange,
  onPersonChange,
  onSubmit,
  creating
}: TransactionFormProps) {
  return (
    <div className="bg-white p-4 rounded shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold mb-3">Nova Transação</h2>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-slate-600">Pessoa</label>
          <select
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={selectedPersonId}
            onChange={e => onPersonChange(e.target.value)}
          >
            <option value="">Selecione</option>
            {people.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.age} anos)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-600">Descrição</label>
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={value.description}
            onChange={e => onChange({ ...value, description: e.target.value })}
            placeholder="Supermercado"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm text-slate-600">Valor</label>
            <input
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={value.amount}
              onChange={e => onChange({ ...value, amount: e.target.value })}
              type="number"
              min={0}
              step={0.01}
              placeholder="0,00"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Tipo</label>
            <select
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              value={value.type}
              onChange={e => onChange({ ...value, type: e.target.value as TransactionType })}
            >
              <option value="Despesa">Despesa</option>
              <option value="Receita">Receita</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm text-slate-600">Categoria</label>
          <select
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={value.categoryId}
            onChange={e => onChange({ ...value, categoryId: e.target.value })}
          >
            <option value="">Selecione</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.description} ({c.purpose})
              </option>
            ))}
          </select>
        </div>
        <button
          className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-500 disabled:opacity-60"
          onClick={onSubmit}
          disabled={creating || !selectedPersonId}
        >
          Registrar transação
        </button>
      </div>
    </div>
  );
}
