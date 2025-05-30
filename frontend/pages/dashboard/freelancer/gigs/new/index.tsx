"use client";

import { CharCountTextarea } from "@/components/CharCountTextarea";
import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, Category } from "@/data/categories";
import { DashboardMainContent } from "@/features/dashboard/components/DashboardMainContent";
import { FeatureRowType } from "@/features/gig/components/feature/GigFeatureRowCreateUpdate";
import GigAddSearchTag from "@/features/gig/components/GigAddSearchTag";
import { uploadFile } from "@/features/files/file.api";
import { faqSchema } from "@/features/gig/components/FAQ/GigFAQCreateUpdate";
import GigFAQsInput from "@/features/gig/components/FAQ/GigFAQsInput";
import {
  FileChangesDetectedType,
  FileListManager,
  FileSlot,
  fileSlotKeys,
  fillMissingFileSlots,
} from "@/features/gig/components/FileListManager";
import GigPricingInput from "@/features/gig/components/GigPricingInput";
import { createGig } from "@/features/gig/gig.api";
import { GigStatus, GigTagEntity } from "@/features/gig/gig.types";
import { useCountdownRedirect } from "@/hooks/useCountdownRedirect";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { CircleArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useRef, useState } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const CkEditorWithNoSSR2 = dynamic(
  () => import("@/components/ckeditor2/CkEditorWithNoSSR2"),
  {
    ssr: false,
  },
);

/* ======================== */

export const GigPackageTypeEnum = z.enum(["basic", "standard", "premium"]);

export const PackageFeatureSchema = z.object({
  name: z.string().min(1, "Name is required"),
  value: z.string(),
});

export const GigPackagesSchema = z.object({
  id: z.string().uuid(),
  gigId: z.string().uuid().optional(),
  type: GigPackageTypeEnum,
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  deliveryTime: z.number().int().positive("Delivery days must be positive"),
  revisions: z.number().int().nonnegative("Revisions must be non-negative"),
  features: z.array(PackageFeatureSchema).optional(),
});

const ThreeGigPackagesSchema = z.array(GigPackagesSchema);
/* ======================== */

export const positiveNumberSchema = (msg: string) =>
  z.number().int().positive(msg);

export const featureSchema = z.object({
  id: z.string(),
  feature: z.string().min(3, "Minimum 3 characters"),
  basic: z.string().optional(),
  standard: z.string().optional(),
  premium: z.string().optional(),
  isRequired: z.boolean(),
});

export const titleSchema = featureSchema.extend({
  basic: z
    .string()
    .nonempty("Basic title is required")
    .max(150, "Maximum 150 characters"),
  standard: z
    .string()
    .nonempty("Standard title is required")
    .max(150, "Maximum 150 characters"),
  premium: z
    .string()
    .nonempty("Premium title is required")
    .max(150, "Maximum 150 characters"),
});

export const descriptionSchema = featureSchema.extend({
  basic: z
    .string()
    .nonempty("Basic description is required")
    .max(300, "Maximum 300 characters"),
  standard: z
    .string()
    .nonempty("Standard description is required")
    .max(300, "Maximum 300 characters"),
  premium: z
    .string()
    .nonempty("Premium description is required")
    .max(300, "Maximum 300 characters"),
});

export const deliveryDaysSchema = featureSchema.extend({
  basic: positiveNumberSchema("Delivery days must be positive").max(
    1000,
    "Maximum 1000 days",
  ),
  standard: positiveNumberSchema("Delivery days must be positive").max(
    1000,
    "Maximum 1000 days",
  ),
  premium: positiveNumberSchema("Delivery days must be positive").max(
    1000,
    "Maximum 1000 days",
  ),
});

export const revisionsSchema = featureSchema.extend({
  basic: positiveNumberSchema("Revisions days must be positive").max(
    10,
    "Maximum 10 revisions",
  ),
  standard: positiveNumberSchema("Revisions days must be positive").max(
    10,
    "Maximum 10 revisions",
  ),
  premium: positiveNumberSchema("Revisions days must be positive").max(
    10,
    "Maximum 10 revisions",
  ),
});

