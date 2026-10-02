"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FormField } from "@/lib/form-schema";

interface FieldInputProps {
  field: FormField;
  id: string;
  value?: unknown;
  onChange?: (value: unknown) => void;
  onBlur?: () => void;
  disabled?: boolean;
  invalid?: boolean;
}

export function FieldInput({
  field,
  id,
  value,
  onChange,
  onBlur,
  disabled,
  invalid,
}: FieldInputProps) {
  const text = typeof value === "string" ? value : "";

  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          id={id}
          value={text}
          placeholder={field.placeholder}
          disabled={disabled}
          aria-invalid={invalid}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
        />
      );

    case "select":
      return (
        <Select
          value={text}
          onValueChange={(v) => onChange?.(v)}
          disabled={disabled}
        >
          <SelectTrigger id={id} className="w-full" aria-invalid={invalid}>
            <SelectValue placeholder="Pilih salah satu" />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((opt) => (
              <SelectItem key={opt.id} value={opt.value || opt.id}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "checkbox":
      return (
        <Checkbox
          id={id}
          checked={value === true}
          disabled={disabled}
          aria-invalid={invalid}
          onCheckedChange={(v) => onChange?.(v === true)}
        />
      );

    default: // text, number, email
      return (
        <Input
          id={id}
          type={field.type === "text" ? "text" : field.type}
          value={text}
          placeholder={field.placeholder}
          disabled={disabled}
          aria-invalid={invalid}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
        />
      );
  }
}
