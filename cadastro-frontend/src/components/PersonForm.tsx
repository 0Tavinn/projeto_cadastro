import { CategoryPurpose } from '../types';

export type PersonFormState = { name: string; age: string };

interface PersonFormProps {
  value: PersonFormState;
  creating: boolean;
  onChange: (value: PersonFormState) => void;
  onSubmit: () => void;
}

export function PersonForm({ value, creating, onChange, onSubmit }: PersonFormProps) {
  return (
    <div className="bg-white p-4 rounded shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold mb-3">Nova Pessoa</h2>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-slate-600">Nome</label>
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={value.name}
            onChange={e => onChange({ ...value, name: e.target.value })}
            placeholder="Nome"
          />
        </div>
        <div>
          <label className="text-sm text-slate-600">Idade</label>
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={value.age}
            onChange={e => onChange({ ...value, age: e.target.value })}
            type="number"
            min={1}
            placeholder="18"
          />
        </div>
        <button
          className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800 disabled:opacity-60"
          onClick={onSubmit}
          disabled={creating}
        >
          Criar pessoa
        </button>
      </div>
    </div>
  );
}
