import { categories } from "@/data/data";
import React, { useState, useMemo } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import PositiveKeywords from "./positive_keyword";

interface AddGigOverviewProps {
  switchToTab: (tab: string) => void;
  tabs: { label: string }[];
}

const AddGigOverview: React.FC<AddGigOverviewProps> = ({ switchToTab, tabs }) => {
  const [gigTitle, setGigTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [subcategory, setSubCategory] = useState<string>("");
  const [nestedSubcategory, setNestedSubcategory] = useState<string>("");

  // Lọc danh sách subcategories dựa trên category đã chọn
  const filteredSubCategoryData = useMemo(() => {
    return categories.find((cat) => cat.title === category)?.subCategories || [];
  }, [category]);

  // Lọc danh sách nested subcategories dựa trên subcategory đã chọn
  const filteredNestedSubCategoryData = useMemo(() => {
    return filteredSubCategoryData.find((sub) => sub.title === subcategory)?.subCategories || [];
  }, [subcategory, filteredSubCategoryData]);

  return (
    <div className="flex w-full flex-col space-y-8 rounded-sm border p-6">
      {/* Gig Title */}
      <div className="flex flex-row space-x-4">
        <div className="basis-1/3">
          <label className="font-semibold text-gray-700">Gig title</label>
          <p className="text-sm text-gray-500">
            As your Gig storefront, your <strong>title is the most important place</strong> to include keywords that buyers would likely use.
          </p>
        </div>
        <div className="h-full basis-2/3">
          <textarea
            value={gigTitle}
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
          <p className="text-sm text-gray-500">Choose the category and sub-category most suitable for your Gig.</p>
        </div>
        <div className="basis-2/3 flex gap-4">
          <FormControl variant="standard" fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={category} onChange={(e) => setCategory(e.target.value as string)}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.title}>
                  {cat.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="standard" fullWidth>
            <InputLabel>SubCategory</InputLabel>
            <Select
              value={subcategory}
              onChange={(e) => setSubCategory(e.target.value as string)}
              disabled={!filteredSubCategoryData.length}
            >
              {filteredSubCategoryData.map((sub) => (
                <MenuItem key={sub.id} value={sub.title}>
                  {sub.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Nested Sub Category */}
      <div className="flex flex-row space-x-4">
        <div className="basis-1/3">
          <label className="font-semibold text-gray-700">Nested Sub Category</label>
        </div>
        <div className="basis-2/3">
          <FormControl variant="standard" fullWidth>
            <InputLabel>Nested Sub Category</InputLabel>
            <Select
              value={nestedSubcategory}
              onChange={(e) => setNestedSubcategory(e.target.value as string)}
              disabled={!filteredNestedSubCategoryData.length}
            >
              {filteredNestedSubCategoryData.map((nested) => (
                <MenuItem key={nested.id} value={nested.title}>
                  {nested.title}
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
            Tag your Gig with buzz words that are relevant to the services you offer. Use all 5 tags to get found.
          </p>
        </div>
        <div className="basis-2/3">
          <PositiveKeywords />
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
        onClick={() => switchToTab(tabs[1].label)}
      >
        Save & Continue
      </Button>
    </div>
  );
};

export default AddGigOverview;
