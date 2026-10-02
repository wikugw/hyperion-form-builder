export const FIELD_TYPES = [
  "text",
  "textarea",
  "number",
  "email",
  "select",
  "checkbox",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  name: string; // key di data hasil submit
  placeholder?: string;
  required: boolean;
  options?: FieldOption[]; // hanya dipakai type "select"
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export const FIELD_META: Record<
  FieldType,
  { label: string; defaultLabel: string }
> = {
  text: { label: "Teks singkat", defaultLabel: "Teks" },
  textarea: { label: "Teks panjang", defaultLabel: "Deskripsi" },
  number: { label: "Angka", defaultLabel: "Angka" },
  email: { label: "Email", defaultLabel: "Email" },
  select: { label: "Dropdown", defaultLabel: "Pilihan" },
  checkbox: { label: "Checkbox", defaultLabel: "Setuju" },
};

export function createField(type: FieldType): FormField {
  const id = crypto.randomUUID();

  return {
    id,
    type,
    label: FIELD_META[type].defaultLabel,
    name: `${type}_${id.slice(0, 6)}`,
    placeholder: "",
    required: false,
    options:
      type === "select"
        ? [
            {
              id: crypto.randomUUID(),
              label: "Opsi 1",
              value: "opsi_1",
            },
          ]
        : undefined,
  };
}

export function createEmptyForm(): FormSchema {
  return {
    id: crypto.randomUUID(),
    title: "Form tanpa judul",
    fields: [],
  };
}

const NAME_PATTERN = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

export function validateFieldName(
  name: string,
  fields: FormField[],
  currentId: string
): string | null {
  if (!name.trim()) return "Name tidak boleh kosong";
  if (!NAME_PATTERN.test(name)) {
    return "Hanya huruf, angka, dan underscore; tidak boleh diawali angka";
  }
  const duplicate = fields.some((f) => f.id !== currentId && f.name === name);
  if (duplicate) return "Name sudah dipakai field lain";
  return null;
}
