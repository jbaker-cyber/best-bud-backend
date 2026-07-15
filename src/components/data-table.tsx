import { useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Filter as FilterIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function useTableState<T>(
  data: T[],
  searchKeys: (keyof T)[],
  {
    pageSize = 10,
    filters,
  }: { pageSize?: number; filters?: Record<string, (item: T) => boolean> } = {}
) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((item) => {
      if (q) {
        const hit = searchKeys.some((k) => String(item[k] ?? "").toLowerCase().includes(q));
        if (!hit) return false;
      }
      if (filters) {
        for (const fn of Object.values(filters)) {
          if (!fn(item)) return false;
        }
      }
      return true;
    });
  }, [data, query, searchKeys, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageData = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return {
    query,
    setQuery: (v: string) => { setQuery(v); setPage(1); },
    page: safePage,
    totalPages,
    setPage,
    filtered,
    pageData,
    pageSize,
    total: filtered.length,
  };
}

export function TableToolbar({
  query, onQueryChange, placeholder = "Search…", children, actions,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder={placeholder} className="h-10 rounded-full bg-card pl-10" />
        </div>
        {children}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function FilterSelect({
  value, onChange, options, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10 w-[160px] rounded-full bg-card">
        <FilterIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function Pagination({
  page, totalPages, onChange, total, pageSize,
}: {
  page: number; totalPages: number; onChange: (n: number) => void;
  total: number; pageSize: number;
}) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  return (
    <div className="mt-4 flex items-center justify-between gap-2 text-sm text-muted-foreground">
      <div>Showing <span className="font-semibold text-foreground">{from}-{to}</span> of {total}</div>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
          const n = i + 1;
          return (
            <Button
              key={n}
              variant={n === page ? "default" : "outline"}
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onChange(n)}
            >
              {n}
            </Button>
          );
        })}
        {totalPages > 5 && <span className="px-1">…</span>}
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
