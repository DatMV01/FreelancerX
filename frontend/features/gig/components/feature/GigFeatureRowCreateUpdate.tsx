import ButtonGreenBorder from "@/components/ButtonGreenBorder";
import {
  CharCountTextarea,
  CharCountTextareaRef,
} from "@/components/CharCountTextarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, PlusCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { FeatureRow } from "../GigPricingInput";

export const featureRowSchema = z.object({
  id: z.string().uuid(),
  feature: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(100, "Maximum 100 characters"),
  basic: z
    .string()
    //.min(3, "Minimum 3 characters")
    .max(100, "Maximum 100 characters"),
  standard: z
    .string()
    //.min(3, "Minimum 3 characters")
    .max(100, "Maximum 100 characters"),
  premium: z
    .string()
    //.min(3, "Minimum 3 characters")
    .max(100, "Maximum 100 characters"),
  isRequired: z.boolean(),
});

export type FeatureRowType = z.infer<typeof featureRowSchema>;

interface FeatureRowCreateUpdateProps {
  index?: number;
  feature?: FeatureRowType;
  onCreate?: (feature: FeatureRowType) => void;
  onUpdate?: (feature: FeatureRowType) => void;
}

export const GigFeatureRowCreateUpdate = ({
  index,
  feature,
  onCreate,
  onUpdate,
}: FeatureRowCreateUpdateProps) => {
  const form = useForm<FeatureRowType>({
    resolver: zodResolver(featureRowSchema),
    mode: "onChange",
    defaultValues: {
      id: uuidv4(),
      feature: "",
      basic: "",
      standard: "",
      premium: "",
      isRequired: false,
    },
  });

  const { reset, watch, getFieldState } = form;
  const isInvalid = !form.formState.isValid;
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (feature) reset(feature);
  }, [feature, reset]);

  const handleSubmit = (action: "create" | "update") => {
    if (!form.formState.isValid) {
      return;
    }

    const values = watch();
    action === "create" ? onCreate?.(values) : onUpdate?.(values);

    form.reset({
      id: uuidv4(),
      feature: "",
      basic: "",
      standard: "",
      premium: "",
      isRequired: false,
    });

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const preventEnterSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <FeatureRow
      noColumn={<span>{index ? index + 1 : ""}</span>}
      featureColumn={
        <CharCountTextareaRef
          ref={inputRef}
          form={form}
          name="feature"
          placeholder="Feature title"
          maxLength={100}
          className="h-[80px]"
          onKeyDown={preventEnterSubmit}
        />
      }
      basicColumn={
        <CharCountTextarea
          form={form}
          name={`basic`}
          placeholder="Describe your basic feature"
          maxLength={100}
          className="h-[80px]"
          onKeyDown={(e) => {
            preventEnterSubmit(e);
            if (e.key === "Enter") {
              if (onUpdate) handleSubmit("update");
              if (onCreate) handleSubmit("create");
            }
          }}
        />
      }
      standardColumn={
        <CharCountTextarea
          form={form}
          name={`standard`}
          placeholder="Describe your standard feature"
          maxLength={100}
          className="h-[80px]"
          onKeyDown={(e) => {
            preventEnterSubmit(e);
            if (e.key === "Enter") {
              if (onUpdate) handleSubmit("update");
              if (onCreate) handleSubmit("create");
            }
          }}
        />
      }
      premiumColumn={
        <CharCountTextarea
          form={form}
          name={`premium`}
          placeholder="Describe your premium feature"
          maxLength={100}
          className="h-[80px]"
          onKeyDown={(e) => {
            preventEnterSubmit(e);
            if (e.key === "Enter") {
              if (onUpdate) handleSubmit("update");
              if (onCreate) handleSubmit("create");
            }
          }}
        />
      }
      actionColumn={
        <>
          {onUpdate && (
            <ButtonGreenBorder
              disabled={isInvalid}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit("update");
              }}
            >
              <Check
                className="text-green-500 hover:text-green-700"
                size={16}
              />
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
              <PlusCircle
                className="text-green-500 hover:text-green-700"
                size={16}
              />
            </ButtonGreenBorder>
          )}
        </>
      }
    />
  );
};
