"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormStore } from "@/lib/form-store";

type Status = "idle" | "saving" | "saved" | "error";

const LABEL: Record<Status, string> = {
  idle: "Simpan",
  saving: "Menyimpan...",
  saved: "Tersimpan",
  error: "Gagal, coba lagi",
};

export function SaveButton() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSave() {
    setStatus("saving");
    try {
      const { form } = useFormStore.getState();
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("saved");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <Button size="sm" onClick={handleSave} disabled={status === "saving"}>
      <Save className="mr-1 size-4" /> {LABEL[status]}
    </Button>
  );
}