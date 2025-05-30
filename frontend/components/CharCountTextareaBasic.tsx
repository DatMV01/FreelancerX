import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CharCountTextareaBasicProps {
  label?: string;
  maxLength?: number;
  placeholder?: string;
  rows?: number;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
}

export function CharCountTextareaBasic({
  label,
  maxLength = 500,
  placeholder,
  rows = 4,
  className,
  value = "",
  onChange,
  onKeyDown,
}: CharCountTextareaBasicProps) {
  const [text, setText] = useState(value);
  const [charCount, setCharCount] = useState(value.length);

  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    setCharCount(val.length);
    onChange?.(val.trim());
  };

  return (
    <div>
      {label && (
        <label className="mb-1 block text-sm font-medium">{label}</label>
      )}
      <div className="relative overflow-hidden">
        <Textarea
          value={text}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
          className={cn(
            "focus-visible:ring-ring focus-visible:ring-1",
            "focus-visible:ring-offset-1 focus-visible:outline-none",
            "border-input",
            className,
          )}
        />
        <span className="text-muted-foreground absolute right-2 bottom-1 text-xs">
          {charCount}/{maxLength}
        </span>
      </div>
    </div>
  );
}
