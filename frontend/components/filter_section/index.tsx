"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, InputAdornment } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { number, string, z } from "zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "../ui/checkbox";
import { languagesData, countriesData } from "@/data/country-languagues";
import TagList from "./tagList";
import FormExample from "./example";
const buildQueryURL = (data: Record<string, any>) => {
  const params = new URLSearchParams();

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      params.append(key, String(value));
    }

    if (
      !Array.isArray(value) &&
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      params.append(key, String(value));
    }
  });

  return `/search?${params.toString()}`;
};

const Budget = [
  { key: "Value", value: "Under $165" },
  { key: "Mid-range", value: "$165-$350" },
  { key: "High-end", value: "$350 & Above" },
  { key: "All", value: "" },
  //   { key: "Custom", value: "" },
];

const keys = Budget.map((item) => item.key) as [string, ...string[]];
const sellerLevel = [
  {
    id: "top_rate_seller",
    label: "Top Rated Seller",
  },
  {
    id: "level2",
    label: "Level 2",
  },
  {
    id: "level1",
    label: "Level 1",
  },
  {
    id: "new_seller",
    label: "New Seller",
  },
] as const;
export const FilterSection = () => {
  const formSchema = z.object({
    delivery_time: z.enum(
      ["Express 24H", "Up to 3 days", "Up to 7 days", "All"],
      {
        required_error: "You need to select a notification type.",
      },
    ),
    budget: z.union([z.enum(keys), z.string()]),
    sellerLevels: z.array(z.string().optional().nullable()),
    //.refine((value) => value.some((item) => item)),
    sellerSpeaks: z.array(z.number().optional().nullable()),
    // .refine((value) => value.some((item) => item)),
    sellerLivesIn: z.array(z.number().optional().nullable()),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      delivery_time: "All",
      budget: "All",
      sellerLevels: [],
      sellerSpeaks: [],
      sellerLivesIn: [],
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);

    console.log(buildQueryURL(form.getValues()));
  }
  const formRef = useRef<HTMLFormElement>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`${isFixed ? "z-[999] fixed left-0 top-0 w-full bg-white px-14" : "relative"}`}
    >
      <div className="flex w-full flex-wrap">
        <Popover>
          <PopoverTrigger className="mr-2 mt-2 flex items-center justify-center rounded-md border-2 p-2 font-bold">
            <span className="mr-2">Service options</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 11 7"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentFill"
            >
              <path d="M5.464 6.389.839 1.769a.38.38 0 0 1 0-.535l.619-.623a.373.373 0 0 1 .531 0l3.74 3.73L9.47.61a.373.373 0 0 1 .531 0l.619.623a.38.38 0 0 1 0 .535l-4.624 4.62a.373.373 0 0 1-.531 0Z"></path>
            </svg>
          </PopoverTrigger>
          <PopoverContent align="start">
            <div>Service options</div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger className="mr-2 mt-2 flex items-center justify-center rounded-md border-2 p-2 font-bold">
            <span className="mr-2">Seller Detail</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 11 7"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentFill"
            >
              <path d="M5.464 6.389.839 1.769a.38.38 0 0 1 0-.535l.619-.623a.373.373 0 0 1 .531 0l3.74 3.73L9.47.61a.373.373 0 0 1 .531 0l.619.623a.38.38 0 0 1 0 .535l-4.624 4.62a.373.373 0 0 1-.531 0Z"></path>
            </svg>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[450px]">
            <div>
              <Form {...form}>
                <form
                  ref={formRef}
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="max-h-[400px] space-y-8 overflow-auto"
                >
                  <FormField
                    control={form.control}
                    name="sellerLevels"
                    render={() => (
                      <div>
                        <p className="mb-2 font-semibold">Seller Level</p>
                        <FormItem className="grid grid-cols-2 grid-rows-2 gap-1">
                          {sellerLevel.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="sellerLevels"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                item.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id,
                                                ),
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-[14px]">
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                          <FormMessage />
                        </FormItem>
                      </div>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sellerSpeaks"
                    render={() => (
                      <div>
                        <p className="mb-2 font-semibold">Seller Speak</p>
                        <FormItem className="grid grid-cols-2 grid-rows-2 gap-1">
                          {languagesData.map((item, index) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="sellerSpeaks"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                item.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id,
                                                ),
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-[14px]">
                                      {item.language}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                          <FormMessage />
                        </FormItem>
                      </div>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sellerLivesIn"
                    render={() => (
                      <div>
                        <p className="mb-2 font-semibold">Seller Lives In</p>
                        <FormItem className="grid grid-cols-2 grid-rows-2 gap-1">
                          {countriesData.map((item, index) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="sellerLivesIn"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                item.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id,
                                                ),
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-[14px]">
                                      {item.country}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                          <FormMessage />
                        </FormItem>
                      </div>
                    )}
                  />
                </form>
              </Form>

              <div>
                <Button
                  onClick={() => {
                    form.resetField("sellerLevels", {
                      defaultValue: [],
                    });
                    form.resetField("sellerSpeaks", {
                      defaultValue: [],
                    });
                    form.resetField("sellerLivesIn", {
                      defaultValue: [],
                    });
                  }}
                >
                  Clear all
                </Button>
                <Button
                  type="submit"
                  onClick={() => formRef.current?.requestSubmit()}
                >
                  Submit
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger className="mr-2 mt-2 flex items-center justify-center rounded-md border-2 p-2 font-bold">
            <span className="mr-2">Budget</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 11 7"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentFill"
            >
              <path d="M5.464 6.389.839 1.769a.38.38 0 0 1 0-.535l.619-.623a.373.373 0 0 1 .531 0l3.74 3.73L9.47.61a.373.373 0 0 1 .531 0l.619.623a.38.38 0 0 1 0 .535l-4.624 4.62a.373.373 0 0 1-.531 0Z"></path>
            </svg>
          </PopoverTrigger>
          <PopoverContent align="start">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value);

                            //    value == "Custom"
                            //      ? setShowCustomInput(true)
                            //      : setShowCustomInput(false);
                          }}
                          value={field.value ?? undefined}
                          className="flex flex-col space-y-1"
                        >
                          {Object.values(Budget).map((option) => (
                            <FormItem className="flex w-full items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={option.key} />
                              </FormControl>
                              <div className="font-normal">
                                <span className="font-base text-base">
                                  {option.key}
                                </span>
                                <span className="ml-2 text-sm text-gray-500">
                                  {option.value}
                                </span>
                              </div>
                            </FormItem>
                          ))}
                          {/* 
                          <div
                            className={`${showCustomInput ? "opacity-100" : "pointer-events-none opacity-50"}`}
                          >
                            <div className="relative items-center justify-center">
                              <span className="absolute left-[10px] top-1/2 -translate-y-1/2">
                                $
                              </span>
                              <Input
                                type="number"
                                className="pl-[20px]"
                      
                              />
                            </div>
                          </div> */}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <Button
                    onClick={() =>
                      form.resetField("budget", {
                        defaultValue: "All",
                      })
                    }
                  >
                    Clear all
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </Form>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger className="mr-2 mt-2 flex items-center justify-center rounded-md border-2 p-2 font-bold">
            <span className="mr-2">Delivery time</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 11 7"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentFill"
            >
              <path d="M5.464 6.389.839 1.769a.38.38 0 0 1 0-.535l.619-.623a.373.373 0 0 1 .531 0l3.74 3.73L9.47.61a.373.373 0 0 1 .531 0l.619.623a.38.38 0 0 1 0 .535l-4.624 4.62a.373.373 0 0 1-.531 0Z"></path>
            </svg>
          </PopoverTrigger>
          <PopoverContent align="start">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div>
                  <FormField
                    control={form.control}
                    name="delivery_time"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Select delivery time</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            value={field.value}
                            className="flex flex-col space-y-1"
                          >
                            {Object.values(
                              formSchema.shape.delivery_time.enum,
                            ).map((option) => (
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value={option} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {option}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <Button
                      onClick={() =>
                        form.resetField("delivery_time", {
                          defaultValue: "All",
                        })
                      }
                    >
                      Clear all
                    </Button>
                    <Button type="submit">Submit</Button>
                  </div>
                </div>
              </form>
            </Form>
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <TagList />
      </div>

      {/* <FormExample /> */}
    </div>
  );
};
