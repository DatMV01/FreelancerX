import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

type InputNumberFieldProps = {
  name: string;
  label?: string;
  placeholder?: string;
  form: UseFormReturn<any>;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
};

export default function InputNumberField({
  name,
  label,
  placeholder,
  form,
  className,
  min,
  max,
  step = 1,
}: InputNumberFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              type="number"
              placeholder={placeholder}
              {...field}
              value={field.value ?? ""}
              min={min}
              max={max}
              step={step}
              onChange={(e) => {
                const val = e.target.value;
                const numVal = val === "" ? "" : Number(val);
                field.onChange(numVal);
              }}
              className={cn(
                "focus-visible:ring-ring focus-visible:ring-1",
                "focus-visible:ring-offset-1 focus-visible:outline-none",
                className,
                fieldState.invalid
                  ? "!border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-0"
                  : "border-input",
              )}
            />
          </FormControl>
          {/* <FormMessage /> */}
          {fieldState.error && (
            <p className="text-red-500">{fieldState.error.message}</p>
          )}
        </FormItem>
      )}
    />
  );
}
