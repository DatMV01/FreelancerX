import { categories } from "@/data/data";
import React, { useState, useMemo, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import SearchTags from "./search_tag";
import { Gig } from "@/dto/gig";
import { v4 as uuidv4 } from "uuid";

interface AddGigOverviewProps {
  switchToTab: (tab: string) => void;
  tabs: { label: string }[];
}

interface categoryType {
  id: string;
  slug: string;
  title: string;
}

const AddGigOverview: React.FC<AddGigOverviewProps> = ({
  switchToTab,
  tabs,
}) => {
  const [gig, setGig] = useState<Gig>(() => {
    const gigLocalStorage = localStorage.getItem("gig");
    return gigLocalStorage ? JSON.parse(gigLocalStorage) : new Gig({});
  });

  const [title, setGigTitle] = useState<string>(gig.title || "");
  const [category, setCategory] = useState<string>(gig.category || "");
  const [subCategory, setSubCategory] = useState<string>(gig.subCategory || "");
  const [nestedSubcategory, setNestedSubcategory] = useState<string>(
    gig.nestedSubcategory || "",
  );

  const [searchTags, setSearchTags] = useState<string[]>(gig.tags || []);

  useEffect(() => {
    setGig((prev: any) => ({ ...prev, title }));
  }, [title]);

  useEffect(() => {
    setGig((prev: any) => ({ ...prev, category }));
  }, [category]);

  useEffect(() => {
    setGig((prev: any) => ({ ...prev, subCategory }));
  }, [subCategory]);

  useEffect(() => {
    setGig((prev: any) => ({ ...prev, nestedSubcategory }));
  }, [nestedSubcategory]);

  useEffect(() => {
    localStorage.setItem("gig", JSON.stringify(gig));
  }, [gig]);

  const filteredSubCategoryData = useMemo(() => {
    return categories.find((_) => _.slug === category)?.subCategories || [];
  }, [category]);

  const filteredNestedSubCategoryData = useMemo(() => {
    return (
      filteredSubCategoryData.find((_) => _.slug === subCategory)
        ?.subCategories || []
    );
  }, [subCategory, filteredSubCategoryData]);

  return (
    <div className="flex w-full flex-col space-y-8 rounded-sm border p-6">
      {/* Gig Title */}
      <div className="flex flex-row space-x-4">
        <div className="basis-1/3">
          <label className="font-semibold text-gray-700">Gig title</label>
          <p className="text-sm text-gray-500">
            As your Gig storefront, your{" "}
            <strong>title is the most important place</strong> to include
            keywords that buyers would likely use.
          </p>
        </div>
        <div className="h-full basis-2/3">
          <textarea
            value={title}
            onChange={(e) => setGigTitle(e.target.value)}
            placeholder="I will do something I'm really good at"
            maxLength={80}
            className="mt-2 h-full w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Category & Subcategory */}
      <div className="flex flex-row space-x-4">
        <div className="basis-1/3">
          <label className="font-semibold text-gray-700">Category</label>
          <p className="text-sm text-gray-500">
            Choose the category and sub-category most suitable for your Gig.
          </p>
        </div>
        <div className="flex basis-2/3 gap-4">
          <FormControl variant="standard" fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => {
                const value = e.target.value as string;
                console.log(value);
                setCategory(value);
              }}
            >
              <MenuItem value="None">
                <em>None</em>
              </MenuItem>
              {categories.map((_) => (
                <MenuItem key={_.id} value={_.slug}>
                  {_.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="standard" fullWidth>
            <InputLabel>SubCategory</InputLabel>
            <Select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value as string)}
              disabled={!filteredSubCategoryData.length}
            >
              {filteredSubCategoryData.map((_) => (
                <MenuItem key={_.id} value={_.slug}>
                  {_.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Nested Sub Category */}
      <div className="flex flex-row space-x-4">
        <div className="basis-1/3">
          <label className="font-semibold text-gray-700">
            Nested Sub Category
          </label>
        </div>
        <div className="basis-2/3">
          <FormControl variant="standard" fullWidth>
            <InputLabel>Nested Sub Category</InputLabel>
            <Select
              value={nestedSubcategory}
              onChange={(e) => setNestedSubcategory(e.target.value as string)}
              disabled={!filteredNestedSubCategoryData.length}
            >
              {filteredNestedSubCategoryData.map((_) => (
                <MenuItem key={_.id} value={_.slug}>
                  {_.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Search Tags */}
      <div className="flex flex-row space-x-4">
        <div className="basis-1/3">
          <label className="font-semibold text-gray-700">Search tags</label>
          <p className="text-sm text-gray-500">
            Tag your Gig with buzz words that are relevant to the services you
            offer. Use all 5 tags to get found.
          </p>
        </div>
        <div className="basis-2/3">
          <SearchTags searchTags={searchTags} setSearchTags={setSearchTags} />
        </div>
      </div>

      {/* Gig Metadata (Placeholder) */}
      <div className="flex flex-row space-x-4">
        <div className="basis-1/3">
          <label className="font-semibold text-gray-700">Gig metadata</label>
        </div>
        <div className="basis-2/3">Under development</div>
      </div>

      {/* Save Button */}
      <Button
        variant="contained"
        sx={{ alignSelf: "end" }}
        onClick={() => {
          if (
            title !== "" &&
            category !== "" &&
            subCategory !== "" &&
            nestedSubcategory !== "" &&
            searchTags.length != 0
          ) {
            switchToTab(tabs[1].label);
          }
        }}
      >
        Save & Continue
      </Button>
    </div>
  );
};

export default AddGigOverview;
