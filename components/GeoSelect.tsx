"use client";

import { useEffect, useRef, useState } from "react";

type Option = { id: string; label: string; code?: string };

type GeoSelectProps = {
  label: string;
  placeholder: string;
  type: "countries" | "cities";
  value: Option | null;
  onChange: (opt: Option | null) => void;
  countryId?: string; // used only when type="cities"
  disabled?: boolean;
};

export default function GeoSelect({
  label,
  placeholder,
  type,
  value,
  onChange,
  countryId,
  disabled,
}: GeoSelectProps) {
  const [q, setQ] = useState(value?.label ?? "");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [opts, setOpts] = useState<Option[]>([]);
  const [highlight, setHighlight] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  // 🔒 Close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // ⏳ Debounce input
  const debouncedQ = useDebounce(q, 160);

  // 🔍 Fetch data (from /api/geodb)
  useEffect(() => {
    let ignore = false;
    const fetcher = async () => {
      if (disabled) return;
      if (type === "cities" && !countryId) {
        setOpts([]);
        return;
      }
      if (!debouncedQ || debouncedQ.length < 1) {
        setOpts([]);
        return;
      }
      setLoading(true);
      try {
        const url = new URL("/api/geodb", window.location.origin);
        url.searchParams.set("type", type);
        url.searchParams.set("namePrefix", debouncedQ);
        url.searchParams.set("limit", "8");
        if (type === "cities" && countryId)
          url.searchParams.set("countryId", countryId);

        const res = await fetch(url.toString());
        const json = await res.json();
        if (!ignore) setOpts(json.data ?? []);
      } catch {
        if (!ignore) setOpts([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetcher();
    return () => {
      ignore = true;
    };
  }, [debouncedQ, type, countryId, disabled]);

  // ⌨️ Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, opts.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = opts[highlight];
      if (pick) select(pick);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const select = (opt: Option) => {
    onChange(opt);
    setQ(opt.label);
    setOpen(false);
  };

  // keep input text synced with parent reset
  useEffect(() => {
    if (!value) setQ("");
  }, [value]);

  return (
    <div className="w-full" ref={boxRef}>
      <label className="mb-2 block text-sm font-medium text-black">
        {label}
      </label>
      <div className="relative">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            onChange(null); // reset when typing
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[15px] text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10 disabled:opacity-50"
        />

        {open && (opts.length > 0 || loading) && (
          <ul
            className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-black/10 bg-white shadow-lg"
            role="listbox"
          >
            {loading && (
              <li className="px-3 py-2 text-sm text-gray-500">Loading…</li>
            )}

            {!loading &&
              opts.map((o, idx) => (
                <li
                  key={`${o.id || o.code || o.label || idx}`} // ✅ fixed unique key
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(o);
                  }}
                  onMouseEnter={() => setHighlight(idx)}
                  className={`cursor-pointer px-3 py-2 text-[15px] transition ${
                    idx === highlight ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  {o.label}
                  {o.code && (
                    <span className="ml-2 text-xs text-gray-500">{o.code}</span>
                  )}
                </li>
              ))}

            {!loading && opts.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-500">No results</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

function useDebounce<T>(value: T, ms = 200) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}