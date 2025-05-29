import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { forwardRef, useEffect, useState } from "react";
import { useWatch } from "react-hook-form";

type CharCountInputProps = {
  name: string;
  label?: string;
  maxLength?: number;
  placeholder?: string;
  form: any;
  className?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

export function CharCountInput({
  name,
  label,
  maxLength = 500,
  placeholder,
  form,
  className,
  onKeyDown,
}: CharCountInputProps) {
  const value = useWatch({ control: form.control, name });
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount((value || "").length);
  }, [value]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="relative overflow-hidden">
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder={placeholder}
                maxLength={maxLength}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val);
                }}
                onKeyDown={onKeyDown}
                className={cn(
                  "focus-visible:ring-ring focus-visible:ring-1",
                  "focus-visible:ring-offset-1 focus-visible:outline-none",
                  className,
                  fieldState.invalid
                    ? "!border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-0"
                    : "border-input",
                )}
              />
              <span className="text-muted-foreground absolute right-2 bottom-1 text-xs">
                {charCount}/{maxLength}
              </span>
            </div>
          </FormControl>
          {fieldState.error && (
            <p className="text-red-500">{fieldState.error.message}</p>
          )}
        </FormItem>
      )}
    />
  );
}

export const CharCountInputRef = forwardRef<
  HTMLInputElement,
  CharCountInputProps
>(
  (
    { name, label, maxLength = 500, placeholder, form, className, onKeyDown },
    ref,
  ) => {
    const value = useWatch({ control: form.control, name });
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
      setCharCount((value || "").length);
    }, [value]);

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="relative overflow-hidden">
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                  }}
                  onKeyDown={onKeyDown}
                  ref={ref}
                  className={cn(
                    "focus-visible:ring-ring focus-visible:ring-1",
                    "focus-visible:ring-offset-1 focus-visible:outline-none",
                    className,
                    fieldState.invalid
                      ? "!border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-0"
                      : "border-input",
                  )}
                />
                <span className="text-muted-foreground absolute right-2 bottom-1 text-xs">
                  {charCount}/{maxLength}
                </span>
              </div>
            </FormControl>
            {fieldState.error && (
              <p className="text-red-500">{fieldState.error.message}</p>
            )}
          </FormItem>
        )}
      />
    );
  },
);
