"use client";

import MyCkEditorWithNoSSR from "@/components/ckeditor/CkEditorWithNoSSR";
import { Button } from "@/components/ui/button";
import { categories, Category, root_categories } from "@/data/categories";
import { GigStatus } from "@/dto/dto.type.";
import GigFrequentlyAskedQuestionsInput from "@/features/gig/components/GigFrequentlyAskedQuestionsInput";
import GigGallaryInput from "@/features/gig/components/GigGallaryInput";
import GigPricingInput from "@/features/gig/components/GigPricingInput";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { signUpAsFreelancer } from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const gig_imagesUpload = [`image1`, `image2`, `image3`];
export const gig_videoUpload = [`video1`];
export const gig_documentsUpload = [`document1`, `document2`];

// schemas/gigSchema.ts
import { z } from "zod";

export const gigSchema = z.object({
  title: z.string().min(3),
  categoryId: z.string().nullable(),
  category: z.string().min(3),
  subCategoryId: z.string().nullable(),
  subCategory: z.string().min(3),
  nestedSubcategoryId: z.string().nullable(),
  nestedSubcategory: z.string().min(3),
  basicPrice: z.number(),
  standardPrice: z.number(),
  premiumPrice: z.number(),
  tags: z.array(z.string()),
  pricingPackage: z.array(
    z.object({
      id: z.union([z.number(), z.string()]),
      package: z.string(),
      basic: z.union([z.string(), z.number()]),
      standard: z.union([z.string(), z.number()]),
      premium: z.union([z.string(), z.number()]),
    }),
  ),
  description: z.string(),
  faqs: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      answer: z.string(),
    }),
  ),
  images: z.object({
    image1: z.object({
      id: z.string(),
      url: z.string().url(),
      mimeType: z.string().nullable(),
      provider: z.string().nullable(),
    }),
    image2: z.any().nullable(),
    image3: z.any().nullable(),
  }),
  documents: z.object({
    document1: z.object({
      id: z.string(),
      url: z.string().url(),
      mimeType: z.string().nullable(),
      provider: z.string().nullable(),
    }),
    document2: z.any().nullable(),
  }),
  video: z.object({
    id: z.string(),
    url: z.string().url(),
    mimeType: z.string().nullable(),
    provider: z.string().nullable(),
  }),
  status: z
    .enum([
      GigStatus.ACTIVE,
      GigStatus.PENDING,
      GigStatus.DRAFT,
      GigStatus.PAUSED,
      GigStatus.REJECTED,
      GigStatus.MODIFICATION,
    ])
    .default(GigStatus.DRAFT),
  requirements: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      type: z.enum(["text", "file"]),
      required: z.boolean(),
    }),
  ),
  seller: z.object({
    id: z.string(),
  }),
});

