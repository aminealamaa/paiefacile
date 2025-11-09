"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useFormContext, FormProvider } from "react-hook-form";

// Minimal shadcn-like Form wrappers
// Français: Aides de formulaire basées sur react-hook-form.

export const Form = FormProvider;

export function FormField({ name, render }: { name: string; render: (field: Record<string, unknown>) => React.ReactNode; }) {
  const { register, formState: { errors } } = useFormContext();
  const error = (errors as Record<string, any>)[name]?.message as string | undefined;
  return <div>{render({ ...register(name) })}{error && <p className="mt-1 text-sm text-red-600">{error}</p>}</div>;
}

export function FormItem({ children }: { children: React.ReactNode; }) { return <div className="space-y-2">{children}</div>; }
export function FormLabel(props: React.LabelHTMLAttributes<HTMLLabelElement>) { return <label className="text-sm font-medium" {...props} />; }
export function FormControl({ children }: { children: React.ReactNode; }) { return <div>{children}</div>; }
export function FormMessage({ children }: { children?: React.ReactNode; }) { return <p className="text-sm text-red-600">{children}</p>; }


