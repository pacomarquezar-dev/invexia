"use client";

import type { ChangeEvent, FocusEvent } from "react";

interface NumberFieldProps {
  id: string;
  name: string;
  label: string;
  value: number;
  onChange: (rawValue: string) => void;
  min?: number;
  max?: number;
  step?: number;
  inputMode?: "decimal" | "numeric";
}

export default function NumberField({
  id,
  name,
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  inputMode = "decimal",
}: NumberFieldProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    event.target.select();
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="number"
        min={min}
        max={max}
        step={step}
        inputMode={inputMode}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        className="rounded-md border border-foreground/20 bg-transparent px-3 py-2"
      />
    </div>
  );
}
