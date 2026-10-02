"use client";

import { useMemo, useState } from "react";
import {
  Controller,
  useForm,
  type FieldValues,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { buildZodSchema, getDefaultValues } from "@/lib/build-zod";
import type { FormSchema } from "@/lib/form-schema";
import { FieldInput } from "./field-input";

export function FormRenderer({ schema }: { schema: FormSchema }) {
  const [submitted, setSubmitted] = useState<FieldValues | null>(null);

  const zodSchema = useMemo(
    () => buildZodSchema(schema.fields),
    [schema.fields]
  );
  const defaultValues = useMemo(
    () => getDefaultValues(schema.fields),
    [schema.fields]
  );

  const { control, handleSubmit, reset } = useForm<FieldValues>({
    resolver: zodResolver(zodSchema) as Resolver<FieldValues>,
    defaultValues,
  });

  if (schema.fields.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Belum ada field. Tambahkan dulu di tab Builder.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{schema.title}</h1>

      <form
        onSubmit={handleSubmit((data) => setSubmitted(data))}
        className="space-y-5"
        noValidate
      >
        {schema.fields.map((field) => (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            render={({ field: rhf, fieldState }) => {
              const id = `field-${field.id}`;
              const isCheckbox = field.type === "checkbox";

              const input = (
                <FieldInput
                  field={field}
                  id={id}
                  value={rhf.value}
                  onChange={rhf.onChange}
                  onBlur={rhf.onBlur}
                  invalid={!!fieldState.error}
                />
              );

              const label = (
                <Label htmlFor={id}>
                  {field.label}
                  {field.required && (
                    <span className="ml-1 text-destructive">*</span>
                  )}
                </Label>
              );

              return (
                <div className="space-y-2">
                  {isCheckbox ? (
                    <div className="flex items-center gap-2">
                      {input}
                      {label}
                    </div>
                  ) : (
                    <>
                      {label}
                      {input}
                    </>
                  )}
                  {fieldState.error && (
                    <p className="text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              );
            }}
          />
        ))}

        <div className="flex gap-2">
          <Button type="submit">Kirim</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset(defaultValues);
              setSubmitted(null);
            }}
          >
            Reset
          </Button>
        </div>
      </form>

      {submitted && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold">Data terkirim</h2>
          <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}