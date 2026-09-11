import { useLayoutEffect, useRef } from "react";
import { useTranslations } from "@repo/i18n";
import {
  Button,
  Switch,
  Label,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@repo/ui";
import { cn } from "@repo/ui/lib/utils";
import { Trash2 } from "@repo/ui/icons";

type TableContent = {
  headers?: string[];
  rows: string[][];
};

function TableCellInput({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={1}
      className={cn(
        "block w-full min-h-[38px] resize-none overflow-hidden border-0 rounded-none shadow-none bg-transparent px-2 py-1.5 text-base focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring md:text-sm",
        className,
      )}
    />
  );
}

export function BlockTable({
  table,
  onChange,
  error,
}: {
  table: TableContent;
  onChange: (table: TableContent) => void;
  error?: string;
}) {
  const t = useTranslations("BlockForm");
  const colCount = table.headers?.length ?? table.rows[0]?.length ?? 0;

  function updateCell(rowIndex: number, colIndex: number, value: string) {
    onChange({
      ...table,
      rows: table.rows.map((row, r) =>
        r === rowIndex
          ? row.map((cell, c) => (c === colIndex ? value : cell))
          : row,
      ),
    });
  }

  function updateHeader(colIndex: number, value: string) {
    if (!table.headers) return;
    onChange({
      ...table,
      headers: table.headers.map((h, c) => (c === colIndex ? value : h)),
    });
  }

  function toggleHeaders(checked: boolean) {
    onChange({
      ...table,
      headers: checked
        ? Array.from({ length: colCount }, () => "")
        : undefined,
    });
  }

  function addRow() {
    onChange({
      ...table,
      rows: [...table.rows, Array.from({ length: colCount }, () => "")],
    });
  }

  function removeRow(rowIndex: number) {
    if (table.rows.length > 1) {
      onChange({ ...table, rows: table.rows.filter((_, r) => r !== rowIndex) });
    } else {
      onChange({ ...table, rows: [Array.from({ length: colCount }, () => "")] });
    }
  }

  function addColumn() {
    onChange({
      ...table,
      headers: table.headers ? [...table.headers, ""] : undefined,
      rows: table.rows.map((row) => [...row, ""]),
    });
  }

  function removeLastColumn() {
    onChange({
      ...table,
      headers: table.headers?.slice(0, -1),
      rows: table.rows.map((row) => row.slice(0, -1)),
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-md">{t("attributes.table.title")}</p>
      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex gap-2 items-center">
        <Switch checked={!!table.headers} onCheckedChange={toggleHeaders} />
        <Label
          onClick={() => toggleHeaders(!table.headers)}
          className="cursor-pointer"
        >
          {t("attributes.table.hasHeaders")}
        </Label>
      </div>

      <div className="border">
        <Table className="border-collapse table-fixed">
          {table.headers && (
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {table.headers.map((header, c) => (
                  <TableHead key={c} className="h-auto border p-0 bg-muted/40">
                    <TableCellInput
                      value={header}
                      onChange={(value) => updateHeader(c, value)}
                      className="font-medium"
                    />
                  </TableHead>
                ))}
                <TableHead className="w-8 border p-0 bg-muted/40" />
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {table.rows.map((row, r) => (
              <TableRow key={r} className="hover:bg-transparent">
                {row.map((cell, c) => (
                  <TableCell key={c} className="border p-0 align-top">
                    <TableCellInput
                      value={cell}
                      onChange={(value) => updateCell(r, c, value)}
                    />
                  </TableCell>
                ))}
                <TableCell className="w-8 border p-0 text-center">
                  <Trash2
                    className="size-5 mx-auto cursor-pointer text-destructive hover:text-destructive/80"
                    onClick={() => removeRow(r)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex gap-2 items-center">
        <Button variant="outline" size="sm" onClick={addRow}>
          {t("attributes.table.addRow")}
        </Button>
        <Button variant="outline" size="sm" onClick={addColumn}>
          {t("attributes.table.addColumn")}
        </Button>
        {colCount > 1 && (
          <Button variant="outline" size="sm" onClick={removeLastColumn}>
            {t("attributes.table.removeColumn")}
          </Button>
        )}
      </div>
    </div>
  );
}
