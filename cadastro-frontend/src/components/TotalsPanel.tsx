import { TotalsResponse } from '../types';

interface TotalsPanelProps {
  totals: TotalsResponse | null;
  onRefresh: () => void;
}

export function TotalsPanel({ totals, onRefresh }: TotalsPanelProps) {
  return (
    <section className="bg-white p-4 rounded border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Totais</h2>
        <button className="text-sm text-slate-500 underline" onClick={onRefresh}>
          Atualizar
        </button>
      </div>
      {!totals && <p className="text-sm text-slate-500">Sem dados.</p>}
      {totals && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-emerald-50 border border-emerald-100 rounded p-3">
              <p className="text-sm text-emerald-700">Total Receitas</p>
              <p className="text-xl font-semibold text-emerald-800">R$ {totals.overall.totalReceitas.toFixed(2)}</p>
            </div>
            <div className="bg-rose-50 border border-rose-100 rounded p-3">
              <p className="text-sm text-rose-700">Total Despesas</p>
              <p className="text-xl font-semibold text-rose-800">R$ {totals.overall.totalDespesas.toFixed(2)}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded p-3">
              <p className="text-sm text-slate-700">Saldo Líquido</p>
              <p className="text-xl font-semibold text-slate-900">R$ {totals.overall.saldo.toFixed(2)}</p>
            </div>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm border border-slate-200">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2 text-left">Pessoa</th>
                  <th className="px-3 py-2 text-left">Receitas</th>
                  <th className="px-3 py-2 text-left">Despesas</th>
                  <th className="px-3 py-2 text-left">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {totals.people.map(p => (
                  <tr key={p.personId} className="border-t border-slate-200">
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2 text-emerald-700">R$ {p.totalReceitas.toFixed(2)}</td>
                    <td className="px-3 py-2 text-rose-700">R$ {p.totalDespesas.toFixed(2)}</td>
                    <td className="px-3 py-2 font-semibold">R$ {p.saldo.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
