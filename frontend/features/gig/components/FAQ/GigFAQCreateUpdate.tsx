import ButtonGreenBorder from "@/components/ButtonGreenBorder";
import { CharCountTextarea } from "@/components/CharCountTextarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export const faqSchema = z.object({
  id: z.string().uuid(),
  question: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(150, "Maximum 150 characters"),
  answer: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(300, "Maximum 300 characters"),
});

export type FAQType = z.infer<typeof faqSchema>;

export interface FAQCreateUpdateProps {
  faq?: FAQType;
  onCreate?: (faq: FAQType) => void;
  onUpdate?: (faq: FAQType) => void;
}

const GigFAQCreateUpdate = ({
  faq,
  onCreate,
  onUpdate,
}: FAQCreateUpdateProps) => {
  const form = useForm<FAQType>({
    resolver: zodResolver(faqSchema),
    mode: "onChange",
    defaultValues: { id: uuidv4(), question: "", answer: "" },
  });

  const { reset, watch, getFieldState } = form;

  const isInvalid = !form.formState.isValid;

  useEffect(() => {
    if (faq) reset(faq);
  }, [faq, reset]);

  const handleSubmit = (action: "create" | "update") => {
    if (isInvalid) return;

    const values = watch();
    action === "create" ? onCreate?.(values) : onUpdate?.(values);

    reset({
      id: uuidv4(),
      question: "",
      answer: "",
    });
  };

  const preventEnterSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="mb-2 flex flex-col gap-2 rounded-lg border bg-white p-3 shadow-sm">
      <CharCountTextarea
        form={form}
        name="question"
        placeholder="Describe your question"
        maxLength={150}
        className="h-[50px]"
        onKeyDown={preventEnterSubmit}
      />

      <CharCountTextarea
        form={form}
        name="answer"
        placeholder="Describe your answer"
        maxLength={300}
        className="h-[100px]"
        onKeyDown={(e) => {
          preventEnterSubmit(e);
          if (e.key === "Enter") {
            if (onUpdate) handleSubmit("update");
            if (onCreate) handleSubmit("create");
          }
        }}
      />

      <div className="flex justify-end">
        {onUpdate && (
          <ButtonGreenBorder
            disabled={isInvalid}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit("update");
            }}
          >
            Update FAQ
          </ButtonGreenBorder>
        )}
        {onCreate && (
          <ButtonGreenBorder
            disabled={isInvalid}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit("create");
            }}
          >
            Add FAQ
          </ButtonGreenBorder>
        )}
      </div>
    </div>
  );
};

export default GigFAQCreateUpdate;
