"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormStore } from "@/lib/form-store";

export function PropertiesPanel() {
  const field = useFormStore((s) =>
    s.form.fields.find((f) => f.id === s.selectedId)
  );
  const updateField = useFormStore((s) => s.updateField);

  if (!field) {
    return (
      <aside className="w-72 shrink-0 border-l p-4 text-sm text-muted-foreground">
        Pilih sebuah field untuk mengedit propertinya
      </aside>
    );
  }

  const options = field.options ?? [];

  return (
    <aside className="w-72 shrink-0 space-y-4 overflow-y-auto border-l p-4">
      <h2 className="text-sm font-semibold">Properti</h2>

      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          value={field.label}
          onChange={(e) => updateField(field.id, { label: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name (key data)</Label>
        <Input
          id="name"
          value={field.name}
          onChange={(e) => updateField(field.id, { name: e.target.value })}
        />
      </div>

      {field.type !== "checkbox" && field.type !== "select" && (
        <div className="space-y-2">
          <Label htmlFor="placeholder">Placeholder</Label>
          <Input
            id="placeholder"
            value={field.placeholder ?? ""}
            onChange={(e) =>
              updateField(field.id, { placeholder: e.target.value })
            }
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <Checkbox
          id="required"
          checked={field.required}
          onCheckedChange={(v) =>
            updateField(field.id, { required: v === true })
          }
        />
        <Label htmlFor="required">Wajib diisi</Label>
      </div>

      {field.type === "select" && (
        <div className="space-y-2">
          <Label>Opsi</Label>
          {options.map((opt, i) => (
            <div key={opt.id} className="flex gap-2">
              <Input
                value={opt.label}
                onChange={(e) => {
                  const next = [...options];
                  next[i] = {
                    ...opt,
                    label: e.target.value,
                    value: e.target.value.toLowerCase().replace(/\s+/g, "_"),
                  };
                  updateField(field.id, { options: next });
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  updateField(field.id, {
                    options: options.filter((o) => o.id !== opt.id),
                  })
                }
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateField(field.id, {
                options: [
                  ...options,
                  {
                    id: crypto.randomUUID(),
                    label: `Opsi ${options.length + 1}`,
                    value: `opsi_${options.length + 1}`,
                  },
                ],
              })
            }
          >
            <Plus className="mr-1 size-4" /> Tambah opsi
          </Button>
        </div>
      )}
    </aside>
  );
}
