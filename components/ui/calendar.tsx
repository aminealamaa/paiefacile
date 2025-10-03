"use client";
import * as React from "react";
import { format } from "date-fns";

// Minimal Calendar: native input[type=date] wrapper for simplicity
// Français: Pour l'MVP, on utilise input date natif.

export function Calendar({ value, onChange }: { value?: Date; onChange?: (d: Date) => void; }) {
  const str = value ? format(value, "yyyy-MM-dd") : "";
  return (
    <input
      type="date"
      className="w-full rounded-md border px-3 py-2"
      value={str}
      onChange={(e) => {
        const d = e.target.value ? new Date(e.target.value + "T00:00:00") : undefined;
        if (d && onChange) onChange(d);
      }}
    />
  );
}