const SearchTags = ({
  tags,
  onSetTagsCb,
}: {
  tags?: any;
  onSetTagsCb?: any;
}) => {
  const [keywords, setKeywords] = useState<string[]>(tags || []);
  const [inputValue, setInputValue] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    onSetTagsCb && onSetTagsCb(keywords);
  }, [keywords]);

  const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = inputValue.trim();
    if ((e.key === "Enter" || e.key === "Tab") && input !== "") {
      e.preventDefault();
      if (keywords.length < 5 && !keywords.includes(input)) {
        setKeywords([...keywords, input]);
        setInputValue("");
      }
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  return (
    <div className="flex w-full flex-col space-y-2">
      <label className="block text-sm font-semibold">Positive keywords</label>
      <p className="text-xs text-gray-500">
        Enter search terms you feel your buyers will use when looking for your
        service.
      </p>
      <div className="flex min-h-[40px] flex-wrap gap-2 rounded-md border p-2">
        {keywords.map((keyword) => (
          <div
            key={keyword}
            className="flex items-center rounded-md bg-gray-200 px-2 py-1 text-sm"
          >
            {keyword}
            <button
              onClick={() => removeKeyword(keyword)}
              className="ml-2 text-gray-600 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
        <input
          type="text"
          className="flex-grow px-1 text-sm outline-none"
          placeholder=""
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={addKeyword}
        />
      </div>

      <p className="text-xs text-gray-500">
        1 tag minmum.5 tags maximum. Use letters and numbers only.
      </p>
    </div>
  );
};

const GigNew = () => {
  const {
    register,
    watch,
    setValue,
    getValues,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<z.infer<typeof gigSchema>>({
    //  resolver: zodResolver(gigSchema),
    mode: "onChange",
    //     defaultValues: {
    //       email: "admin@example.com",
    //       password: "user123",
    //     },
  });
  const [countdown, setCountdown] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"draft" | "publish">("draft");
  const router = useRouter();
  const [filterSubCategory, setFilterSubCategory] = useState<Category[]>([]);
  const [filterNestedSubCategory, setFilterNestedSubCategory] = useState<
    Category[]
  >([]);
  const [message, setMessage] = useState<{
    type: "success" | "errror";
    message: string;
  }>();

  const dispatch = useAppDispatch();

  const categoryId = watch("categoryId");
  useEffect(() => {
    if (!categoryId || categoryId === "") return;
    setValue("subCategoryId", "");
    setValue("nestedSubcategoryId", "");
    const result = categories.filter((_) => _.parentId === categoryId);

    setFilterSubCategory(result);
  }, [categoryId]);

  const subCategoryId = watch("subCategoryId");
  useEffect(() => {
    if (!subCategoryId) return;

    const result = categories.filter((_) => _.parentId === subCategoryId);
    setFilterNestedSubCategory(result);
  }, [subCategoryId]);

  const onSubmit = async (values: z.infer<typeof gigSchema>) => {
    console.log("abc");
    console.log("Submitted Data:", values);

    let countdownInterval: NodeJS.Timeout | null = null;

    try {
      if (actionType === "draft") {
        values.status = GigStatus.DRAFT;

        const response = await axiosInstanceV1.post("/gig", values);
        const { slug } = response.data;

        setMessage({
          type: "success",
          message: "Create a Gig as draft successfully!",
        });

        setCountdown(5);

        countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev === 1) {
              if (countdownInterval) {
                clearInterval(countdownInterval);
              }

              window.open(`/gig/${slug}`, "_blank", "noopener,noreferrer");

              return null;
            }
            return prev! - 1;
          });
        }, 1000);
      } else if (actionType === "publish") {
        values.status = GigStatus.ACTIVE;

        const response = await axiosInstanceV1.post("/gig", values);
        const { slug } = response.data;

        setMessage({
          type: "success",
          message: "Create a Gig as active successfully!",
        });

        setCountdown(5);

        countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev === 1) {
              if (countdownInterval) {
                clearInterval(countdownInterval);
              }
              window.open(`/gig/${slug}`, "_blank", "noopener,noreferrer");

              return null;
            }
            return prev! - 1;
          });
        }, 1000);
      }
    } catch (error: any) {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }

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

  const allValues = watch();
  useEffect(() => {
    console.log(allValues);
  }, [allValues]);

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // chặn submit
          }
        }}
      >
        <div className="grid grid-cols-12 gap-y-6">
          <div className="col-span-12 grid grid-cols-12 items-center bg-gray-200 p-8 text-green-900">
            {/* Centered Title */}
            <h1 className="col-span-4 col-start-5 text-center text-3xl font-bold">
              Create Gig
            </h1>

            {/* Buttons on the Right */}
            <div className="col-span-3 col-start-10 flex justify-end space-x-4">
              <Tooltip title="Save gig and back to gig management page">
                <button
                  className="flex items-center rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
                  onClick={async () => {
                    router.push("/gig/manage?tab=" + GigStatus.ACTIVE);
                  }}
                >
                  Back to Manage
                </button>
              </Tooltip>
            </div>
          </div>
          <div className="col-span-12 bg-green-200 p-2 text-center font-bold text-green-600">
            OVERVIEW
          </div>

          {/* Gig Title */}
          <div className="col-span-3">
            <div>
              <label className="font-semibold text-gray-700">Gig title</label>
              <p className="text-sm text-gray-500">
                As your Gig storefront, your
                <strong>title is the most important place</strong> to include
                keywords that buyers would likely use.
              </p>
            </div>
          </div>
          <div className="col-span-9">
            <textarea
              {...register("title")}
              value={watch("title")}
              placeholder="I will do something I'm really good at"
              maxLength={200}
              className="mt-2 h-full w-full rounded border p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Category & Subcategory */}
          <div className="col-span-3">
            <div>
              <label className="font-semibold text-gray-700">Category</label>
              <p className="text-sm text-gray-500">
                Choose the category and sub-category most suitable for your Gig.
              </p>
            </div>
          </div>
          <div className="col-span-9">
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="categoryId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl
                    variant="standard"
                    fullWidth
                    error={!!errors.category}
                  >
                    <InputLabel>Category</InputLabel>
                    <Select {...field}>
                      <MenuItem value="None">
                        <em>None</em>
                      </MenuItem>
                      {root_categories.map((_) => {
                        return (
                          <MenuItem key={_.id} value={`${_.id}`}>
                            {_.title}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="subCategoryId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl
                    variant="standard"
                    error={!!errors.subCategory}
                    fullWidth
                  >
                    <InputLabel>SubCategory</InputLabel>

                    <Select {...field} disabled={!filterSubCategory.length}>
                      {filterSubCategory.map((_) => (
                        <MenuItem key={_.id} value={`${_.id}`}>
                          {_.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="nestedSubcategoryId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl
                    variant="standard"
                    error={!!errors.subCategory}
                    fullWidth
                  >
                    <InputLabel>Nested Sub Category</InputLabel>
                    <Select
                      {...field}
                      disabled={!filterNestedSubCategory.length}
                    >
                      {filterNestedSubCategory.map((_) => (
                        <MenuItem key={_.id} value={`${_.id}`}>
                          {_.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </div>
          </div>

          {/* Search Tags */}
          <div className="col-span-3">
            <div>
              <label className="font-semibold text-gray-700">Search tags</label>
              <p className="text-sm text-gray-500">
                Tag your Gig with buzz words that are relevant to the services
                you offer. Use all 5 tags to get found.
              </p>
            </div>
          </div>
          <div className="col-span-9">
            <SearchTags
              onSetTagsCb={(data: any) => {
                setValue("tags", data);
              }}
            />
          </div>

          {/* Search metadata */}
          <div className="col-span-3">
            <div>
              <label className="font-semibold text-gray-700">
                Gig metadata
              </label>
            </div>
          </div>
          <div className="col-span-9">
            <div>Under development</div>
          </div>

          {/* PRICING */}
          <div className="col-span-12 bg-green-200 p-2 text-center font-bold text-green-600">
            PRICING
          </div>
          <div className="col-span-12">
            <GigPricingInput
              onPrincingPakageInputCb={(data: any) => {
                const { basicPrice, standardPrice, premiumPrice, pricing } =
                  data;

                setValue("basicPrice", basicPrice);
                setValue("standardPrice", standardPrice);
                setValue("premiumPrice", premiumPrice);
                setValue("pricingPackage", pricing);
              }}
            />
          </div>

          {/* DESCRIPTION & FAQ */}
          <div className="col-span-12 bg-green-200 p-2 text-center font-bold text-green-600">
            DESCRIPTION & FAQ
          </div>
          <div className="col-span-12">
            <div className="">
              <div>
                <p className="text-3xl">Description</p>
                <p className="text-sm">Briefly Describe Your Gig</p>
              </div>

              <MyCkEditorWithNoSSR
                onInputContentCb={(data: any) => {
                  //  console.log(data);
                  setValue("description", data);
                }}
              />
            </div>

            <div className=" ">
              <div>
                <p className="text-3xl">Frequently Asked Questions</p>
                <p className="text-sm">
                  Add Questions & Answers for Your Buyers.
                </p>
              </div>
              <GigFrequentlyAskedQuestionsInput
                onFAQsCb={(data: any) => {
                  // console.log(data);
                  setValue("faqs", data);
                }}
              />
            </div>
          </div>

          <div className="col-span-12 bg-green-200 p-2 text-center font-bold text-green-600">
            GALLERY
          </div>
          <div className="col-span-12">
            <GigGallaryInput
              onSetGallaryCb={(data: any) => {
                const { documents, images, video } = data;
                setValue("documents", documents);
                setValue("images", images);
                setValue("video", video);
              }}
            />
          </div>

          <div className="col-span-12 bg-green-200 p-2 text-center font-bold text-green-600">
            PUBLISH
          </div>

          <div className="col-span-12">
            <div className="flex h-full flex-col items-center justify-center space-y-2">
              <Image src="/gig_publish.svg" alt="" width={500} height={500} />

              <p className="text-xl font-semibold">You're almost there!</p>
              <p className="mt-2 text-gray-600">
                Let's publish your Gig and get you ready to start selling.
              </p>
              <div className="flex space-x-2">
                <Tooltip title="Save gig as paused status and open review gig pagge">
                  <Button
                    className="flex items-center rounded bg-green-500 p-2 px-2 font-bold text-white hover:bg-green-600"
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    onClick={() => setActionType("draft")}
                  >
                    {isSubmitting ? "Processing..." : "Save as Draft & Preview"}
                  </Button>
                </Tooltip>

                <Tooltip title="Save gig as actice status and open review gig pagge">
                  <Button
                    className="flex items-center rounded bg-orange-500 p-2 px-2 font-bold text-white hover:bg-orange-600"
                    disabled={isSubmitting}
                    onClick={() => setActionType("publish")}
                  >
                    {isSubmitting
                      ? "Processing..."
                      : "Save as Active & Preview"}
                  </Button>
                </Tooltip>
              </div>

              <div className="flex flex-col items-center justify-center">
                {/* ✅ Success & Error Messages */}
                {message && (
                  <p
                    className={`mt-2 text-center text-sm ${message.type === "success" ? "text-green-500" : "text-red-500"}`}
                  >
                    {message.message}
                  </p>
                )}
                {/* Hiển thị thời gian đếm ngược nếu có */}
                {countdown !== null && (
                  <p className="text-center text-sm text-gray-600">
                    Redirecting in {countdown} seconds...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GigNew;
