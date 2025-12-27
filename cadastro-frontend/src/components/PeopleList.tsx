import { Person } from '../types';

interface PeopleListProps {
  people: Person[];
  selectedPersonId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onReload: () => void;
}

export function PeopleList({ people, selectedPersonId, onSelect, onDelete, onReload }: PeopleListProps) {
  return (
    <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Pessoas</h2>
        <button className="text-sm text-slate-500 underline" onClick={() => onReload()}>
          Recarregar
        </button>
      </div>
      <div className="space-y-2 max-h-96 overflow-auto pr-1">
        {people.length === 0 && <p className="text-sm text-slate-500">Nenhuma pessoa.</p>}
        {people.map(p => (
          <div
            key={p.id}
            className={`border rounded px-3 py-2 flex items-center justify-between ${selectedPersonId === p.id ? 'border-slate-700' : 'border-slate-200'}`}
          >
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-slate-500">{p.age} anos</p>
            </div>
            <div className="flex gap-2 items-center">
              <button className="text-xs px-3 py-1 border rounded" onClick={() => onSelect(p.id)}>
                Selecionar
              </button>
              <button
                className="text-xs px-3 py-1 border border-red-200 text-red-600 rounded"
                onClick={() => onDelete(p.id)}
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
