"use client";

import { Canvas } from "./canvas";
import { FieldPalette } from "./field-palette";
import { PropertiesPanel } from "./properties-panel";

export function FormBuilder() {
  return (
    <div className="flex h-screen">
      <FieldPalette />
      <Canvas />
      <PropertiesPanel />
    </div>
  );
}