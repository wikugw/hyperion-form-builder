"use client";

import { useDraggable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FIELD_META, FIELD_TYPES, type FieldType } from "@/lib/form-schema";
import { useFormStore } from "@/lib/form-store";

function PaletteItem({ type }: { type: FieldType }) {
  const addField = useFormStore((s) => s.addField);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { source: "palette", type },
  });

  return (
    <Button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      variant="outline"
      className={cn(
        "cursor-grab touch-none justify-start",
        isDragging && "opacity-50"
      )}
      onClick={() => addField(type)}
    >
      {FIELD_META[type].label}
    </Button>
  );
}

export function FieldPalette() {
  return (
    <aside className="w-60 shrink-0 border-r p-4">
      <h2 className="mb-3 text-sm font-semibold">Komponen</h2>
      <div className="flex flex-col gap-2">
        {FIELD_TYPES.map((type) => (
          <PaletteItem key={type} type={type} />
        ))}
      </div>
    </aside>
  );
}