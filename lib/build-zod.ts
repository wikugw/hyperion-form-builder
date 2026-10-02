import { z, type ZodTypeAny } from "zod";
import type { FormField } from "@/lib/form-schema";

const REQUIRED_MSG = "Wajib diisi";

export function buildZodSchema(fields: FormField[]) {
  const shape: Record<string, ZodTypeAny> = {};

  for (const f of fields) {
    let rule: ZodTypeAny;

    switch (f.type) {
      case "checkbox":
        rule = f.required
          ? z.boolean().refine((v) => v === true, "Wajib dicentang")
          : z.boolean();
        break;

      case "email":
        rule = f.required
          ? z.string().min(1, REQUIRED_MSG).email("Email tidak valid")
          : z.string().email("Email tidak valid").or(z.literal(""));
        break;

      case "number": {
        // nilai input number tetap string di form, divalidasi manual
        const base = z
          .string()
          .refine(
            (v) => v === "" || !Number.isNaN(Number(v)),
            "Harus berupa angka"
          );
        rule = f.required ? base.refine((v) => v !== "", REQUIRED_MSG) : base;
        break;
      }

      default: // text, textarea, select
        rule = f.required ? z.string().min(1, REQUIRED_MSG) : z.string();
    }

    shape[f.name] = rule;
  }

  return z.object(shape);
}

export function getDefaultValues(fields: FormField[]) {
  return Object.fromEntries(
    fields.map((f) => [f.name, f.type === "checkbox" ? false : ""])
  );
}
