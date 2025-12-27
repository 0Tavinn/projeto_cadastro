import { CategoryPurpose } from '../types';

export type CategoryFormState = { description: string; purpose: CategoryPurpose };

interface CategoryFormProps {
  value: CategoryFormState;
  creating: boolean;
  onChange: (value: CategoryFormState) => void;
  onSubmit: () => void;
}

export function CategoryForm({ value, creating, onChange, onSubmit }: CategoryFormProps) {
  return (
    <div className="bg-white p-4 rounded shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold mb-3">Nova Categoria</h2>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-slate-600">Descrição</label>
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={value.description}
            onChange={e => onChange({ ...value, description: e.target.value })}
            placeholder="Mercado"
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">Finalidade</label>
          <select
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={value.purpose}
            onChange={e => onChange({ ...value, purpose: e.target.value as CategoryPurpose })}
          >
            <option value="Despesa">Despesa</option>
            <option value="Receita">Receita</option>
            <option value="Ambas">Ambas</option>
          </select>
        </div>
        <button
          className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800 disabled:opacity-60"
          onClick={onSubmit}
          disabled={creating}
        >
          Criar categoria
        </button>
      </div>
    </div>
  );
}
