import Badge from '../ui/Badge';

const toneFor = (value) =>
  typeof value === 'string' && ['active', 'open', 'published', 'yes'].includes(value.toLowerCase())
    ? 'green'
    : typeof value === 'string' && ['closed', 'draft', 'archived', 'inactive', 'suspended'].includes(value.toLowerCase())
    ? 'red'
    : undefined;

export default function DataTable({ columns, rows = [], rowKey = 'id', actions }) {
  if (!rows.length) {
    return (
      <div className="card-base p-10 text-center text-sm text-brand-600">No records found.</div>
    );
  }

  return (
    <div className="card-base overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-brand-100 bg-brand-50/60 text-xs uppercase tracking-wider text-brand-600">
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-semibold">
                {c.label}
              </th>
            ))}
            {actions ? <th className="px-4 py-3 text-right font-semibold">Actions</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-100">
          {rows.map((row, i) => (
            <tr key={row[rowKey] ?? i} className="transition hover:bg-brand-50/40">
              {columns.map((c) => {
                const value = row[c.key];
                const label = typeof c.render === 'function' ? c.render(row) : value;
                const tone = c.tone === 'badge' ? toneFor(String(value)) : undefined;
                return (
                  <td key={c.key} className="px-4 py-3 align-middle text-brand-800">
                    {tone ? <Badge tone={tone}>{label}</Badge> : <span className="line-clamp-2">{label}</span>}
                  </td>
                );
              })}
              {actions ? (
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">{actions(row)}</div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}