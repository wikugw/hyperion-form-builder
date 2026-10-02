"use client";

import { Button } from "@/components/ui/button";
import { FIELD_META, FIELD_TYPES } from "@/lib/form-schema";
import { useFormStore } from "@/lib/form-store";

export function FieldPalette() {
  const addField = useFormStore((s) => s.addField);

  return (
    <aside className="w-60 shrink-0 border-r p-4">
      <h2 className="mb-3 text-sm font-semibold">Komponen</h2>
      <div className="flex flex-col gap-2">
        {FIELD_TYPES.map((type) => (
          <Button
            key={type}
            variant="outline"
            className="justify-start"
            onClick={() => addField(type)}
          >
            {FIELD_META[type].label}
          </Button>
        ))}
      </div>
    </aside>
  );
}