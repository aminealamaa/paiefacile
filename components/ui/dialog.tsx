"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

// Minimal dialog built with native <dialog>
// Français: Dialog simple compatible avec SSR sans Radix.

type DialogContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

export function Dialog({ children, open, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (v: boolean) => void; }) {
  const [isOpen, setIsOpen] = React.useState(Boolean(open));
  React.useEffect(() => { if (open !== undefined) setIsOpen(open); }, [open]);
  const setOpen = (v: boolean) => { setIsOpen(v); onOpenChange?.(v); };
  return <DialogContext.Provider value={{ open: isOpen, setOpen }}>{children}</DialogContext.Provider>;
}

export function DialogTrigger({ children }: { children: React.ReactElement; }) {
  const ctx = React.useContext(DialogContext)!;
  return React.cloneElement(children, { 
    onClick: () => ctx.setOpen(true),
    type: "button"
  } as any);
}

export function DialogContent({ children, className }: { children: React.ReactNode; className?: string; }) {
  const ctx = React.useContext(DialogContext)!;
  if (!ctx.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => ctx.setOpen(false)} />
      <div className={`relative z-10 w-full max-w-lg rounded-md bg-white p-4 shadow-lg ${className || ''}`}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children }: { children: React.ReactNode; }) { return <div className="mb-2">{children}</div>; }
export function DialogTitle({ children }: { children: React.ReactNode; }) { return <h3 className="text-lg font-semibold">{children}</h3>; }
export function DialogFooter({ children }: { children: React.ReactNode; }) { return <div className="mt-4 flex justify-end gap-2">{children}</div>; }


