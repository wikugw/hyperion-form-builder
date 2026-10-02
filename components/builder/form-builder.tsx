"use client";

import { useEffect, useState } from "react";
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
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormRenderer } from "@/components/form/form-renderer";
import { FIELD_META, type FieldType } from "@/lib/form-schema";
import { useFormStore } from "@/lib/form-store";
import { Canvas } from "./canvas";
import { FieldPalette } from "./field-palette";
import { PropertiesPanel } from "./properties-panel";

function exportJson() {
  const { form } = useFormStore.getState();
  const blob = new Blob([JSON.stringify(form, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${form.title.trim().toLowerCase().replace(/\s+/g, "-") || "form"}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function FormBuilder() {
  const [activeType, setActiveType] = useState<FieldType | null>(null);
  const form = useFormStore((s) => s.form);

  // pasangan dengan skipHydration di store (bagian 7)
  useEffect(() => {
    useFormStore.persist.rehydrate();
  }, []);

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

    if (data?.source === "palette") {
      const overIndex = form.fields.findIndex((f) => f.id === over.id);
      addField(data.type as FieldType, overIndex === -1 ? undefined : overIndex);
      return;
    }

    if (active.id !== over.id) {
      const from = form.fields.findIndex((f) => f.id === active.id);
      const to = form.fields.findIndex((f) => f.id === over.id);
      if (from !== -1 && to !== -1) moveField(from, to);
    }
  }

  return (
    <Tabs defaultValue="builder" className="h-screen gap-0">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <TabsList>
          <TabsTrigger value="builder">Builder</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <Button variant="outline" size="sm" onClick={exportJson}>
          <Download className="mr-1 size-4" /> Export JSON
        </Button>
      </header>

      <TabsContent value="builder" className="min-h-0 flex-1">
        <DndContext
          id="form-builder-dnd"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveType(null)}
        >
          <div className="flex h-full">
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
      </TabsContent>

      <TabsContent value="preview" className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl p-8">
          <FormRenderer schema={form} />
        </div>
      </TabsContent>
    </Tabs>
  );
}