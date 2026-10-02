"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useFormStore } from "@/lib/form-store";
import { SortableField } from "./sortable-field";

export const CANVAS_DROPPABLE_ID = "canvas";

export function Canvas() {
  const form = useFormStore((s) => s.form);
  const setTitle = useFormStore((s) => s.setTitle);
  const selectField = useFormStore((s) => s.selectField);

  const { setNodeRef, isOver } = useDroppable({ id: CANVAS_DROPPABLE_ID });

  return (
    <main
      className="flex-1 overflow-y-auto bg-muted/30 p-8"
      onClick={() => selectField(null)}
    >
      <div className="mx-auto max-w-2xl space-y-4">
        <Input
          value={form.title}
          onChange={(e) => setTitle(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="h-12 bg-background text-xl font-semibold"
        />

        <div ref={setNodeRef} className="min-h-[60vh] space-y-4">
          <SortableContext
            items={form.fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            {form.fields.map((field) => (
              <SortableField key={field.id} field={field} />
            ))}
          </SortableContext>

          {form.fields.length === 0 && (
            <div
              className={cn(
                "rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground transition-colors",
                isOver && "border-primary bg-primary/5"
              )}
            >
              Tarik atau klik komponen di kiri untuk menambahkan field
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
