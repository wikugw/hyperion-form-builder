"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FIELD_META, type FormField } from "@/lib/form-schema";
import { useFormStore } from "@/lib/form-store";
import { FieldInput } from "@/components/form/field-input";

export function SortableField({ field }: { field: FormField }) {
  const selected = useFormStore((s) => s.selectedId === field.id);
  const selectField = useFormStore((s) => s.selectField);
  const removeField = useFormStore((s) => s.removeField);

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        selectField(field.id);
      }}
      className={cn(
        "relative cursor-pointer rounded-lg border bg-background p-4",
        selected && "ring-2 ring-primary",
        isDragging && "z-10 opacity-60 shadow-lg"
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
            aria-label="Geser untuk mengurutkan"
          >
            <GripVertical className="size-4" />
          </button>
          <Label>
            {field.label}
            {field.required && <span className="ml-1 text-destructive">*</span>}
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {FIELD_META[field.type].label}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={(e) => {
              e.stopPropagation();
              removeField(field.id);
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="pointer-events-none">
        <FieldInput field={field} id={`preview-${field.id}`} disabled />
      </div>
    </div>
  );
}