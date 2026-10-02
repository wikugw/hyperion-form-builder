import { create } from "zustand";
import {
  createEmptyForm,
  createField,
  type FieldType,
  type FormField,
  type FormSchema,
} from "@/lib/form-schema";
import { createJSONStorage, persist } from "zustand/middleware";

interface FormState {
  form: FormSchema;
  selectedId: string | null;

  setTitle: (title: string) => void;
  addField: (type: FieldType, index?: number) => void;
  updateField: (id: string, patch: Partial<FormField>) => void;
  removeField: (id: string) => void;
  moveField: (from: number, to: number) => void;
  selectField: (id: string | null) => void;
}

export const useFormStore = create<FormState>()(
    persist(
        (set) => ({
            form: createEmptyForm(),
            selectedId: null,

            setTitle: (title) => set((s) => ({ form: { ...s.form, title } })),

            addField: (type, index) =>
                set((s) => {
                const field = createField(type);
                const fields = [...s.form.fields];
                fields.splice(index ?? fields.length, 0, field);
                return { form: { ...s.form, fields }, selectedId: field.id };
                }),

            updateField: (id, patch) =>
                set((s) => ({
                form: {
                    ...s.form,
                    fields: s.form.fields.map((f) =>
                    f.id === id ? { ...f, ...patch } : f
                    ),
                },
                })),

            removeField: (id) =>
                set((s) => ({
                form: { ...s.form, fields: s.form.fields.filter((f) => f.id !== id) },
                selectedId: s.selectedId === id ? null : s.selectedId,
                })),

            moveField: (from, to) =>
                set((s) => {
                const fields = [...s.form.fields];
                const [moved] = fields.splice(from, 1);
                fields.splice(to, 0, moved);
                return { form: { ...s.form, fields } };
                }),

            selectField: (id) => set({ selectedId: id }),
            }),
        {
            name: "hyperion-form-builder",
            storage: createJSONStorage(() => localStorage),
            partialize: (s) => ({ form: s.form }),
            skipHydration: true,
        }
    )
);