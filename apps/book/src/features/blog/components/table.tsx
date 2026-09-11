import type { Block } from "../types";

type TableBlock = Extract<Block, { type: "table" }>;

export function Table({ table }: { table: TableBlock["content"] }) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        {table.headers && (
          <thead className="bg-muted">
            <tr>
              {table.headers.map((header, i) => (
                <th
                  key={i}
                  className="border-b border-border px-4 py-2.5 text-left font-medium text-foreground"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {table.rows.map((row, r) => (
            <tr
              key={r}
              className="border-b border-border last:border-0 even:bg-muted/30"
            >
              {row.map((cell, c) => (
                <td key={c} className="px-4 py-2.5 text-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