export const priceSchema = featureSchema.extend({
  basic: z
    .number()
    .int()
    .min(50, "Price must be greater than or equal to 50")
    .max(10000, "Maximum price is 10,0000 USD"),
  standard: z
    .number()
    .int()
    .min(50, "Price must be greater than or equal to 50")
    .max(10000, "Maximum price is 10,0000 USD"),
  premium: z
    .number()
    .int()
    .min(50, "Price must be greater than or equal to 50")
    .max(10000, "Maximum price is 10,0000 USD"),
});

/**================================== */

export const createFileOrInfoSchema = (allowNull: boolean) =>
  z.any().superRefine((val, ctx) => {
    if (val === null) {
      if (!allowNull) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please upload a file.",
        });
      }
      return;
    }

    const isFile = typeof File !== "undefined" && val instanceof File;
    const isFileInfo =
      typeof val === "object" &&
      val !== null &&
      "id" in val &&
      "url" in val &&
      "mimeType" in val &&
      "provider" in val;

    if (!isFile && !isFileInfo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid file type. Please upload a valid file.",
      });
    }
  });

const gallerySchame = fileSlotKeys.reduce(
  (acc, key) => {
    const fieldSchema =
      key === "thumbnail"
        ? createFileOrInfoSchema(false)
        : createFileOrInfoSchema(true);

    acc[key] = fieldSchema;
    return acc;
  },
  {} as Record<FileSlot, z.ZodTypeAny>,
);

const featuresSchema = z.array(z.any()).superRefine((items, ctx) => {
  items.forEach((item: FeatureRowType, index) => {
    let result;
    //console.log("Validating feature at index:", index, item);

    if (item.feature === "Title") {
      result = titleSchema.safeParse(item);
    } else if (item.feature === "Description") {
      result = descriptionSchema.safeParse(item);
    } else if (item.feature === "Delivery") {
      result = deliveryDaysSchema.safeParse(item);
    } else if (item.feature === "Revisions") {
      result = revisionsSchema.safeParse(item);
    } else if (item.feature === "Price") {
      result = priceSchema.safeParse(item);
    } else {
      result = featureSchema.safeParse(item); // fallback
    }

    if (!result.success) {
      result.error.errors.forEach((e) =>
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: e.message,
          path: [index, ...e.path],
        }),
      );
    }
  });
});

export const descriptionGigSchema = z
  .string()
  .min(1, "Content is required")
  .refine(
    (value) => {
      const plainText = value.replace(/<[^>]*>/g, "").trim();
      return plainText.length > 0;
    },
    { message: "Content must include visible characters" },
  )
  .refine(
    (value) => {
      const plainText = value
        .replaceAll(/<[^>]*>/g, "")
        .replaceAll(/&nbsp;/g, " ");

      return plainText.length <= 5000;
    },
    { message: "Maximum 5000 characters" },
  );

const gigSchema = z.object({
  title: z
    .string()
    .nonempty("Title is required")
    .min(20, "Minimum 20 characters")
    .max(300, "Maximum 300 characters"),
  categoryId: z.string().uuid(),
  category: z.any().optional(),
  subCategoryId: z.string().uuid(),
  subCategory: z.any().optional(),
  nestedSubcategoryId: z.string().uuid(),
  nestedSubcategory: z.any().optional(),
  tags: z
    .array(
      z.object({
        id: z.string().uuid(),
        keyword: z.string().min(1, "Tag is required"),
        searchCount: z.number().optional(),
        createdAt: z.date().optional(),
      }),
    )
    .min(1, "Minimum 1 tags")
    .max(5, "Maximum 5 tags"),
  packages: ThreeGigPackagesSchema.optional(),
  features: featuresSchema,
  description: descriptionGigSchema,

  faqs: z.array(faqSchema).optional(),
  thumbnail: z.any().optional(),
  medias: z.object(gallerySchame),
  status: z
    .enum([
      GigStatus.ACTIVE,
      GigStatus.DRAFT,
      GigStatus.PAUSED,
      GigStatus.REJECTED,
    ])
    .default(GigStatus.DRAFT),
});

