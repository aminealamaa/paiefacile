'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface MobileFormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  value?: unknown;
  onChange?: (value: unknown) => void;
  error?: string;
  className?: string;
}

export function MobileFormField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  options = [],
  value,
  onChange,
  error,
  className
}: MobileFormFieldProps) {
  const handleChange = (newValue: unknown) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {type === 'select' ? (
        <Select value={value as string} onValueChange={handleChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : type === 'date' ? (
        <Popover>
          <PopoverTrigger>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(value as Date, "PPP", { locale: fr }) : <span>{placeholder}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              selected={value as Date}
              onSelect={handleChange}
            />
          </PopoverContent>
        </Popover>
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value as string}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full"
        />
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

interface MobileFormProps {
  title: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

export function MobileForm({
  title,
  children,
  onSubmit,
  submitLabel = "Enregistrer",
  cancelLabel = "Annuler",
  onCancel,
  loading = false,
  className
}: MobileFormProps) {
  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            {children}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              className="w-full sm:w-auto sm:ml-auto"
              disabled={loading}
            >
              {loading ? "Enregistrement..." : submitLabel}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="w-full sm:w-auto"
              >
                {cancelLabel}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Mobile-optimized form sections
export function MobileFormSection({ 
  title, 
  children, 
  className 
}: { 
  title: string; 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
        {title}
      </h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

// Mobile-optimized form grid
export function MobileFormGrid({ 
  children, 
  cols = 1 
}: { 
  children: React.ReactNode; 
  cols?: 1 | 2; 
}) {
  return (
    <div className={cn(
      "grid gap-4",
      cols === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
    )}>
      {children}
    </div>
  );
}
