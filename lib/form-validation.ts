import { z } from "zod";
import { FIELD_TYPES } from "@/lib/form-schema";

const optionZ = z.object({
  id: z.string().min(1),
  label: z.string(),
  value: z.string(),
});

const fieldZ = z.object({
  id: z.string().min(1),
  type: z.enum(FIELD_TYPES),
  label: z.string().max(200),
  name: z.string().regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/),
  placeholder: z.string().max(200).optional(),
  required: z.boolean(),
  options: z.array(optionZ).max(100).optional(),
});

export const formSchemaZ = z
  .object({
    id: z.string().uuid(),
    title: z.string().trim().min(1).max(200),
    description: z.string().max(1000).optional(),
    fields: z.array(fieldZ).max(100),
  })
  .superRefine((form, ctx) => {
    const seen = new Set<string>();
    form.fields.forEach((f, i) => {
      if (seen.has(f.name)) {
        ctx.addIssue({
          code: "custom",
          path: ["fields", i, "name"],
          message: "Name duplikat",
        });
      }
      seen.add(f.name);
    });
  });