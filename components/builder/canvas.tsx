"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FIELD_META } from "@/lib/form-schema";
import { useFormStore } from "@/lib/form-store";

export function Canvas() {
  const form = useFormStore((s) => s.form);
  const selectedId = useFormStore((s) => s.selectedId);
  const setTitle = useFormStore((s) => s.setTitle);
  const selectField = useFormStore((s) => s.selectField);
  const removeField = useFormStore((s) => s.removeField);

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

        {form.fields.length === 0 && (
          <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
            Klik komponen di kiri untuk menambahkan field
          </div>
        )}

        {form.fields.map((field) => (
          <div
            key={field.id}
            onClick={(e) => {
              e.stopPropagation();
              selectField(field.id);
            }}
            className={cn(
              "group relative cursor-pointer rounded-lg border bg-background p-4",
              selectedId === field.id && "ring-2 ring-primary"
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <Label>
                {field.label}
                {field.required && (
                  <span className="ml-1 text-destructive">*</span>
                )}
              </Label>
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

            {/* preview non-interaktif; renderer asli dibuat di step 7 */}
            <div className="pointer-events-none">
              <Input disabled placeholder={field.placeholder} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}