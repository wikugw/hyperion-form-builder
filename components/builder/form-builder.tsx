"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { FIELD_META, type FieldType } from "@/lib/form-schema";
import { useFormStore } from "@/lib/form-store";
import { Canvas } from "./canvas";
import { FieldPalette } from "./field-palette";
import { PropertiesPanel } from "./properties-panel";

export function FormBuilder() {
  const [activeType, setActiveType] = useState<FieldType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart({ active }: DragStartEvent) {
    const data = active.data.current;
    if (data?.source === "palette") setActiveType(data.type as FieldType);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveType(null);
    if (!over) return;

    const { form, addField, moveField } = useFormStore.getState();
    const data = active.data.current;

    // 1) drag dari palette -> sisipkan ke canvas
    if (data?.source === "palette") {
      const overIndex = form.fields.findIndex((f) => f.id === over.id);
      addField(data.type as FieldType, overIndex === -1 ? undefined : overIndex);
      return;
    }

    // 2) drag field di canvas -> urutkan ulang
    if (active.id !== over.id) {
      const from = form.fields.findIndex((f) => f.id === active.id);
      const to = form.fields.findIndex((f) => f.id === over.id);
      if (from !== -1 && to !== -1) moveField(from, to);
    }
  }

  return (
    <DndContext
      id="form-builder-dnd"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveType(null)}
    >
      <div className="flex h-screen">
        <FieldPalette />
        <Canvas />
        <PropertiesPanel />
      </div>

      <DragOverlay>
        {activeType ? (
          <div className="rounded-md border bg-background px-4 py-2 text-sm shadow-lg">
            {FIELD_META[activeType].label}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}