export type GigForm = z.infer<typeof gigSchema>;

const GigOverviewSection = ({ form }: { form: UseFormReturn<GigForm> }) => {
  return (
    <div className="flex flex-col">
      <label className="font-semibold text-gray-700">Gig title</label>

      <div className="flex gap-x-2">
        <div className="w-3/12">
          <p className="text-sm text-gray-500">
            As your Gig storefront, your&nbsp;
            <strong>title is the most important place</strong> to include
            keywords that buyers would likely use.
          </p>
        </div>

        <div className="w-9/12">
          <CharCountTextarea
            name="title"
            maxLength={150}
            placeholder="I will do something I'm really good at"
            form={form}
            rows={5}
          />
        </div>
      </div>
    </div>
  );
};

const GigCategorySection = ({ form }: { form: UseFormReturn<GigForm> }) => {
  const [filterSubCategory, setFilterSubCategory] = useState<Category[]>([]);
  const [filterNestedSubCategory, setFilterNestedSubCategory] = useState<
    Category[]
  >([]);

  const categoryId = form.watch("categoryId");
  useEffect(() => {
    if (!categoryId || categoryId === "") return;
    form.setValue("subCategoryId", "");
    form.setValue("nestedSubcategoryId", "");
    const result = categories.filter((_) => _.parentId === categoryId);

    setFilterSubCategory(result);
  }, [categoryId]);

  const subCategoryId = form.watch("subCategoryId");
  useEffect(() => {
    if (!subCategoryId || subCategoryId === "") return;
    form.setValue("nestedSubcategoryId", "");

    const result = categories.filter((_) => _.parentId === subCategoryId);
    setFilterNestedSubCategory(result);
  }, [subCategoryId]);

  return (
    <div className="flex flex-col">
      <label className="font-semibold text-gray-700">Category</label>

      <div className="flex gap-x-2">
        <div className="w-3/12">
          <p className="text-sm text-gray-500">
            Choose the category and sub-category most suitable for your Gig.
          </p>
        </div>

        <div className="flex w-9/12 gap-x-4">
          <div className="w-1/3 overflow-hidden">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose one" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        key={`3f1c9d2e-7b5a-4a8d-9e1c-2b7a1e5d3c4f`}
                        value={`3f1c9d2e-7b5a-4a8d-9e1c-2b7a1e5d3c4f`}
                      >
                        Programming & Tech
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-1/3 overflow-hidden">
            <FormField
              control={form.control}
              name="subCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose one" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filterSubCategory.map((_) => (
                        <SelectItem key={_.id} value={_.id}>
                          {_.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-1/3 overflow-hidden">
            <FormField
              control={form.control}
              name="nestedSubcategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nested Sub Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose one" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filterNestedSubCategory.map((_) => (
                        <SelectItem key={_.id} value={_.id}>
                          {_.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const GigAddTagsSection = ({ form }: { form: UseFormReturn<GigForm> }) => {
  const { fields, append, update, remove } = useFieldArray({
    control: form.control,
    name: "tags",
  });
  return (
    <div className="flex flex-col">
      <label className="font-semibold text-gray-700">Search tags</label>

      <div className="flex gap-x-2">
        <div className="w-3/12">
          <p className="text-sm text-gray-500">
            Tag your Gig with buzz words that are relevant to the services you
            offer. Use all 5 tags to get found.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Enter search terms you feel your buyers will use when looking for
            your service.
          </p>
        </div>

        <div className="w-9/12">
          <div className="flex gap-x-4">
            <div className="w-1/2">
              <GigAddSearchTag
                className={clsx(
                  {
                    "disabled pointer-events-none bg-gray-200":
                      form.getValues("tags").length >= 5,
                  },
                  form.getFieldState("tags").invalid
                    ? "border border-red-500"
                    : "",
                )}
                onSetGigTagCb={async (gigTag: GigTagEntity) => {
                  const currentValues = form.getValues("tags");

                  const isTagExist = currentValues.find(
                    (tag) => tag.id === gigTag.id,
                  );

                  if (isTagExist) {
                    toast.info(
                      `Tag ${gigTag.keyword} already exists. Please choose another tag.`,
                    );
                  } else if (currentValues.length >= 5) {
                    toast.error("You can only add a maximum of 5 tags.");
                  } else {
                    append({
                      ...gigTag,
                      createdAt: new Date(gigTag.createdAt as any),
                    });
                  }
                  const result = await form.trigger("tags");
                }}
              />
              <p className="mt-2 text-xs text-gray-400">
                1 tag minmum.5 tags maximum. Use letters and numbers only.
              </p>

              {form.formState.errors.tags && (
                <p className="text-red-500">
                  {form.formState.errors.tags.message}
                </p>
              )}
            </div>

            <div className="w-1/2">
              <div className="mt-2 flex flex-wrap gap-2">
                {form.getValues("tags").map((keyword: GigTagEntity) => (
                  <p
                    key={keyword.id}
                    className="flex items-center rounded-md bg-gray-200 px-2 py-1 text-sm"
                  >
                    <span>{keyword.keyword}</span>
                    <button
                      onClick={async () => {
                        const newTags = form
                          .getValues("tags")
                          .filter((tag) => tag.id !== keyword.id);
                        form.setValue("tags", newTags);

                        const result = await form.trigger("tags");
                      }}
                      className="ml-2 text-gray-600 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function FreelancerCreateGigPage() {
  const form = useForm<GigForm>({
    resolver: zodResolver(gigSchema),
    mode: "onChange",
    defaultValues: {
      features: [
        ...["Title", "Description", "Delivery", "Revisions", "Price"].map(
          (feature) => ({
            id: uuidv4(),
            feature,
            basic: "",
            standard: "",
            premium: "",
            isRequired: true,
          }),
        ),
      ],
      tags: [],
      medias: fillMissingFileSlots({}),
      description: "",
    },
  });

  const router = useRouter();
  const { countdown, isCounting, start } = useCountdownRedirect({ seconds: 5 });

  const [message, setMessage] = useState<{
    type: "success" | "errror";
    message: string;
  }>();

  const { setValue, watch, handleSubmit, formState, trigger } = form;
  const { errors, isSubmitting, isValid } = formState;

  const fileChangesDetectedRef = useRef<FileChangesDetectedType>({} as any);

  console.log("✅ FORM:", watch());
  console.log("✅ ERRROR:", errors);

  const onSubmit = async (values: z.infer<typeof gigSchema>) => {
    values.status = GigStatus.DRAFT;

    console.log("onSubmit called with values:", values);

    for (const [slot, file] of Object.entries(fileChangesDetectedRef.current)) {
      console.log(slot);
      console.log(file);
    }

    for (const [slot, file] of Object.entries(
      fileChangesDetectedRef.current.added,
    )) {
      console.log(slot);
      console.log(file);

      const { success, data, error } = await uploadFile({
        file,
        newFileName: `${Date.now()}`,
      });

      if (success) values.medias[slot as keyof typeof values.medias] = data;
      if (!success) toast.error(error);
    }

    try {
      const response = await createGig(values as any);
      const { slug } = response.data;

      toast.success(`Create a new service successfully!`);
      setMessage({
        type: "success",
        message: `Create a new service successfully!`,
      });

      start(`/gig/${slug}`);

      setTimeout(() => {
        router.replace(
          `/dashboard/freelancer/gigs?page=1&pageSize=10&status=${GigStatus.DRAFT}`,
        );
      }, 7000);
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.error(error.response.data.message);
      }

      setMessage({
        type: "errror",
        message: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <DashboardMainContent>
      <>
        <div
          className={clsx(
            "relative flex items-center justify-center gap-x-2 border border-green-500 p-2",
            "rounded-md text-center text-xl font-bold text-green-500",
          )}
        >
          <p>Create New Gig</p>
          <Button
            variant="outline"
            className="absolute right-4"
            onClick={(e) => {
              e.preventDefault();
              router.replace(
                `/dashboard/freelancer/gigs?page=1&pageSize=10&status=${GigStatus.DRAFT}`,
              );
            }}
          >
            <CircleArrowLeft />
            <span>Back</span>
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="bg-green-200 p-2 text-center font-bold text-green-600">
                OVERVIEW
              </div>

              <GigOverviewSection form={form} />
              <GigCategorySection form={form} />
              <GigAddTagsSection form={form} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-green-200 p-2 text-center font-bold text-green-600">
                PRICING
              </div>

              <GigPricingInput form={form} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-green-200 p-2 text-center font-bold text-green-600">
                DESCRIPTION & FAQ
              </div>
              <div>
                <p className="text-3xl">Description</p>
                <p className="text-sm">Briefly Describe Your Gig</p>
                <p className="text-xs text-gray-500">Maximum 5000 characters</p>
              </div>

              <div className="mx-auto w-full">
                <CkEditorWithNoSSR2 name="description" control={form.control} />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-green-200 p-2 text-center font-bold text-green-600">
                FREQUENTLY ASKED QUESTIONS
              </div>
              <div>
                <p className="text-3xl">Frequently Asked Questions</p>
                <p className="text-sm">
                  Add Questions & Answers for Your Buyers.
                </p>
              </div>

              <GigFAQsInput
                onFAQsCb={(data: any) => {
                  setValue("faqs", data);
                }}
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-green-200 p-2 text-center font-bold text-green-600">
                GALLERY
              </div>

              <div>
                <FileListManager
                  form={form}
                  galleryFiles={form.getValues("medias") || {}}
                  onFileChangesDetected={(changes) => {
                    fileChangesDetectedRef.current = changes;

                    console.log("Added:", fileChangesDetectedRef.current.added);
                    console.log(
                      "Removed:",
                      fileChangesDetectedRef.current.removed,
                    );
                    console.log(
                      "Updated:",
                      fileChangesDetectedRef.current.updated,
                    );
                  }}
                  onFileChangesDetected2={(changes) => {
                    console.log(changes);
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-green-200 p-2 text-center font-bold text-green-600">
                PUBLISH
              </div>
              <div className="flex h-full flex-col items-center justify-center space-y-2">
                <Image src="/gig_publish.svg" alt="" width={500} height={500} />

                <p className="text-xl font-semibold">You're almost there!</p>
                <p className="mt-2 text-gray-600">
                  Let's publish your Gig and get you ready to start selling.
                </p>
                <div className="flex space-x-2">
                  <Button
                    className="flex items-center rounded bg-green-500 p-2 px-2 font-bold text-white hover:bg-green-600"
                    disabled={isSubmitting || !isValid}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      handleSubmit(onSubmit)();
                    }}
                  >
                    {isSubmitting ? "Processing..." : "Save & Preview"}
                  </Button>

                  {/* <Button
                    className="flex items-center rounded bg-green-500 p-2 px-2 font-bold text-white hover:bg-green-600"
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      const isValid = await trigger();
                    }}
                  >
                    Trigger Validate
                  </Button> */}

                  <Button
                    className="flex items-center rounded bg-blue-500 p-2 px-2 font-bold text-white hover:bg-blue-600"
                    disabled={isSubmitting}
                    type="button"
                    onClick={(e) => {
                      // router.replace(
                      //   `/dashboard/freelancer/gigs?page=1&pageSize=10&status=${GigStatus.DRAFT}`,
                      // );

                      router.replace(
                        `/dashboard/freelancer/gigs`,
                      );
                    }}
                  >
                    Back to manage
                  </Button>
                </div>

                <div className="flex flex-col items-center justify-center">
                  {message && (
                    <p
                      className={`mt-2 text-center text-sm ${message.type === "success" ? "text-green-500" : "text-red-500"}`}
                    >
                      {message.message}
                    </p>
                  )}

                  {isCounting && (
                    <p className="text-center text-sm text-gray-600">
                      Redirecting in {countdown} seconds...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </Form>
      </>
    </DashboardMainContent>
  );
}

FreelancerCreateGigPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2>{page}</DashboardLayout2>;
};

export default FreelancerCreateGigPage;
