"use client";
import * as React from "react";
import { format } from "date-fns";

// Minimal Calendar: native input[type=date] wrapper for simplicity
// Français: Pour l'MVP, on utilise input date natif.

export function Calendar({ 
  value, 
  onChange, 
  selected, 
  onSelect, 
  className 
}: { 
  value?: Date; 
  onChange?: (d: Date) => void; 
  selected?: Date;
  onSelect?: (d: Date | undefined) => void;
  className?: string;
}) {
  const currentValue = selected || value;
  const str = currentValue ? format(currentValue, "yyyy-MM-dd") : "";
  const handleChange = onSelect || onChange;
  
  return (
    <input
      type="date"
      className={`w-full rounded-md border px-3 py-2 ${className || ''}`}
      value={str}
      onChange={(e) => {
        const d = e.target.value ? new Date(e.target.value + "T00:00:00") : undefined;
        if (d && handleChange) handleChange(d);
      }}
    />
  );
}


