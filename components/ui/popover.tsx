"use client";
import * as React from "react";

// Minimal Popover
// Français: Popover simple positionné.

const PopoverContext = React.createContext<{ open: boolean; setOpen: (v: boolean) => void; } | null>(null);

export function Popover({ children }: { children: React.ReactNode; }) {
  const [open, setOpen] = React.useState(false);
  return <PopoverContext.Provider value={{ open, setOpen }}>{children}</PopoverContext.Provider>;
}

export function PopoverTrigger({ children }: { children: React.ReactElement; }) {
  const ctx = React.useContext(PopoverContext)!;
  return React.cloneElement(children, { onClick: () => ctx.setOpen(!ctx.open) });
}

export function PopoverContent({ children, className }: { children: React.ReactNode; className?: string; }) {
  const ctx = React.useContext(PopoverContext)!;
  if (!ctx.open) return null;
  return <div className={`z-50 mt-2 rounded-md border bg-white p-2 shadow ${className ?? ""}`}>{children}</div>;
}


